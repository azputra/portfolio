import { useGLTF } from '@react-three/drei'
import { createRoot } from 'react-dom/client'
import App from './App'
import { CASUAL_URL, DANCE_URL, WALK_URL } from './components/three/LoadingDancer'
import './styles/globals.scss'

document.documentElement.dataset.theme = 'dark'
document.documentElement.classList.add('is-loading')
document.body.classList.add('is-loading')

useGLTF.preload(DANCE_URL)
useGLTF.preload(CASUAL_URL)
useGLTF.preload(WALK_URL)

createRoot(document.getElementById('root')!).render(<App />)
