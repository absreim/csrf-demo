DOMAIN = 'http://localhost:3000'

function postCallWithCreds(url){
  const paramsString = 'recipientId=2&amount=1'
  const requestObj = new Request(url)
  const initObj = {
    method: 'POST',
    body: paramsString,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
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

function jsonPostCallWithCreds(url){
  const paramsObj = {
    recipientId: 2,
    amount: 1
  }
  const paramsString = JSON.stringify(paramsObj)
  const requestObj = new Request(url)
  const initObj = {
    method: 'POST',
    body: paramsString,
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  }
  fetch(requestObj, initObj).then(response => {
    console.log(response)
  })
}

document.getElementById('json-ajax-button').addEventListener(
  'click',
  () => jsonPostCallWithCreds(`${DOMAIN}/api/account/transfer`)
)
