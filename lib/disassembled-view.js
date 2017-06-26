'use babel';

export default class DisassembledView {

  constructor(fileName, htmlPath, uri) {
    this.uri = uri;
    this.htmlPath = htmlPath;
    this.fileName = fileName;

    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('java-bytecode-disassembler');

    // Create message element
    const iframe = document.createElement('iframe');
    iframe.src = htmlPath;
    iframe.style = "width: 100%; height: 100%;";

    this.element.appendChild(iframe);
  }

  getTitle(){
    return this.fileName + ' (disassembled)';
  }

  getURI(){
    return this.uri;
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
