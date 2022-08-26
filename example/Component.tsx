import React from 'react'

import { createThemedStylesHook } from '../src'
import { Row, Text } from '../src/primitives'

const useStyles = createThemedStylesHook(({ theme }) => ({
  container: {
    alignContent: 'center',
    backgroundColor: theme.colors.background,
  },
}))

const MyComponent = () => {
  const styles = useStyles()

  return (
    <Row style={styles.container}>
      <Text>My text</Text>
    </Row>
  )
}

export default MyComponent
