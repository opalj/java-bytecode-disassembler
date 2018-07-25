'use babel';

export default class TacView {

  loadFinalContent(content) {
    if(content.length <= 5){
      var warning = 'Oups, something went wrong! <br/><br/>'
      + 'Did you click directly on the method name? <br/><br/>'
      + 'If yes, or if you tried to see 3-Address-Code for a file, <br/>' +
       'please open an issue on Github :)';
      this.element.innerHTML = '<center><h1>' + warning + '</h1></center>';
    } else {
      this.element.innerHTML = '<pre>' + content + '</pre>';
    }

    this.element.style['overflow-y'] = 'scroll';
  }

  constructor(classPath, className) {
    var aThis = this;
    this.className = className;
    // Create root element
    this.element = document.createElement('div');
    this.element.classList.add('java-3-address-code');
    this.element.classList.add('pane-item');


    var progressRing = document.createElement('div');
    progressRing.id = "progress-ring";
    this.element.appendChild(progressRing);
    var p = document.createElement('div');
    p.id = "progressLabel";
    p.innerHTML = "Finding " + this.className + "<br>This may take a few seconds...";
    this.element.appendChild(p);

  }

  getTitle() {
    return this.className + ' (tac)';
  }

  // Tear down any state and detach
  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }
}
