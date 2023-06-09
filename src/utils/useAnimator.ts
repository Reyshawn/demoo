import { useCallback, useMemo, useRef, useState } from "react"
import {
  getCurve,
  EasingAnimatorConfiguration,
  AnimationFrame,
  AnimationState,
  createAnimator,
  InteractiveAnimator,
  convertAnimator
 } from "./animation"


export function useAnimator(): [AnimationFrame, InteractiveAnimator<EasingAnimatorConfiguration>] {
  
  const [rendering, setRendering] = useState(0)
  const frame = useRef<AnimationFrame>({
    elapsedTime: 0,
    values: []
  })

  const state = useRef<AnimationState<EasingAnimatorConfiguration>>({
    status: "inactive",
    startTime: 0,
    pausedTime: 0,
    rafId: null
  })

  const tick = useCallback((now: DOMHighResTimeStamp) => {
    const config = state.current.config!
    const { duration, easing } = config
    const f = frame.current
    const {startTime, pausedTime} = state.current
    
    const elapsed = Math.max(0, pausedTime + now - startTime)

    if (elapsed >= duration) {
      state.current.status = "finished"
      f.values = [...config.to]
      f.elapsedTime = duration
      setRendering(i => i+1)
      return
    }

    const progress = elapsed / duration

    const curve = getCurve(easing)

    f.elapsedTime = elapsed
    f.values = config.from.map((f, index) => f + (config.to[index] - f) * curve(progress))

    setRendering(i => i+1)
    state.current.rafId = requestAnimationFrame(tick)
  }, [])

  const a = createAnimator<EasingAnimatorConfiguration>(setRendering, frame.current, state.current, tick)
  const ia = useMemo(() => {
    const set = (progress: number) => {
      // TODO
      const config = state.current.config!
      const {duration, easing} = config
      if (ia.status === "running") {
        return
      }

      ia.status === "inactive"
      const elasped = progress * duration
      
      const curve = getCurve(easing)
      frame.current.elapsedTime = elasped
      frame.current.values = config.from.map((f, index) => f + (config.to[index] - f) * curve(progress))


      setRendering(i => i+1)
    }

    return convertAnimator(a, set)
  }, [])

  return [frame.current, ia]
}
