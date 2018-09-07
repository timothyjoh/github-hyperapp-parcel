import { get_records, set_lrsdata } from './records'
import { get_users, set_users, user_select } from './users'

export const actions = {
  log_state: () => state => {
    window.__state = state;
    console.log("state:", state);
  },
  get_records,
  set_lrsdata,
  get_users,
  set_users,
  user_select,
}