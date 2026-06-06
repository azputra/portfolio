import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type SceneHoverContextValue = {
  isHoveringClickable: boolean
  pointerEnter: () => void
  pointerLeave: () => void
}

const SceneHoverContext = createContext<SceneHoverContextValue | null>(null)

export function SceneHoverProvider({ children }: { children: ReactNode }) {
  const count = useRef(0)
  const [isHoveringClickable, setIsHoveringClickable] = useState(false)

  const pointerEnter = useCallback(() => {
    count.current += 1
    if (count.current === 1) setIsHoveringClickable(true)
  }, [])

  const pointerLeave = useCallback(() => {
    count.current = Math.max(0, count.current - 1)
    if (count.current === 0) setIsHoveringClickable(false)
  }, [])

  const value = useMemo(
    () => ({ isHoveringClickable, pointerEnter, pointerLeave }),
    [isHoveringClickable, pointerEnter, pointerLeave],
  )

  return <SceneHoverContext.Provider value={value}>{children}</SceneHoverContext.Provider>
}

export function useSceneHover() {
  const ctx = useContext(SceneHoverContext)
  if (!ctx) throw new Error('useSceneHover must be used within SceneHoverProvider')
  return ctx
}
