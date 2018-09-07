import debounce from 'debounce-promise'
import {endpoint} from './api'

const fetch_users = (actions) =>
  fetch(`${endpoint}/users`)
    .then(res => res.json())

export const get_users = () => (state, actions) => {
  fetch_users(actions)
    .then(actions.set_users)
    .then(actions.log_state)
  return {}
};

export const set_users = (users) => ({ users })

export const user_select = user_id => (state, actions) => {
  console.log('user_id', user_id)
  actions.get_records({activity_id: state.activity_id, user_id})
  let uu = state.users.filter( u => u.id == user_id )[0]
  return { user: { id: uu.id, email: uu.email } }
};