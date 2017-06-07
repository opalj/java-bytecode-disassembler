'use babel';

export default class OpalView {

  constructor(serializedState) {
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('opal');

    // Create message element
    const message = document.createElement('div');
    message.innerHTML = 'Test';


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
