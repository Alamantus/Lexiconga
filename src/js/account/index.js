import '../../scss/Account/main.scss';

import { renderLoginForm } from "./render";
import { triggerLoginChanges } from './login';
import { syncDictionary } from './sync';

export function showLoginForm() {
  renderLoginForm();
}

export function loginWithToken() {
  triggerLoginChanges();
  syncDictionary();
}