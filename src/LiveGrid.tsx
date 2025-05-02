import { useState, useEffect } from 'react'
import YouTube from 'react-youtube'
import sources from './data/sources.json'
// import WebGLOverlay from './WebGLOverlay'
import styles from './styles/LiveGrid.module.css'
import './styles/App.css'

// Define a type for the styles we'll generate
type StreamStyle = {
  top: string;
  left: string;
  width: string;
  height: string;
  zIndex: number;
};

// Control parameter (0 = grid, 1 = max random)
const randomness = 0.2; // Adjust this value between 0 and 1

function LiveGrid() {
  const [streams] = useState(sources.streams)
  const [streamStyles, setStreamStyles] = useState<Record<string, StreamStyle>>({}) // State for styles

  useEffect(() => {
    const newStyles: Record<string, StreamStyle> = {}
    const maxZIndex = streams.length // For stacking
    const gridCols = 2; // Define grid columns

    streams.forEach((stream, index) => { // Use index now
      // Calculate original grid position
      const rowIndex = Math.floor(index / gridCols);
      const colIndex = index % gridCols;

      const baseTopPercent = rowIndex * 50; // 0 or 50
      const baseLeftPercent = colIndex * 50; // 0 or 50

      // Random offset scaled by randomness
      const maxOffsetRange = 50; // Max total range (e.g., +/- 25%)
      const currentOffsetRange = maxOffsetRange * randomness;
      const offsetTop = (Math.random() - 0.5) * currentOffsetRange;
      const offsetLeft = (Math.random() - 0.5) * currentOffsetRange;

      // Size variation scaled by randomness
      const baseSize = 50; // Base size (50%)
      const maxSizeVariation = 50; // Max variation (adds 0% to 50%)
      const widthVariation = Math.random() * maxSizeVariation * randomness;
      const heightVariation = Math.random() * maxSizeVariation * randomness;

      const width = baseSize + widthVariation;
      const height = baseSize + heightVariation;

      const zIndex = Math.floor(Math.random() * maxZIndex) // Random stacking order

      newStyles[stream.id] = {
        top: `calc(${baseTopPercent}% + ${offsetTop}%)`,
        left: `calc(${baseLeftPercent}% + ${offsetLeft}%)`,
        width: `${width}%`,
        height: `${height}%`,
        zIndex: zIndex,
      }
    })

    setStreamStyles(newStyles)
  }, [streams]) // Depend on streams array (though it's static here)

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      mute: 1,
      controls: 0,
      modestbranding: 1,
      rel: 0,
      showinfo: 0,
      loop: 1
    }
  }

  return (
    <div className={styles.grid}>
      {streams.map((stream) => (
        <div
          key={stream.id}
          className={styles.streamContainer}
          style={streamStyles[stream.id]} // Apply dynamic styles
        >
          <YouTube
            videoId={stream.id}
            opts={opts}
            className={styles.youtubePlayer}
          />
          {/* <div className={styles.streamInfo}>
            <h3>{stream.title}</h3>
            <p>{stream.description}</p>
          </div> */}
        </div>
      ))}
      {/* <WebGLOverlay /> */}
    </div>
  )
}

export default LiveGrid 