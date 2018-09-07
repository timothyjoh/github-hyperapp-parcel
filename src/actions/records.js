import debounce from 'debounce-promise'
import {endpoint} from './api'

const first_user = lrsdata => lrsdata[Object.keys(lrsdata)[0]];
const get_lrsdata = debounce(fetch_lrsdata, 700);
const fetch_lrsdata = (activity_id, user_id) =>
  fetch(`${endpoint}lrs/activities/${activity_id}?user_id=${user_id}`).then(res => res.json())

export const get_records = activity_id => (state, actions) => {
  get_lrsdata(activity_id, state.user.id)
    .then(actions.set_lrsdata)
    .then(actions.log_state)
  return { activity_id }
};

export const set_lrsdata = lrsdata => state => (
  { lrsdata,
    user: first_user(lrsdata),
    displaydata: first_user(lrsdata).lrsEvents,
  }
);