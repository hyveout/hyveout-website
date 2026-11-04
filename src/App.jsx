import { Suspense, lazy } from 'react'
import './css/App.css'
import { Routes, Route } from 'react-router'
import LoadingScreen from './components/LoadingScreen'
import creativeDirection from './data/creativeDirection'

const Landing = lazy(() => import('./pages/Landing'))
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
const Games = lazy(() => import('./pages/Games'))
const Contact = lazy(() => import('./pages/Contact'))
const Mind = lazy(() => import('./pages/Mind'))
const Shop = lazy(() => import('./pages/Shop'))
const Media = lazy(() => import('./pages/Media'))
const MediaSelect = lazy(() => import('./pages/MediaSelect'))
const Graphics = lazy(() => import('./pages/Graphics'))
const Visualizers = lazy(() => import('./pages/Visualizers'))
const CreativeDirection = lazy(() => import('./pages/CreativeDirection'))

function App() {
  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Routes>
        <Route exact path="/" element={<Landing/>} />
        <Route path='/home' element={<Home/>} />
        <Route path='/media' element={<Media/>} />
        <Route path='/mediaSelect' element={<MediaSelect/>} />
        <Route path="/graphics" element={<Graphics/>} />
        <Route path='/visualizers' element={<Visualizers/>} />
        <Route path='/about' element={<About/>} />
        <Route path='/games' element={<Games/>} />
        <Route path='/contact' element={<Contact/>} />
        <Route path='/mind' element={<Mind/>} />
        <Route path='/creative' element={<CreativeDirection/>} />
        {creativeDirection.map((a) => (
          <Route key={a.slug} path={`/creative/${a.slug}`} element={<CreativeDirection key={a.slug} artist={a.slug}/>} />
        ))}
        <Route path='/shop' element={<Shop/>} />
      </Routes>
    </Suspense>
  )
}

export default App
