const DOMAIN = 'http://localhost:3000'
const PARAMS = {
  recipientId: 2,
  amount: 1
}

function postCallWithCreds(url, json){
  const body = json ?
    JSON.stringify(PARAMS) :
    new URLSearchParams(PARAMS).toString()
  const contentType = json ?
    'application/json' : 'application/x-www-form-urlencoded'
  const requestObj = new Request(url)
  const initObj = {
    method: 'POST',
    body,
    headers: {
      'Content-Type': contentType
    },
    credentials: 'include'
  }
  fetch(requestObj, initObj).then(response => {
    console.log(response)
  })
}

document.getElementById('ajax-button').addEventListener(
  'click',
  () => postCallWithCreds(`${DOMAIN}/api/account/transfer`)
)

document.getElementById('secured-ajax-button').addEventListener(
  'click',
  () => postCallWithCreds(`${DOMAIN}/secured/account/transfer`)
)

document.getElementById('json-ajax-button').addEventListener(
  'click',
  () => postCallWithCreds(`${DOMAIN}/api/account/transfer`, true)
)
