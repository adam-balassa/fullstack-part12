import React from 'react'
import { useSelector } from 'react-redux'
import { Message } from 'semantic-ui-react'

const Notification = () => {
  const { message, error } = useSelector(({ notification }) => notification)

  return message && <div
    style={{
      position: 'fixed',
      top: 0,
      display: 'flex',
      alignItems: 'center',
      width: '100%',
      zIndex: 10
    }}>
    <Message
      style={{ textAlign: 'center', width: '100%', margin: '1rem 10%' }}
      negative={error}
      success={!error}>
      <Message.Header>{message}</Message.Header>
    </Message>
  </div>
 || ''
}

export default Notification
