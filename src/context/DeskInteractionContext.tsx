import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type DeskInteractionContextValue = {
  showSideWebsite: boolean
  toggleSideWebsite: () => void
  kaabaSparkleKey: number
  triggerKaabaSparkle: () => void
}

const DeskInteractionContext = createContext<DeskInteractionContextValue | null>(null)

export function DeskInteractionProvider({ children }: { children: ReactNode }) {
  const [showSideWebsite, setShowSideWebsite] = useState(false)
  const [kaabaSparkleKey, setKaabaSparkleKey] = useState(0)

  const toggleSideWebsite = useCallback(() => {
    setShowSideWebsite((prev) => !prev)
  }, [])

  const triggerKaabaSparkle = useCallback(() => {
    setKaabaSparkleKey((k) => k + 1)
  }, [])

  const value = useMemo(
    () => ({
      showSideWebsite,
      toggleSideWebsite,
      kaabaSparkleKey,
      triggerKaabaSparkle,
    }),
    [showSideWebsite, toggleSideWebsite, kaabaSparkleKey, triggerKaabaSparkle],
  )

  return (
    <DeskInteractionContext.Provider value={value}>{children}</DeskInteractionContext.Provider>
  )
}

export function useDeskInteraction() {
  const ctx = useContext(DeskInteractionContext)
  if (!ctx) throw new Error('useDeskInteraction must be used within DeskInteractionProvider')
  return ctx
}
