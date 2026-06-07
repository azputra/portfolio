import { useEffect } from 'react'
import { useRoomAudio } from '../context/RoomAudioContext'

export function RoomAudioAutoplay() {
  const { tryAutoplay } = useRoomAudio()

  useEffect(() => {
    void tryAutoplay()
  }, [tryAutoplay])

  return null
}
