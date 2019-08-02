function postCallWithCreds(url){
  const paramsString = 'recipientId=2&amount=1'
  const paramsObj = new URLSearchParams(paramsString)
  const requestObj = new Request(url)
  const initObj = {
    method: 'POST',
    body: paramsObj,
    credentials: 'include'
  }
  fetch(requestObj, initObj).then(response => {
    console.log(response)
  })
}

document.getElementById('ajax-button').addEventListener(
  'click',
  () => postCallWithCreds('http://localhost:3000/api/account/transfer')
)

document.getElementById('secured-ajax-button').addEventListener(
  'click',
  () => postCallWithCreds('http://localhost:3000/secured/account/transfer')
)
