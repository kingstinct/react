import { useCallback, useContext } from 'react'

import { SnackbarContext } from '../contexts/Snackbar'

import type { SnackbarConfig } from '../contexts/Snackbar'

function useAddSnackbar<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(defaultSnackbarConfig?: SnackbarConfig<TMap, T>) {
  const { addSnackbar } = useContext(SnackbarContext)

  return useCallback(function ShowSnackbar<TMapInner extends Record<string, unknown> = TMap, TInner extends keyof TMapInner = keyof TMapInner>(snackbarConfig: SnackbarConfig<TMapInner, TInner>) {
    addSnackbar<TMapInner, TInner>({ ...defaultSnackbarConfig, ...snackbarConfig } as SnackbarConfig<TMapInner, TInner>)
  }, [])
}

export default useAddSnackbar
