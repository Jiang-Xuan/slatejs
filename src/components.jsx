import React from 'react'
import styled from 'react-emotion'

export const Button = styled('div')`
  cursor: pointer;
`

export const Icon = styled(({ className, ...rest }) => {
  return <span className={`material-icons ${className}`} {...rest} />
})`
  font-size: 18px;
  vertical-align: text-bottom;
`

export const Menu = styled('div')`
  & > * {
    display: inline-block;
  }
  & > * + * {
    margin-left: 15px;
  }
`

export const Toolbar = styled(Menu)`
  position: relative;
  padding-bottom: 8px;
  border-bottom: 2px solid #eee;
  margin-bottom: 20px;
`
