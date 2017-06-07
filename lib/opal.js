'use babel';

import OpalView from './opal-view';
import {
    CompositeDisposable,
    Disposable
} from 'atom';
import path from "path";
import $ from "jquery";
import ChildProcess from "child_process";

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
        this.subscriptions = new CompositeDisposable(
            // Add an opener for our view.
            atom.workspace.addOpener(uri => {
                if (uri === 'atom://opal') {
                    return new OpalView();
                }
            }),

            // Register command that toggles this view
            atom.commands.add('atom-workspace', {
                'opal:toggle': (e) => this.toggle(e)
            }),

            // Destroy any OpalViews when the package is deactivated.
            new Disposable(() => {
                atom.workspace.getPaneItems().forEach(item => {
                    if (item instanceof OpalView) {
                        item.destroy();
                    }
                });
            })
        );
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

    toggle(e) {
        var path = $(e.target).data('path');
        console.log("Command: ", 'java -jar "' + __dirname + '\\OPALDisassembler.jar" ' + '"' + path + '"');
        var child = ChildProcess.exec('java -jar "' + __dirname + '\\OPALDisassembler.jar" ' + '"' + path + '"',
            function(error, stdout, stderr) {
                console.log('Output -> ' + stdout);
                if (error !== null) {
                    console.log("Error -> " + error);
                }
            }
        );


        atom.workspace.toggle('atom://opal');
    }

};
