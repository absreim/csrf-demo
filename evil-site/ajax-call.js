document.getElementById('ajax-button').addEventListener(
  'click',
  () => {
    const paramsString = 'recipientId=2&amount=100'
    const paramsObj = new URLSearchParams(paramsString)
    const requestObj = new Request('http://localhost:3000/api/account/transfer')
    const initObj = {
      method: 'POST',
      body: paramsObj,
      credentials: 'include'
    }
    fetch(requestObj, initObj).then(response => {
      console.log(response)
    })
  }
)
