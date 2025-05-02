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

const NAVIGATION_INTERVAL = 300000 // 5 minutes
const NAVIGATION_DEBUG_LOG_INTERVAL = 3000 // 3 seconds
const RELOAD_INTERVAL = 600000 // 10 minutes
const RELOAD_DEBUG_LOG_INTERVAL = 30000 // 30 seconds

function NavigationHandler() {
  const navigate = useNavigate()
  const location = useLocation()
  // Ref to store the timestamp of the next scheduled navigation
  const nextNavigationTimestamp = useRef<number>(Date.now() + NAVIGATION_INTERVAL)

  useEffect(() => {
    const intervalId = setInterval(() => {
      // Treat '/' and '/livegrid' the same for deciding the next path
      const isLiveGridEquivalent = location.pathname === '/livegrid' || location.pathname === '/';
      const nextPath = isLiveGridEquivalent ? '/archiveeruption' : '/livegrid'
      console.log(`Navigating to ${nextPath}`)
      // Update timestamp for the *next* navigation before navigating
      nextNavigationTimestamp.current = Date.now() + NAVIGATION_INTERVAL
      navigate(nextPath)
    }, NAVIGATION_INTERVAL)

    // --- Navigation Debug Log Timer ---
    const navigationDebugLogTimerId = setInterval(() => {
      // Treat '/' and '/livegrid' the same for deciding the next path for logging
      const isLiveGridEquivalent = location.pathname === '/livegrid' || location.pathname === '/';
      const nextPath = isLiveGridEquivalent ? '/archiveeruption' : '/livegrid'
      // Calculate remaining time
      const remainingMs = nextNavigationTimestamp.current - Date.now()
      const remainingSeconds = Math.max(0, Math.round(remainingMs / 1000))
      console.log(`[Debug] Navigating to ${nextPath} in approx. ${remainingSeconds} seconds.`)
    }, NAVIGATION_DEBUG_LOG_INTERVAL)

    return () => {
      clearInterval(intervalId)
      clearInterval(navigationDebugLogTimerId)
    }
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
      console.log('Triggering hard refresh to base route...')
      // Update timestamp for the *next* reload before reloading
      nextReloadTimestamp.current = Date.now() + RELOAD_INTERVAL
      // Navigate to the base route instead of just reloading
      window.location.href = '/lavaforming-webcam/';
    }, RELOAD_INTERVAL)

    // --- Countdown Log Timer ---
    const logTimerId = setInterval(() => {
      const remainingMs = nextReloadTimestamp.current - Date.now()
      // Ensure we don't log negative numbers if timers are slightly off
      const remainingSeconds = Math.max(0, Math.round(remainingMs / 1000))
      console.log(`[Debug] Hard refresh in approx. ${remainingSeconds} seconds.`)
    }, RELOAD_DEBUG_LOG_INTERVAL)

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
