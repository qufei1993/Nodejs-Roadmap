import 'whatwg-fetch'
import 'es6-promise'

export function get(url) {
  var result = fetch(url, {
      credentials: 'include',
      headers: {
          'Accept': 'application/json, text/plain, */*'
      }
  });

  return result;
}
