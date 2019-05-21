import { setCookie } from "../StackOverflow/cookie";

export function request (data = {}, success = () => {}, error = () => {}/* , fail = () => {} */) {
  return fetch('./api/', {
    method: 'POST', // or 'PUT'
    body: JSON.stringify(data), // data can be `string` or {object}!
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'same-origin',
  }).then(res => res.json())
    .then(response => {
      console.log('Success:', JSON.stringify(response));
      if (response.error) {
        return error(response.data);
      }
      return success(response.data);
    });
}

export function saveToken(token) {
  setCookie('token', token, 30);
}