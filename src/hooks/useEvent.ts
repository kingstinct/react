import { useCallback, useEffect, useRef } from 'react'

function useEvent<T extends readonly unknown[], TRet = unknown>(handler: (...args: T) => TRet) {
  const handlerRef = useRef<(...args: T) => void>()

  // In a real implementation, this would run before layout effects
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  return useCallback((...args: T) => {
    // In a real implementation, this would throw if called during render
    const fn = handlerRef.current

    if (!fn) {
      throw Error('no function registered, this should never happen')
    }

    return fn(...args)
  }, [])
}

export default useEvent
