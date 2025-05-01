import React, { useState } from 'react'
import YouTube from 'react-youtube' // Re-enabled
import './App.css'
import sources from './data/sources.json' // Re-enabled
import WebGLOverlay from './WebGLOverlay'

function App() {
  const [streams] = useState(sources.streams) // Re-enabled

  const opts = { // Re-enabled
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      loop: 1,
      playlist: streams.map(s => s.id).join(',') // Ensure loop works by providing playlist
    }
  }

  /* Removed Placeholder Content
  // --- Placeholder Content ---
  const placeholderStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '2em',
    color: 'white',
  };
  // --- End Placeholder Content ---
  */

  return (
    <div className="app">
      {/* Content container */}
      <div className="grid">
        {/* Restored YouTube grid */}
        {streams.map((stream) => (
          <div key={stream.id} className="stream-container">
            <YouTube
              videoId={stream.id} // Use videoId for initial video
              opts={opts}
              className="youtube-player"
              // onReady={(event) => event.target.playVideo()} // Optional: ensure play on ready
            />
            <div className="stream-info">
              <h3>{stream.title}</h3>
              <p>{stream.description}</p>
            </div>
          </div>
        ))}

        {/* Removed Placeholder Grid Items
        <div style={{ ...placeholderStyle, backgroundColor: '#ff5733' }}> ... </div>
        <div style={{ ...placeholderStyle, backgroundColor: '#33ff57' }}>Block 2</div>
        <div style={{ ...placeholderStyle, backgroundColor: '#3357ff' }}>Block 3</div>
        <div style={{ ...placeholderStyle, backgroundColor: '#ff33a8' }}>Block 4</div>
        */}
      </div>
      {/* WebGL Overlay Component - renders on top */}
      <WebGLOverlay />
    </div>
  )
}

export default App
