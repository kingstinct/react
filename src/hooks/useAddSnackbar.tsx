import { useCallback, useContext } from 'react'

import { SnackbarContext } from '../contexts/Snackbar'

import type { SnackbarConfig } from '../contexts/Snackbar'

function useAddSnackbar<TMap extends Record<string, unknown> = Record<string, unknown>, T extends keyof TMap = keyof TMap>(defaultSnackbarConfig?: Omit<SnackbarConfig<TMap, T>, 'title'>) {
  const { addSnackbar } = useContext(SnackbarContext)

  return useCallback(function ShowSnackbar<TMapInner extends Record<string, unknown> = TMap, TInner extends keyof TMapInner = keyof TMapInner>(title: string, snackbarConfig?: Omit<SnackbarConfig<TMapInner, TInner>, 'title'>) {
    addSnackbar<TMapInner, TInner>({ ...defaultSnackbarConfig, ...snackbarConfig, title } as SnackbarConfig<TMapInner, TInner>)
  }, [addSnackbar, defaultSnackbarConfig])
}

export default useAddSnackbar
