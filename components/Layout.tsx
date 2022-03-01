import React, { ReactNode } from 'react'
import Head from 'next/head'
import styled from '@emotion/styled'

type Props = {
  children?: ReactNode
  title?: string
}

const Container = styled.div`
  height: 100vh;
`

const Layout = ({ children, title = 'This is the default title' }: Props) => (
  <Container>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    {children}
  </Container>
)

export default Layout
