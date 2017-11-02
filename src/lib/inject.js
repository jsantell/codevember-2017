export default function inject (url) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    document.body.appendChild(script);
  });
}
