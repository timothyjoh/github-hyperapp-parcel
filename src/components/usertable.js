import { h } from 'hyperapp'
import { uniq, pluck } from '../lib/lib'

const uniqueUsers = (records) => uniq(pluck("user_id")(records))

const UserRow = ({id, user_select, email}) => (
  <tr>
    <td class='tiny'>
      <a onclick={ (e) => user_select(id) }>{email}</a>
      </td>
  </tr>
)

export const UserTable = ({ state, user_select }) => (
  <table id='usertable'>
  <thead>
    <th>Users</th>
  </thead>
  <tbody>
    {Object.keys(state.lrsdata).map( user => (
      <UserRow
        id={user}
        email={state.lrsdata[user].email}
        user_select={user_select}>
      </UserRow>
    ))}
  </tbody>
  </table>
)