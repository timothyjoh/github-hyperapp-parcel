import { h } from 'hyperapp';
import { state } from './state';
import { UserTable } from './components/usertable'
import { DataTable } from './components/datatable'

export const view = (state, actions) => (
  <section>
    <h3>Search Propel2 LRS</h3>
    <label
      for='activity_id'
      onclick={ e => actions.update_activity(state.activity_id) }
    >Activity ID:
    <input
      name='activity_id'
      type='text'
      class='searchInput'
      value={state.activity_id}
      oninput={e => actions.update_activity(e.target.value)}
      onload={ () => actions.update_activity(state.activity_id) }
    />
    </label>
    <br />
    <label for='user_id'>User ID:
    <input
      type='text'
      class='searchInput'
      value={state.user_id}
      oninput={e => actions.user_select(e.target.value)}
    />
    </label>
    <br />
    <UserTable state={state} user_select={actions.user_select}></UserTable>
    <DataTable data={state.displaydata}></DataTable>
  </section>
);