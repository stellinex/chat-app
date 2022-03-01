import { gql } from '@apollo/client'

export const FETCH_LASTEST_MESSAGES = gql`
  query MessagesFetchLatest($channelId: ChannelId!) {
    MessagesFetchLatest(channelId: $channelId) {
      messageId
      text
      datetime
      userId
    }
  }
`

export const FETCH_MORE_MESSAGES = gql`
  query MessagesFetchMore($channelId: ChannelId!, $messageId: String!, $old: Boolean!) {
    MessagesFetchMore(channelId: $channelId, messageId: $messageId, old: $old) {
      messageId
      text
      datetime
      userId
    }
  }
`
