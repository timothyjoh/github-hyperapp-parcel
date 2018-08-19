import { app } from 'hyperapp';
import { view } from './view';
import { state } from './state';
import { actions } from './actions';

app(state, actions, view, document.body);