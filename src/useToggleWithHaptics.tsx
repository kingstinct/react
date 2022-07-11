import { useCallback, useState } from 'react'

import doHaptics from './doHaptics'

function useToggleWithHaptics(initialValue = false, enableHaptics: boolean | undefined = undefined) {
  const [value, setValue] = useState(initialValue)

  const toggle = useCallback(() => {
    void doHaptics(enableHaptics)
    setValue((prev) => !prev)
  }, [])

  return [value, toggle] as const
}

export default useToggleWithHaptics
