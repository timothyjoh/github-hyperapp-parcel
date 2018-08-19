import { h } from 'hyperapp';
import { state } from './state';

const view = (state, actions) => (
  <section>
    <h3>Search Github Users!</h3>
    <input
      type='text'
      class='searchInput'
      value={state.username}
      oninput={e => actions.update_username(e.target.value)}
    />
    <br />
    <div class='usercard'>
      {state.userdata ? (
        <div>
          <img class='usercard__img' src={state.userdata.avatar_url} />
          <h5>{state.userdata.name}</h5>
          <p>{state.userdata.location}</p>
        </div>
      ) : (
        <div> search em</div>
      )}
    </div>
  </section>
);

export { view };