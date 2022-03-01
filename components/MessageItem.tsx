import styled from '@emotion/styled'
import { Flex } from '@chakra-ui/react'
import { format } from 'date-fns'
import { WarningIcon, CheckCircleIcon } from '@chakra-ui/icons'
import { UserId } from '../interfaces/index'

const Container = styled(Flex)`
  align-items: center;
`

const MessageBody = styled(Flex)`
  padding: 6px 12px;
  border-radius: 4px;
  max-width: 360px;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
`

const Avatar = styled(Flex)`
  display: inline-flex;
  justify-content: center;
  color: white;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  font-size: 10px;
  margin-bottom: 4px;
  align-items: center;
`

const MessageAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50px;
  margin: 10px;
`

const MessageTime = styled.div`
  font-size: 12px;
  text-align: center;
  color: #808080;
`

const MessageInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #999ab8;
  margin: 8px;
`

const MessageStatus = styled.div`
  display: flex;
`

const Name = styled.div`
  font-size: 10px;
  color: #808080;
  text-align: center;
`

type Props = {
  user: UserId
  userId: UserId
  text: string
  datetime: Date
  isError?: boolean
}

const getAvatarColor = (userId: UserId) => {
  switch (userId) {
    case 'Sam':
      return { background: '#0044ff' }
    case 'Joyse':
      return { background: '#190072' }
    case 'Russell':
      return { background: '#bb194f' }
    default:
      return 'black'
  }
}

const MessageItem = ({ user, userId, text, datetime, isError = false }: Props) => {
  return (
    <Container flexDir={userId === user ? 'row-reverse' : 'row'}>
      <MessageAvatar>
        <Avatar {...getAvatarColor(userId)}>{userId.slice(0, 2).toUpperCase()}</Avatar>

        <Name>{userId}</Name>
      </MessageAvatar>
      <MessageBody
        color={userId === user ? 'white' : 'blue.900'}
        bgColor={userId === user ? 'blue.500' : 'white'}
      >
        {text}
      </MessageBody>
      <MessageInfo>
        <MessageTime>{format(new Date(datetime), 'HH:mm')}</MessageTime>
        {userId === user && (
          <MessageStatus>
            {isError ? (
              <>
                <WarningIcon color="red.500" m="4px" />
                Error
              </>
            ) : (
              <>
                <CheckCircleIcon color="green.400" m="4px" />
                Sent
              </>
            )}
          </MessageStatus>
        )}
      </MessageInfo>
    </Container>
  )
}

export default MessageItem
