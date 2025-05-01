import { useState } from 'react'
import YouTube from 'react-youtube'
import sources from './data/sources.json'
import WebGLOverlay from './WebGLOverlay'
import './App.css'

function LiveGrid() {
  const [streams] = useState(sources.streams)

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
    <div className="grid">
      {streams.map((stream) => (
        <div key={stream.id} className="stream-container">
          <YouTube
            videoId={stream.id}
            opts={opts}
            className="youtube-player"
          />
          <div className="stream-info">
            <h3>{stream.title}</h3>
            <p>{stream.description}</p>
          </div>
        </div>
      ))}
      <WebGLOverlay />
    </div>
  )
}

export default LiveGrid 