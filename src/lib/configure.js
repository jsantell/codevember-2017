if (window.location.search) {
  const params = window.location.search.substr(1).split('&');
  for (let param of params) {
    let [prop, value] = param.split('=');
    if (prop === 'video') {
      document.querySelector('#info').style.display = 'none';
    }
  }
}
