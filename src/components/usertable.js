import { h } from 'hyperapp'
import { uniq, pluck } from '../lib/lib'

const UserRow = ({user, clickFn}) => (
  <tr>
    <td class='tiny'>
      <a onclick={ (e) => clickFn(user.id) }>{user.external_id || 'XXX'} - {user.email}</a>
      </td>
  </tr>
)

export const UserTable = ({ users, select }) => (
  <table id='usertable'>
  <thead>
    <th>Users</th>
  </thead>
  <tbody>
    {users.map( user => (
      <UserRow user={user}
        clickFn={select}
      ></UserRow>
    ))}
  </tbody>
  </table>
)