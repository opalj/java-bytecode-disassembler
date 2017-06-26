'use babel';
import $ from "jquery";

export default class DisassembledView {

  constructor(fileName, htmlContent, uri) {
    this.uri = uri;
    this.fileName = fileName;
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('java-bytecode-disassembler');

    this.element.innerHTML = htmlContent;

    $(this.element).find("#filter_by_method_name").addClass("native-key-bindings");
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
