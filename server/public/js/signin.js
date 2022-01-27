document.querySelector('form').addEventListener('submit', (e) => {
  e.preventDefault();

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("username", document.querySelector('input').value);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  fetch("/signin", requestOptions)
    .then(response => response.text())
    .then(result => {
      result = JSON.parse(result);
      document.cookie =`session=${result.token}; expires=${9999999}; path=/`;
      window.location.href = '/search'
    })
    .catch(error => console.log('error', error));
})