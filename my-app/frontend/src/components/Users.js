import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Header, Icon, Table } from 'semantic-ui-react'

const Users = () => {
  const users = useSelector(({ users }) => users)

  return users && <Container>
    <Header as='h1' icon textAlign='center'>
      <Icon name='users' circular />
      <Header.Content>Users</Header.Content>
    </Header>
    <Table size='large'>
      <Table.Header>
        <Table.Row>
          <Table.Cell></Table.Cell>
          <Table.Cell># blogs created</Table.Cell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        { users.map(user => (<Table.Row key={user.id}>
          <Table.Cell><Link to={`/users/${user.id}`}>{ user.name }</Link></Table.Cell>
          <Table.Cell>{ user.blogs.length }</Table.Cell>
        </Table.Row>
        )) }
      </Table.Body>
    </Table>
  </Container> || ''
}

export default Users