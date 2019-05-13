export function request (data = {}, success = () => {}, error = () => {}, fail = () => {}) {
  fetch('./account/', {
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
        error(response);
      }
      success(response);
    })
    .catch(err => {
      console.error('Request Error:', err);
      fail(err);
    });
}