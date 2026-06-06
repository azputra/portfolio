import { useEffect } from 'react'
import { useRoomAudio } from '../context/RoomAudioContext'

type RoomAudioAutoplayProps = {
  ready: boolean
}

export function RoomAudioAutoplay({ ready }: RoomAudioAutoplayProps) {
  const { tryAutoplay } = useRoomAudio()

  useEffect(() => {
    if (!ready) return
    void tryAutoplay()
  }, [ready, tryAutoplay])

  return null
}
