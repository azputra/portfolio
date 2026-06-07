import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

const STORAGE_KEY = 'portfolio-music'
/** Porchlight Golden Hour — CC0 chillhop from https://github.com/btahir/open-lofi */
const MUSIC_SRC = '/audio/lofi.mp3'
const MUSIC_VOLUME = 0.16

type RoomAudioContextValue = {
  isPlaying: boolean
  toggleMusic: () => void
  tryAutoplay: () => Promise<boolean>
}

const RoomAudioContext = createContext<RoomAudioContextValue | null>(null)

function isMusicMutedByUser(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'off'
}

export function RoomAudioProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(() => !isMusicMutedByUser())

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.volume = MUSIC_VOLUME
    audio.preload = 'auto'
    audio.load()
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
      audioRef.current = null
    }
  }, [])

  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false

    try {
      await audio.play()
      setIsPlaying(true)
      localStorage.setItem(STORAGE_KEY, 'on')
      return true
    } catch {
      setIsPlaying(false)
      return false
    }
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.pause()
    setIsPlaying(false)
    localStorage.setItem(STORAGE_KEY, 'off')
  }, [])

  const toggleMusic = useCallback(() => {
    if (isPlaying) {
      pause()
      return
    }
    void play()
  }, [isPlaying, pause, play])

  const tryAutoplay = useCallback(async () => {
    if (isMusicMutedByUser()) return false
    return play()
  }, [play])

  useEffect(() => {
    if (isMusicMutedByUser()) return

    const audio = audioRef.current
    if (!audio) return

    const attempt = () => {
      void tryAutoplay()
    }

    attempt()

    const onReady = () => attempt()
    audio.addEventListener('canplaythrough', onReady)
    audio.addEventListener('loadeddata', onReady)

    let retries = 0
    const retryTimer = window.setInterval(() => {
      if (!audioRef.current?.paused || retries >= 24) {
        window.clearInterval(retryTimer)
        return
      }
      retries += 1
      attempt()
    }, 500)

    const unlock = () => {
      if (!isMusicMutedByUser() && audioRef.current?.paused) {
        attempt()
      }
    }

    window.addEventListener('pointerdown', unlock)
    window.addEventListener('keydown', unlock)
    window.addEventListener('touchstart', unlock, { passive: true })
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') unlock()
    })

    return () => {
      audio.removeEventListener('canplaythrough', onReady)
      audio.removeEventListener('loadeddata', onReady)
      window.clearInterval(retryTimer)
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
  }, [tryAutoplay])

  const value = useMemo(
    () => ({
      isPlaying,
      toggleMusic,
      tryAutoplay,
    }),
    [isPlaying, toggleMusic, tryAutoplay],
  )

  return <RoomAudioContext.Provider value={value}>{children}</RoomAudioContext.Provider>
}

export function useRoomAudio() {
  const ctx = useContext(RoomAudioContext)
  if (!ctx) throw new Error('useRoomAudio must be used within RoomAudioProvider')
  return ctx
}
