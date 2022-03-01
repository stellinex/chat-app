import styled from '@emotion/styled'
import { Button as CButton, ButtonProps } from '@chakra-ui/react'

const StyledButton = styled(CButton)`
  border: none;
  border-radius: 4px;
  padding: 10px 20px;
  display: inline-block;
  height: 100%;
  font-weight: normal;
`

interface Props extends ButtonProps {
  children: React.ReactNode
  type?: 'submit' | 'button'
}

const Button = (props: Props) => {
  const { children, type, ...rest } = props
  return (
    <StyledButton colorScheme="telegram" type={type} {...rest}>
      {children}
    </StyledButton>
  )
}

export default Button
