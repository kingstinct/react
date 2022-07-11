import { useCallback, useState } from 'react'

function useNullableState<T = unknown>(initialValue: T | null = null): readonly [value: T | null, setValue: (value: T) => void, setNull: () => void] {
  const [value, setValue] = useState<T | null>(initialValue)

  const setNull = useCallback(() => {
    setValue(null)
  }, [])

  return [value, setValue, setNull]
}

export default useNullableState
