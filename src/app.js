import { app } from 'hyperapp';
import { view } from './view';
import { state } from './state';
import { actions } from './actions';
import './app.scss';

app(state, actions, view, document.body);
