import { h } from 'hyperapp'
import { uniq, pluck } from '../lib/lib'

const uniqueUsers = (records) => uniq(pluck("user_id")(records))

const UserRow = ({id, user_select}) => (
  <tr>
    <td><a onclick={ (e) => user_select(id) }>{id}</a></td>
  </tr>
)

export const UserTable = ({ state, user_select }) => (
  <table id='usertable'>
  <thead>
    <th>Users</th>
  </thead>
  <tbody>
    {uniqueUsers(state.lrsdata).map((user) => (
      <UserRow id={user} user_select={user_select}></UserRow>
    ))}
  </tbody>
  </table>
)