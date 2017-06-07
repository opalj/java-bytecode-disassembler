'use babel';

export default class DisassembledView {

  constructor(pathToHtml) {
    console.log("PATH", pathToHtml);
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('opal');

    // Create message element
    const iframe = document.createElement('iframe');
    iframe.src = pathToHtml;
    iframe.style = "width: 100%; height: 100%;";

    this.element.appendChild(iframe);
  }

  setContent(html){
    this.element = document.createElement('div');
    this.element.classList.add('opal');

    const message = document.createElement('div');
    message.innerHTML = "OMFG";

    this.element.appendChild(message);
  }

  getTitle(){
    return 'Opal Disassembler';
  }

  getURI(){
    return 'atom://opal';
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

}
