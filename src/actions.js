import debounce from 'debounce-promise'

const lrs_api = 'https://4ibvog74h7.execute-api.us-east-1.amazonaws.com/dev/lrs/activities/'

const fetch_lrsdata = activity_id => fetch(`${lrs_api}${activity_id}`).then(res => res.json())
const get_lrsdata = debounce(fetch_lrsdata, 700);
const first_user = lrsdata => lrsdata[Object.keys(lrsdata)[0]];

export const actions = {
  update_activity: activity_id => (state, actions) => {
    get_lrsdata(activity_id).then(actions.set_lrsdata).then(actions.log_state)
    return { activity_id }
  },
  set_lrsdata: lrsdata => state => (
    { lrsdata,
      user: first_user(lrsdata),
      displaydata: first_user(lrsdata).lrsEvents,
    }),
  log_state: () => state => {
    window.__state = state;
    console.log("state:", state);
  },
  user_select: user_id => state => (
    { user: state.lrsdata[user_id],
      displaydata: state.lrsdata[user_id].lrsEvents,
    }
  ),
}