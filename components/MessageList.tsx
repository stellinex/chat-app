import styled from '@emotion/styled'
import { ArrowDownIcon, ArrowUpIcon, RepeatIcon } from '@chakra-ui/icons'

import { Flex } from '@chakra-ui/react'
import Button from './Button'
import { useLazyQuery, useQuery } from '@apollo/client'
import { FETCH_MORE_MESSAGES, FETCH_LASTEST_MESSAGES } from '../graphql/queries'
import { ChannelId, CurrentView, Messages } from '../interfaces/index'
import { useEffect, useRef, useState } from 'react'
import MessageItem from './MessageItem'

const Container = styled.div`
  display: flex;
  padding: 12px;
  height: calc(100% - 49px);
  flex-direction: column;
  justify-content: flex-start;
  overflow: auto;
`

type Props = {
  user: string
  channelId: ChannelId
  unsentMessages?: Messages
  onResendMessage: (text: string) => void
}

const MessageList = ({ user, channelId, unsentMessages, onResendMessage }: Props) => {
  const { data: lastestData } = useQuery(FETCH_LASTEST_MESSAGES, {
    variables: {
      channelId,
    },
  })

  const [fetchMore, { data: fetchMoreData, loading: readMoreLoading }] =
    useLazyQuery(FETCH_MORE_MESSAGES)
  const [currentView, setCurrentView] = useState<CurrentView>('lastest')

  const viewEl = useRef(null)
  const messages =
    currentView === 'lastest' ? lastestData?.MessagesFetchLatest : fetchMoreData?.MessagesFetchMore
  const messagesToDisplay = currentView === 'next' ? messages : messages?.slice().reverse()

  const handleFetchNext = () => {
    fetchMore({
      variables: {
        channelId,
        messageId: messagesToDisplay[0].messageId,
        old: false,
      },
    })
    setCurrentView('next')
  }

  const handleFetchPrevious = () => {
    fetchMore({
      variables: {
        channelId,
        messageId: messagesToDisplay[messagesToDisplay.length - 1].messageId,
        old: true,
      },
    })
    setCurrentView('previous')
  }

  const scrollToBottom = () => {
    const lastEl = viewEl.current.lastElementChild
    lastEl.scrollIntoView({
      block: 'end',
      inline: 'nearest',
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    if (currentView === 'lastest') {
      scrollToBottom()
    }
  }, [messages])

  useEffect(() => {
    setCurrentView('lastest')
  }, [lastestData])

  return (
    <Container ref={viewEl}>
      <Flex p="12px">
        <Button
          size="xs"
          variant="outline"
          onClick={handleFetchPrevious}
          isLoading={readMoreLoading}
          isDisabled={messages && messages.length < 10 && currentView === 'previous'}
        >
          Read more
          <ArrowUpIcon ml="4px" />
        </Button>
      </Flex>
      {messagesToDisplay?.map(({ userId, text, datetime, isError = false }) => {
        return (
          <MessageItem
            userId={userId}
            user={user}
            key={String(datetime)}
            text={text}
            datetime={datetime}
            isError={isError}
          />
        )
      })}

      {unsentMessages?.length !== 0 &&
        unsentMessages.map(
          ({ userId, text, datetime, isError = false, channelId: messageChannel }) => {
            if (messageChannel !== channelId) return null

            return (
              <Flex justify="flex-end" alignItems="center" key={String(datetime)}>
                <Button
                  display="inline-block"
                  size="xs"
                  onClick={() => onResendMessage(text)}
                  maxH="32px"
                  variant="outline"
                >
                  <RepeatIcon mr="4px" /> Resend
                </Button>
                <MessageItem
                  userId={userId}
                  user={user}
                  key={String(datetime)}
                  text={text}
                  datetime={datetime}
                  isError={isError}
                />
              </Flex>
            )
          },
        )}

      <Flex p="12px" mt="auto">
        <Button
          size="xs"
          variant="outline"
          onClick={handleFetchNext}
          isDisabled={messages && messages.length < 10 && currentView === 'next'}
          isLoading={readMoreLoading}
        >
          Read more
          <ArrowDownIcon ml="4px" />
        </Button>
      </Flex>
    </Container>
  )
}

export default MessageList
