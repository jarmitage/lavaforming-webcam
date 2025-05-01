import YouTube from 'react-youtube'
import styles from './styles/ArchiveEruption.module.css';

const id = 'qkk-zwMQiBc'

function ArchiveEruption() {

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
        videoId={id}
        opts={opts}
        className={styles.youtubePlayer}
      />
    </div>
  )
}

export default ArchiveEruption; 