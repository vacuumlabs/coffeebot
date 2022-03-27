import {App, HomeView} from '@slack/bolt'

export const updateHome = async (client: App['client'], userId: string, blocks: HomeView['blocks']) => {
  await client.views.publish({
    user_id: userId,
    view: {
      type: 'home',
      blocks,
    },
  })
}
