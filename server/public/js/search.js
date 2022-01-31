setTimeout(() => {
  window.location.reload();
}, 1000);

document.querySelector('.cerrarses').addEventListener('click', () => {
  document.cookie = 'session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  window.location.reload();
})