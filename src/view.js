import { h } from 'hyperapp';
import { state } from './state';
import { UserTable } from './components/usertable'
import { DataTable } from './components/datatable'
import { InputFields } from './components/inputs'

export const view = (state, actions) => (
  <section>
    <h2>Search Propel2 LRS</h2>
    <InputFields state={state} actions={actions} />
    <br />
    <div class='tables'>
      <UserTable state={state} user_select={actions.user_select}></UserTable>
      <DataTable data={state.displaydata}></DataTable>
    </div>
  </section>
);