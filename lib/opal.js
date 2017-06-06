'use babel';

import OpalView from './opal-view';
import { CompositeDisposable } from 'atom';

export default {

  opalView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.opalView = new OpalView(state.opalViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.opalView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'opal:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.opalView.destroy();
  },

  serialize() {
    return {
      opalViewState: this.opalView.serialize()
    };
  },

  toggle() {
    console.log('Opal was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
