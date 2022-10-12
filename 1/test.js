var HOST =
  "https://api.telegram.org/bot5151738188:AAHs14q0d5vS38bOOOEIORwrWiPDvA3bJ4E/sendMessage?chat_id=-642002207&text=";

function send() {
  let inp = document.getElementsByClassName("inp")[0];
  if (inp.value != "") {
    let message = HOST + inp.value;
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", message, false);
    xmlHttp.send();
  }
}
