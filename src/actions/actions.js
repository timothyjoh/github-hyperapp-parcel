import { get_records, set_lrsdata } from './records'
import { get_users, set_users } from './users'

export const actions = {
  log_state: () => state => {
    window.__state = state;
    console.log("state:", state);
  },
  update_activity: get_records,
  set_lrsdata,
  get_users,
  set_users,
  user_select: user_id => state => (
    { user: state.lrsdata[user_id],
      displaydata: state.lrsdata[user_id].lrsEvents,
    }
  ),
}

// const lrs_api = 'https://4ibvog74h7.execute-api.us-east-1.amazonaws.com/dev/lrs/activities/'

// const fetch_lrsdata = activity_id => fetch(`${lrs_api}${activity_id}?user_id=035eda52-e5c7-4896-aa7d-afcf286277d4`).then(res => res.json())
// const first_user = lrsdata => lrsdata[Object.keys(lrsdata)[0]];
