import { useEffect, useRef } from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation
} from 'react-router-dom'
import './styles/App.css'

import LiveGrid from './LiveGrid'
import ArchiveEruption from './ArchiveEruption'

const NAVIGATION_INTERVAL = 10000 // 10 seconds
const RELOAD_INTERVAL = 30000 // 30 seconds
const DEBUG_LOG_INTERVAL = 3000 // 3 seconds

function NavigationHandler() {
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const intervalId = setInterval(() => {
      const nextPath = location.pathname === '/livegrid' ? '/archiveeruption' : '/livegrid'
      console.log(`Navigating to ${nextPath}`)
      navigate(nextPath)
    }, NAVIGATION_INTERVAL)

    return () => clearInterval(intervalId)
  }, [location.pathname, navigate])

  return null
}

function App() {
  // Ref to store the timestamp of the next scheduled reload
  const nextReloadTimestamp = useRef<number>(Date.now() + RELOAD_INTERVAL)

  // Effect for periodic hard refresh and countdown logging
  useEffect(() => {
    // --- Reload Timer ---
    const reloadTimerId = setInterval(() => {
      console.log('Triggering hard refresh...')
      // Update timestamp for the *next* reload before reloading
      nextReloadTimestamp.current = Date.now() + RELOAD_INTERVAL
      window.location.reload()
    }, RELOAD_INTERVAL)

    // --- Countdown Log Timer ---
    const logTimerId = setInterval(() => {
      const remainingMs = nextReloadTimestamp.current - Date.now()
      // Ensure we don't log negative numbers if timers are slightly off
      const remainingSeconds = Math.max(0, Math.round(remainingMs / 1000))
      console.log(`[Debug] Hard refresh in approx. ${remainingSeconds} seconds.`)
    }, DEBUG_LOG_INTERVAL)

    // Cleanup timers on component unmount
    return () => {
      clearInterval(reloadTimerId)
      clearInterval(logTimerId)
    }
  }, []) // Empty dependency array ensures this runs only once on mount

  return (
    <Router basename="/lavaforming-webcam">
      <div className="app">
        <Routes>
          <Route path="/livegrid" element={<LiveGrid />} />
          <Route path="/archiveeruption" element={<ArchiveEruption />} />
          <Route path="/" element={<LiveGrid />} />
        </Routes>
        <NavigationHandler />
      </div>
    </Router>
  )
}

export default App
