import { h } from 'hyperapp';
import { state } from './state';
import { UserTable } from './components/usertable'
import { DataTable } from './components/datatable'
import { InputFields } from './components/inputs'
import { Report } from './components/report/report'

const no_user = actions => (
  <button
  class="fetch_users"
  onclick={ e => actions.get_users() }
  >Fetch Users</button>
)

const selected_user = user => (
  <h3>
    { user.email }
    &mdash;
    {user.firstname} {user.lastname}
    <em>{ user.external_id }</em>
  </h3>
)

export const view = (state, actions) => (
  <section>
    <h2>Search Propel2 LRS</h2>
    { state.user.id ? selected_user(state.user) : no_user(actions) }
    <Report state={state}></Report>
    <div class='tables'>
      <UserTable users={state.users} select={actions.user_select} />
      <DataTable data={state.displaydata}></DataTable>
    </div>
  </section>
);