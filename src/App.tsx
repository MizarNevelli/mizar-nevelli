import { Route, Routes } from 'react-router-dom'
import { Nav } from './components/Nav'
import { HomePage } from './pages/Home/HomePage'
import { EventLoopPage } from './pages/EventLoop/EventLoopPage'
import { EventBubblingPage } from './pages/EventBubbling/EventBubblingPage'
import { ContactPage } from './pages/Contact/ContactPage'

export default function App() {
  return (
    <div className="relative min-h-screen">
      <Nav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/event-loop" element={<EventLoopPage />} />
        <Route path="/event-bubbling" element={<EventBubblingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  )
}
