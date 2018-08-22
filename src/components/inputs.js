import { h } from 'hyperapp'

const TextInput = ({field, func, init, label}) => (
  <label for={field}
    onclick={ e => func(init) }
  >
    {label}:&nbsp;
    <input
      name={field}
      type='text'
      class='input_text'
      value={init}
      oninput={ e => func(e.target.value) }
    />
  </label>
)

export const InputFields = ({state, actions}) => (
  <div class='inputs'>
    <TextInput
      field='activity_id'
      func={actions.update_activity}
      init={state.activity_id}
      label="Activity UUID"
    />
    <TextInput
      field='user_id'
      func={actions.user_select}
      init={state.user_id}
      label="User UUID"
    />
  </div>
)