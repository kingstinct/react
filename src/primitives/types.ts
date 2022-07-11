import type { TextStyle, ViewStyle } from 'react-native'

export type SharedProps = {
  readonly center?: boolean,
  readonly centerX?: boolean,
  readonly centerY?: boolean,
  readonly colorize?: boolean,
  readonly fill?: boolean,
  readonly height?: number | string,
  readonly margin?: number | string,
  readonly marginBottom?: number | string,
  readonly marginLeft?: number | string,
  readonly marginRight?: number | string,
  readonly marginTop?: number | string,
  readonly marginX?: number | string,
  readonly marginY?: number | string,
  readonly padding?: number | string,
  readonly paddingBottom?: number | string,
  readonly paddingLeft?: number | string,
  readonly paddingRight?: number | string,
  readonly paddingTop?: number | string,
  readonly paddingX?: number | string,
  readonly paddingY?: number | string,
  readonly width?: number | string,
}

export type PrimitiveViewProps = SharedProps & {
  readonly spaceBetween?: boolean,
  readonly spaceAround?: boolean,
  readonly spaceEvenly?: boolean,
  readonly style?: ViewStyle,
  readonly borderRadius?: number,
  readonly backgroundColor?: string,
}

export type TextProps = SharedProps & {
  readonly fontSize?: number,
  readonly fontWeight?: TextStyle['fontWeight'],
  readonly style?: TextStyle,
}
