import React, { useRef, useEffect, useState } from 'react';
import './WebGLOverlay.css'; // We will create this file in the next step

const vsSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
`;

const fsSource = `
    precision mediump float;
    uniform float uTime;
    uniform float uOpacity;
    uniform vec2 uResolution;

    void main() {
        vec2 st = gl_FragCoord.xy / uResolution;
        float time = uTime * 0.5; // Default speed factor

        // Create animated wave pattern
        float wave1 = sin(st.x * 10.0 + time) * 0.5 + 0.5;
        float wave2 = sin(st.y * 10.0 + time * 0.7) * 0.5 + 0.5;
        float pattern = wave1 * wave2;

        // Create color gradient
        vec3 color1 = vec3(0.1, 0.3, 0.8); // Blue-ish
        vec3 color2 = vec3(0.8, 0.2, 0.4); // Red-ish
        vec3 color = mix(color1, color2, pattern);

        // Apply opacity variation based on pattern and global opacity uniform
        // Ensure alpha is never fully opaque unless uOpacity is 1
        float dynamicAlpha = pattern * (0.5 + 0.5 * sin(time + st.x + st.y));
        float alpha = dynamicAlpha * uOpacity;

        gl_FragColor = vec4(color, alpha);
    }
`;

// Helper function to create shaders (defined outside component for potential reuse)
const createShader = (gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type);
    if (!shader) {
        console.error('Failed to create shader');
        return null;
    }
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        // Corrected template literal for error message
        console.error(`An error occurred compiling the shaders (${type === gl.VERTEX_SHADER ? 'Vertex' : 'Fragment'}): ${gl.getShaderInfoLog(shader)}`);
        gl.deleteShader(shader);
        return null;
    }
    return shader;
};

const WebGLOverlay: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const shaderProgramRef = useRef<WebGLProgram | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);
    const startTimeRef = useRef<number>(Date.now());
    const positionBufferRef = useRef<WebGLBuffer | null>(null);
    const vertexShaderRef = useRef<WebGLShader | null>(null); // Store shader refs for cleanup
    const fragmentShaderRef = useRef<WebGLShader | null>(null);

    const [opacity, setOpacity] = useState(0.7); // Default opacity
    const [speed, setSpeed] = useState(5); // Default speed

    // --- WebGL Initialization and Render Loop Effect ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        console.log("WebGLOverlay: Initializing Effect RUNNING"); // Added for debugging

        // --- Initialize WebGL Context ---
        const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false });
        if (!gl) {
            console.error('Unable to initialize WebGL. Your browser may not support it.');
            return;
        }
        glRef.current = gl;

        // Enable blending for transparency
        gl.enable(gl.BLEND);
        // Use blendFuncSeparate for potentially different RGB/Alpha blending
        gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        // --- Create Shaders ---
        vertexShaderRef.current = createShader(gl, gl.VERTEX_SHADER, vsSource);
        fragmentShaderRef.current = createShader(gl, gl.FRAGMENT_SHADER, fsSource);
        if (!vertexShaderRef.current || !fragmentShaderRef.current) return; // Abort if shaders failed

        // --- Create Shader Program ---
        const shaderProgram = gl.createProgram();
        if (!shaderProgram) {
            console.error('Failed to create shader program');
            return;
        }
        gl.attachShader(shaderProgram, vertexShaderRef.current);
        gl.attachShader(shaderProgram, fragmentShaderRef.current);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`);
            // Clean up shaders if linking fails
            gl.deleteProgram(shaderProgram);
            if (vertexShaderRef.current) gl.deleteShader(vertexShaderRef.current);
            if (fragmentShaderRef.current) gl.deleteShader(fragmentShaderRef.current);
            return;
        }
        shaderProgramRef.current = shaderProgram;
        gl.useProgram(shaderProgram); // Use the program

        // --- Create Buffer for Quad ---
        const positions = [
            -1.0,  1.0,
             1.0,  1.0,
            -1.0, -1.0,
             1.0, -1.0,
        ];
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
        positionBufferRef.current = positionBuffer;

        // --- Link Position Attribute ---
        const aVertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        gl.vertexAttribPointer(aVertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(aVertexPosition);

        // --- Set Initial Uniforms (Resolution set in resize handler) ---
        startTimeRef.current = Date.now(); // Reset start time

        // --- Start Render Loop ---
        const renderLoop = () => {
            if (!glRef.current || !shaderProgramRef.current || !positionBufferRef.current) return;
            const gl = glRef.current;
            const shaderProgram = shaderProgramRef.current;

            // Clear with transparent background
            gl.clearColor(0.0, 0.0, 0.0, 0.0);
            gl.clear(gl.COLOR_BUFFER_BIT);

            // Update time uniform
            const currentTime = (Date.now() - startTimeRef.current) * 0.001 * speed;
            const uTimeLoc = gl.getUniformLocation(shaderProgram, 'uTime');
            if (uTimeLoc) gl.uniform1f(uTimeLoc, currentTime);

            // Update opacity uniform
            const uOpacityLoc = gl.getUniformLocation(shaderProgram, 'uOpacity');
            if (uOpacityLoc) gl.uniform1f(uOpacityLoc, opacity);

            // Ensure buffer is bound and vertex attrib array is enabled
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferRef.current);
            const aVertexPositionLoc = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
            if (aVertexPositionLoc !== -1) { // Check if attribute exists
                gl.vertexAttribPointer(aVertexPositionLoc, 2, gl.FLOAT, false, 0, 0);
                gl.enableVertexAttribArray(aVertexPositionLoc);
            }

            // Draw the quad
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            animationFrameIdRef.current = requestAnimationFrame(renderLoop);
        };

        renderLoop(); // Start the animation

        // --- Cleanup function ---
        return () => {
            console.log("WebGLOverlay: Cleanup Effect RUNNING"); // Added for debugging
            console.log("Cleaning up WebGL resources");
            if (animationFrameIdRef.current) {
                cancelAnimationFrame(animationFrameIdRef.current);
            }
            if (glRef.current) {
                const gl = glRef.current;
                // Clean up WebGL resources
                if (positionBufferRef.current) {
                    gl.deleteBuffer(positionBufferRef.current);
                }
                if (shaderProgramRef.current) {
                    gl.deleteProgram(shaderProgramRef.current);
                }
                if (vertexShaderRef.current) {
                    gl.deleteShader(vertexShaderRef.current);
                }
                if (fragmentShaderRef.current) {
                    gl.deleteShader(fragmentShaderRef.current);
                }
            }
            // Reset refs
            glRef.current = null;
            shaderProgramRef.current = null;
            positionBufferRef.current = null;
            vertexShaderRef.current = null;
            fragmentShaderRef.current = null;
            animationFrameIdRef.current = null;
        };

    }, []); // Run this effect only once on mount

    // --- Effect for updating uniforms (opacity, speed) ---
    useEffect(() => {
        const gl = glRef.current;
        const program = shaderProgramRef.current;
        if (!gl || !program) return;

        // Update uniforms directly when state changes
        const uOpacityLoc = gl.getUniformLocation(program, 'uOpacity');
        if (uOpacityLoc) gl.uniform1f(uOpacityLoc, opacity);

        // Speed doesn't have a uniform, it's used in the time calculation within renderLoop
        // But if speed affected a uniform directly, update it here.

    }, [opacity, speed]); // Dependencies: opacity and speed

    // --- Resize Handling Effect ---
    useEffect(() => {
        const handleResize = () => {
            const canvas = canvasRef.current;
            const gl = glRef.current;
            const program = shaderProgramRef.current;
            if (!canvas || !gl || !program) return;

            // Get container dimensions
            const container = canvas.parentElement;
            if (!container) return;

            const displayWidth = container.clientWidth;
            const displayHeight = container.clientHeight;

            // Check if the canvas size needs to change.
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                // Make the canvas resolution match its display size.
                canvas.width = displayWidth;
                canvas.height = displayHeight;

                // Update WebGL viewport and resolution uniform
                gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
                const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
                if (uResolutionLoc) {
                  gl.uniform2f(uResolutionLoc, gl.drawingBufferWidth, gl.drawingBufferHeight);
                }
            }
        };

        // Initial resize
        handleResize();

        // Add resize listener
        window.addEventListener('resize', handleResize);

        // Cleanup listener
        return () => window.removeEventListener('resize', handleResize);

    }, []); // Run only once on mount

    return (
        <div className="webgl-overlay-container"> {/* Added a container div */}
            <canvas ref={canvasRef} className="webgl-canvas"></canvas>
            {/* Optional Controls - consider moving styling to CSS */}
            <div className="webgl-controls">
                <label>
                    Opacity: <input type="range" min="0" max="1" step="0.01" value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} />
                    <span>{(opacity * 100).toFixed(0)}%</span>
                </label>
                <label>
                    Speed: <input type="range" min="0" max="10" step="0.1" value={speed} onChange={(e) => setSpeed(parseFloat(e.target.value))} />
                    <span>{speed.toFixed(1)}</span>
                </label>
            </div>
        </div>
    );
};

export default WebGLOverlay; 