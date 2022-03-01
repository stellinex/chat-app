import { gql } from '@apollo/client'

export const MESSAGE_POST_MUTATION = gql`
  mutation MessagePost($channelId: ChannelId!, $text: String!, $userId: UserId!) {
    MessagePost(channelId: $channelId, text: $text, userId: $userId) {
      messageId
      text
      datetime
      userId
    }
  }
`
