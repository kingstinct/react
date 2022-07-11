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

import { createThemedView } from '../utils/createThemedStylesHook'
import randomHexColor from '../utils/randomHexColor'

import type { PrimitiveViewProps } from './types'

const Grid = createThemedView(({
  center,
  spaceBetween,
  spaceAround, spaceEvenly, centerY, centerX, fill, colorize, marginX, marginY, paddingY, paddingX,
  backgroundColor,
  style,
  ...props
}: PrimitiveViewProps) => ([{
  alignItems: center || centerY ? 'center' : undefined,
  backgroundColor: backgroundColor || (colorize ? randomHexColor() : undefined),
  flex: fill ? 1 : undefined,
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: spaceBetween ? 'space-between' : spaceAround ? 'space-around' : spaceEvenly ? 'space-evenly' : center || centerX ? 'center' : undefined,
  marginHorizontal: marginX,
  marginVertical: marginY,
  paddingHorizontal: paddingX,
  paddingVertical: paddingY,
  ...props,
}, style]))

export default Grid
