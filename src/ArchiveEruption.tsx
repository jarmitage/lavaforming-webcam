import YouTube, { YouTubeProps, YouTubeEvent } from 'react-youtube'
import styles from './styles/ArchiveEruption.module.css';
import React from 'react';

const id = 'qkk-zwMQiBc'

interface YouTubePlayerState {
  player: YouTubeEvent['target'] | null;
}

class YouTubePlayer extends React.Component<Record<string, never>, YouTubePlayerState> {
  constructor(props: Record<string, never>) {
    super(props)
    this.state = {
      player: null
    }
  }

  onReady: YouTubeProps['onReady'] = (event: YouTubeEvent) => {
    console.log('[ArchiveEruption.onReady] Video ready', event)
    this.setState({ player: event.target })
    event.target.playVideo()
  }

  // onEnd: YouTubeProps['onEnd'] = (event: YouTubeEvent) => {
  //   console.log('[ArchiveEruption.onEnd] Video ended', event)
  //   this.restart()
  // }

  restart = () => {
    console.log('[ArchiveEruption.restart] Restarting video')
    if (this.state.player) {
      this.state.player.seekTo(0)
      this.state.player.playVideo()
    }
  }

  render() {
    const opts = {
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls:0,
        modestbranding: 1,
        rel: 0,
        showinfo: 0,
        loop: 1
      }
    }
    return (
      <div>
        <YouTube
          videoId={id}
          opts={opts}
          className={styles.youtubePlayer}
          onReady={this.onReady}
          onEnd={this.restart}
        />
      </div>
    )
  }
}

export default YouTubePlayer; 
