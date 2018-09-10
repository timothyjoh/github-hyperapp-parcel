import { h } from 'hyperapp'
import { uniq, pluck } from '../lib/lib'

const UserRow = ({id, email, clickFn}) => (
  <tr>
    <td class='tiny'>
      <a onclick={ (e) => clickFn(id) }>{email}</a>
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
      <UserRow
        id={user.id}
        email={user.email}
        clickFn={select}
      ></UserRow>
    ))}
  </tbody>
  </table>
)