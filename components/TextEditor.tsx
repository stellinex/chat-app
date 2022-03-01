import { Input } from '@chakra-ui/react'
import Button from './Button'
import styled from '@emotion/styled'
import { FormEvent } from 'react'

type Props = {
  text: string
  setText: (text: string) => void
  onSendMessage: (e: FormEvent) => void
}

const Form = styled.form`
  border-top: 1px solid #eee;
  display: flex;
  padding: 12px;
`

const TextEditor = ({ onSendMessage, text, setText }: Props) => {
  return (
    <Form onSubmit={(e) => onSendMessage(e)}>
      <Input
        flexGrow={1}
        width="auto"
        mr="12px"
        bg="white"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type you message here..."
      />
      <Button type="submit">Send message</Button>
    </Form>
  )
}

export default TextEditor
