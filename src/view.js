import { h } from 'hyperapp';
import { state } from './state';
import { UserTable } from './components/usertable'
import { DataTable } from './components/datatable'
import { InputFields } from './components/inputs'
import { Report } from './components/report'

export const view = (state, actions) => (
  <section>
    <h2>Search Propel2 LRS</h2>
    <InputFields state={state} actions={actions} />
    <br />
    <h3>
      <em>{state.user.id}</em>
      {state.user.email}
    </h3>
    <div class='tables'>
      <UserTable state={state} user_select={actions.user_select}></UserTable>
      <DataTable data={state.displaydata}></DataTable>
      <Report data={state}></Report>
    </div>
  </section>
);