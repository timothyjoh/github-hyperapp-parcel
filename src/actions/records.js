import debounce from 'debounce-promise'
import {endpoint} from './api'

const fetch_lrsdata = (activity_id, user_id) =>
  fetch(`${endpoint}/lrs/activities/${activity_id}?user_id=${user_id}`)
    .then(res => res.json())
const get_lrsdata = debounce(fetch_lrsdata, 700);

export const get_records = ({activity_id, user_id}) => (state, actions) => {
  console.log('get_records', activity_id, user_id)
  get_lrsdata(activity_id, user_id)
    .then(actions.set_lrsdata)
    .then(actions.log_state)
  return { activity_id }
};

export const set_lrsdata = lrsdata => (
  { lrsdata, displaydata: lrsdata.lrsEvents }
);