import {ActionsBlock, Button, ContextBlock, DividerBlock, HeaderBlock, InputBlock, SectionBlock} from '@slack/bolt'

export const getHeaderBlock = (text: string): HeaderBlock => ({
  type: 'header',
  text: {
    type: 'plain_text',
    text,
  },
})

export const getSectionBlock = (text: string): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text,
  },
})

export const getContextBlock = (text: string): ContextBlock => ({
  type: 'context',
  elements: [
    {
      type: 'mrkdwn',
      text,
    },
  ],
})

type ButtonInfo = {
  action_id: string
  text: string
  style?: Button['style']
}

export const getButton = ({action_id, text, style}: ButtonInfo): Button => ({
  type: 'button',
  action_id,
  text: {
    type: 'plain_text',
    text,
  },
  style,
})

export const getSectionBlockWithButton = (text: string, button: ButtonInfo): SectionBlock => ({
  type: 'section',
  text: {
    type: 'mrkdwn',
    text,
  },
  accessory: getButton(button),
})

type ActionsInfo = {
  block_id: string
  elements: Button[]
}

export const getActionsBlock = ({block_id, elements}: ActionsInfo): ActionsBlock => ({
  type: 'actions',
  block_id,
  elements,
})

type InputInfo = {
  block_id: string
  text: string
  action_id: string
}

export const getInputBlock = ({block_id, text, action_id}: InputInfo): InputBlock => ({
  type: 'input',
  block_id,
  label: {
    type: 'plain_text',
    text,
  },
  element: {
    type: 'plain_text_input',
    action_id,
  },
})

export const getDividerBlock = (): DividerBlock => ({
  type: 'divider',
})
