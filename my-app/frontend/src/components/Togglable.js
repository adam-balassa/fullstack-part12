import React, { useState } from 'react'
import { Button, Container } from 'semantic-ui-react'

const Togglable = ({ buttonLabel, children }) => {
  const [visible, setVisible] = useState(true)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div>
      { visible ? (<Container textAlign='center'>
        <Button onClick={toggleVisibility} style={{ margin: '2rem' }}>{buttonLabel}</Button>
      </Container>
      ) : (<>
        { React.cloneElement(children, { toggleVisibility }) }
      </>)
      }
    </div>
  )
}

export default Togglable