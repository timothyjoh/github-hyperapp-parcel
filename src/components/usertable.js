import { h } from 'hyperapp'
import { uniq, pluck } from '../lib/lib'

const UserRow = ({id, email, user_select}) => (
  <tr>
    <td class='tiny'>
      <a onclick={ (e) => user_select(id) }>{email}</a>
      </td>
  </tr>
)

export const UserTable = ({ users, user_select }) => (
  <table id='usertable'>
  <thead>
    <th>Users</th>
  </thead>
  <tbody>
    {users.map( user => (
      <UserRow
        id={user.id}
        email={user.email}
        user_select={user_select}>
      </UserRow>
    ))}
  </tbody>
  </table>
)