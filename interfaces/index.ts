export type ChannelId = 'General' | 'LGTM' | 'Technology'

export type Message = {
  datetime: Date
  text: string
  userId: UserId
  messageId?: string
  isError?: boolean
  channelId?: ChannelId
}

export type Messages = Message[]

export type CurrentView = 'lastest' | 'previous' | 'next'

export type UserId = 'Joyse' | 'Russell' | 'Sam'
