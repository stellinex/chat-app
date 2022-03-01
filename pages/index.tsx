import Layout from '../components/Layout'
import styled from '@emotion/styled'
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react'
import { FormEvent, useState } from 'react'
import MessageList from '../components/MessageList'
import TextEditor from '../components/TextEditor'
import { ChannelId, Messages } from '../interfaces/index'
import { useMutation } from '@apollo/client'
import { MESSAGE_POST_MUTATION } from '../graphql/mutations'
import { useLocalStorage } from 'react-use'
import { FETCH_LASTEST_MESSAGES } from '../graphql/queries'

const Header = styled.header`
  display: flex;
  flex-direction: column;
  height: 64px;
  padding: 12px;
`

const Main = styled.main`
  display: flex;
  width: 100%;
  height: calc(100% - 64px);
`

const Label = styled.label`
  margin-bottom: 8px;
  font-size: 14px;
`

const Content = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
`

const ChannelTab = styled(Tab)`
  justify-content: flex-start;
  font-size: 14px;
`

const ChannelHeader = styled.div`
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding: 12px;
`

const selectedStyle = {
  bg: 'white',
  borderRadius: '4px',
  border: '1px solid #E2E8F0',
  fontWeight: 'bold',
}

const channelList = ['General', 'Technology', 'LGTM'] as ChannelId[]

const IndexPage = () => {
  const [tabIndex, setTabIndex] = useState(0)
  const [user, setUser] = useState('Sam')
  const [unsentMessages, setUnsentMessages] = useState<Messages>([])
  const [sendMessage] = useMutation(MESSAGE_POST_MUTATION, {
    refetchQueries: [FETCH_LASTEST_MESSAGES, 'MessagesFetchLatest'],
  })
  const [text, setText] = useLocalStorage('text', '')

  const toast = useToast()

  const onResendMessage = (resendText: string) => {
    sendMessage({
      variables: {
        channelId: channelList[tabIndex],
        text: resendText,
        userId: user,
      },
      onCompleted: () => {
        const waitForResendMessage = unsentMessages.filter(({ text }) => text !== resendText)
        setUnsentMessages(waitForResendMessage)
      },
      onError: () => {
        toast({
          title: 'Error',
          description: 'Failed to resend message. please try again.',
          status: 'error',
          isClosable: true,
          position: 'top',
        })
      },
    })
  }

  const onSendMessage = (e: FormEvent) => {
    e.preventDefault()
    if (text !== '') {
      sendMessage({
        variables: {
          channelId: channelList[tabIndex],
          text,
          userId: user,
        },
        onError: () => {
          setUnsentMessages([
            ...unsentMessages,
            {
              text,
              userId: user,
              isError: true,
              datetime: new Date(),
              channelId: channelList[tabIndex],
            },
          ])
          toast({
            title: 'Error',
            description: 'Failed to send message. please try again.',
            status: 'error',
            isClosable: true,
            position: 'top',
          })
        },
      })
    }
    setText('')
  }

  return (
    <Layout title="Chat app">
      <Header>
        <Text fontSize="14px" color="gray.800">
          1 day chat App
        </Text>
        <Text fontSize="12px" color="gray.600">
          All messages will be deleted at every 00:00 UTC
        </Text>
      </Header>
      <Main>
        <Content>
          <Tabs
            isLazy
            h="100%"
            w="100%"
            variant="unstyled"
            bg="#eef8ff"
            onChange={(index) => setTabIndex(index)}
          >
            <Flex h="100%" w="100%">
              <Flex
                flexDir="column"
                w="320px"
                h="100%"
                p="12px"
                border="1px solid #eee"
                borderRight="none"
              >
                <Flex flexDir="column">
                  <Label htmlFor="user">1. Choose your user</Label>

                  <Select
                    mb="12px"
                    bg="white"
                    fontSize="14px"
                    onChange={(e) => setUser(e.target.value)}
                  >
                    <option value="Sam">Sam</option>
                    <option value="Russell">Russell</option>
                    <option value="Joyse">Joyse</option>
                  </Select>
                </Flex>
                <Label>2. Choose your channel</Label>
                <TabList flexDir="column">
                  {channelList.map((channel) => {
                    return (
                      <ChannelTab
                        key={channel}
                        _selected={selectedStyle}
                      >{`${channel} Channel`}</ChannelTab>
                    )
                  })}
                </TabList>
              </Flex>
              <Flex flexDir="column" width="calc(100% - 320px)" h="100%" border="1px solid #eee">
                <TabPanels p="0" h="calc(100% - 64px)">
                  {channelList.map((channel) => {
                    return (
                      <TabPanel p="0" h="100%" key={channel}>
                        <ChannelHeader>{`${channel} Channel`}</ChannelHeader>
                        <MessageList
                          user={user}
                          channelId={channelList[tabIndex]}
                          unsentMessages={unsentMessages}
                          onResendMessage={onResendMessage}
                        />
                      </TabPanel>
                    )
                  })}
                </TabPanels>
                <TextEditor text={text} setText={setText} onSendMessage={onSendMessage} />
              </Flex>
            </Flex>
          </Tabs>
        </Content>
      </Main>
    </Layout>
  )
}

export default IndexPage
