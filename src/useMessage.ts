import { useCallback, useState } from 'react'

export default function useMessage(initialValue?: string) {
  const [message, setMessage] = useState<string | undefined>(initialValue)

  const unset = useCallback(() => setMessage(undefined), [])

  return [message, setMessage, unset] as const
}
