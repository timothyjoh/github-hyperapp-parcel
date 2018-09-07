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

export const set_users = (users) => (state) => ({ users })
