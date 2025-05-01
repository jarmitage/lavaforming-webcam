import YouTube from 'react-youtube'
import sources from './data/sources.json'
import { useState } from 'react';

function ArchiveEruption() {
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
    <div>
      <h1>Archive Eruption Page</h1>
      <YouTube
        videoId={streams[0].id}
        opts={opts}
        className="youtube-player"
      />
    </div>
  )
}

export default ArchiveEruption; 