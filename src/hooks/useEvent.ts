import { useCallback, useEffect, useRef } from 'react'

// https://gist.github.com/diegohaz/695097a06f038a707c3a1b11e4e40195

type AnyFunction = (...args: readonly unknown[]) => void

function useEvent<T extends AnyFunction>(handler: T) {
  const handlerRef = useRef<AnyFunction>()

  // In a real implementation, this would run before layout effects
  useEffect(() => {
    handlerRef.current = handler
  })

  // eslint-disable-next-line
  // @ts-ignore
  return useCallback<AnyFunction>((...args) => handlerRef.current?.apply(null, args), []) as T
}

export default useEvent
