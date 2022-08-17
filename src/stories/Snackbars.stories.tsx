import { within, userEvent } from '@storybook/testing-library'
import React from 'react'

import Snackbars from './Snackbars'

import type { ComponentStory, ComponentMeta } from '@storybook/react'

export default {
  title: 'Example/Snackbars',
  component: Snackbars,
  parameters: {
    // More on Story layout: https://storybook.js.org/docs/react/configure/story-layout
    layout: 'fullscreen',
  },
} as ComponentMeta<typeof Snackbars>

const Template: ComponentStory<typeof Snackbars> = (args) => <Snackbars />

export const Snackis = Template.bind({})
// eslint-disable-next-line functional/immutable-data
Snackis.args = {}
