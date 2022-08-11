/*
Goals:
- simple and reasonaboutable layout
- easy to use - easier to read with main props lifted to prop level
- colorize is nice to quickly see what happens when developing

examples:

      <Grid colorize spaceEvenly>
        <Column colorize center width='50%' height={100}>
          <Text colorize>hello</Text>
        </Column>
        <Column colorize center width='50%' height={100}>
          <Text colorize>hello</Text>
        </Column>
        <Column colorize width='50%' height={100} center>
          <Text colorize center>hello</Text>
        </Column>
      </Grid>
      <Row colorize margin={10}>
        <Column fill colorize center padding={20}><Text>dfg</Text></Column>
      </Row>
*/

import { match } from 'ts-pattern'

import { createThemedView } from '../utils/createThemedStylesHook'
import randomHexColor from '../utils/randomHexColor'

import type { PrimitiveViewProps } from './types'

export type RowProps = PrimitiveViewProps & {
  readonly wrap?: boolean
}

const Row = createThemedView(({
  center,
  spaceBetween,
  spaceAround,
  spaceEvenly,
  centerY,
  centerX,
  fill,
  colorize,
  marginX,
  marginY,
  backgroundColor,
  paddingY,
  paddingX,
  wrap,
  style,
  ...props
}: RowProps) => ([
  {
    alignItems: center || centerY ? 'center' : undefined,
    backgroundColor: backgroundColor || (colorize ? randomHexColor() : undefined),
    flex: fill ? 1 : undefined,
    flexDirection: 'row',
    flexWrap: wrap ? 'wrap' : undefined,
    justifyContent: match({
      spaceBetween, spaceAround, spaceEvenly, center, centerX,
    })
      .with({ spaceBetween: true }, () => 'space-between' as const)
      .with({ spaceAround: true }, () => 'space-around' as const)
      .with({ spaceEvenly: true }, () => 'space-evenly' as const)
      .with({ center: true }, () => 'center' as const)
      .with({ centerX: true }, () => 'center' as const)
      .otherwise(() => undefined),
    marginHorizontal: marginX,
    marginVertical: marginY,
    paddingHorizontal: paddingX,
    paddingVertical: paddingY,
    ...props,
  }, style,
]))

export default Row
