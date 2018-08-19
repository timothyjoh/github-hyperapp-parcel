import debounce from 'debounce-promise'

const github_user_api = 'https://api.github.com/users/'

const fetch_userdata = username => fetch(`${github_user_api}${username}`).then(res => res.json())
const get_userdata = debounce(fetch_userdata, 700);

const actions = {
  update_username: username => (state, actions) => {
    get_userdata(username).then(actions.set_userdata)
    return { username }
  },
  set_userdata: userdata => state => ({ userdata })
}

export { actions }