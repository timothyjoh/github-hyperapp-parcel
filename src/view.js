import { h } from 'hyperapp';
import { state } from './state';
import { UserTable } from './components/usertable'
import { DataTable } from './components/datatable'
import { InputFields } from './components/inputs'
import { Report } from './components/report'

const no_user = (actions) => (
  <button
  class="fetch_users"
  onclick={ e => actions.get_users() }
  >Fetch Users</button>
)

const selected_user = ({user}) => {
  <h3>
    <em>{ user.id }</em>
    { user.email }
  </h3>
}

export const view = (state, actions) => (
  <section>
    <h2>Search Propel2 LRS</h2>
    <InputFields state={state} actions={actions} />
    <br />
    { state.user.id ? selected_user(state.user) : no_user(actions) }
    <div class='tables'>
      <UserTable state={state} user_select={actions.user_select}></UserTable>
      <DataTable data={state.displaydata}></DataTable>
      <Report data={state}></Report>
    </div>
  </section>
);