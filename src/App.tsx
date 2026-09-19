import './index.css'
import Nav from './components/Nav'
import Hero from './components/Hero'
import About from './components/About'
import Music from './components/Music'
import Video from './components/Video'
import Gallery from './components/Gallery'
import Press from './components/Press'
import Shows from './components/Shows'
import Booking from './components/Booking'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Music />
        <Video />
        <Gallery />
        <Press />
        <Shows />
        <Booking />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
