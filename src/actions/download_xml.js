const simpleEmail = email => email.replace(/\W/g, '-')

const download = (filename, body) => {
  let element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(body));
  element.setAttribute('download', filename);
  element.innerHTML = "really download";
  element.style.display = 'none';
  document.getElementById('report').appendChild(element);
  element.click();
  document.getElementById('report').removeChild(element);
}

export const setup_download_button = () => {
  console.log("setup_download_button")
  document.getElementById('download_reportdoc').addEventListener('click', () => {
    const body = document.getElementById('reportdoc').innerHTML;
    const filename = simpleEmail(window.__state.user.email) + ".xml";
    download(filename, body);
  })  
}