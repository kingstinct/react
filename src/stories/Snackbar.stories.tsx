import React from 'react'

import DefaultSnackbarComponent from '../components/SnackbarComponent'

import type { DefaultSnackbarComponentProps } from '../components/SnackbarComponent'
import type { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Example/Snackbar',
  component: DefaultSnackbarComponent,
  argTypes: {
    buttonColor: { control: 'color' },
    textColor: { control: 'color' },
    doDismiss: { action: 'doDismiss' },
  },
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof DefaultSnackbarComponent>

const Template: ComponentStory<typeof DefaultSnackbarComponent> = (props) => {
  // eslint-disable-next-line functional/immutable-data, @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const textStyle = { ...props.textStyle, color: props.textColor }
  return <DefaultSnackbarComponent {...props} textStyle={textStyle} />
}

export const Snickers = Template.bind({})

// eslint-disable-next-line functional/immutable-data
Snickers.args = {
  // 'style: { backgroundColor: 'black' },
  buttonColor: 'red',
  textColor: 'purple',
  snackbarConfig: { title: 'hello', actions: [{ label: 'ok' }] },
  textStyle: { },
  style: { backgroundColor: '#eee' },
} as Partial<DefaultSnackbarComponentProps>

// eslint-disable-next-line functional/immutable-data
Snickers.parameters = {
  controls: {
    exclude: [
      'index', 'id', 'doDismiss', 'entering', 'exiting', 'layout',
    ],
  },
}
