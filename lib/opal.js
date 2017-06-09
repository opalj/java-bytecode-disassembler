'use babel';

import DisassembledView from './disassembled-view';
import {
    CompositeDisposable,
    Disposable
} from 'atom';
import path from "path";
import $ from "jquery";
import ChildProcess from "child_process";
import fs from "fs";

export default {

    disassembledView: null,
    modalPanel: null,
    subscriptions: null,

    activate(state) {
        var aThis = this;
        // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
        this.subscriptions = new CompositeDisposable(
            // Add an opener for our view.
            atom.workspace.addOpener(uri => {
                if (uri === 'atom://opal') {
                    return aThis.disassembledView;
                }
            }),

            // Register command
            atom.commands.add('atom-workspace', {
                'opal:disassemble': (e) => this.disassemble(e)
            }),

            // Destroy any OpalViews when the package is deactivated.
            new Disposable(() => {
                atom.workspace.getPaneItems().forEach(item => {
                    if (item instanceof DisassembledView) {
                        item.destroy();
                    }
                });
            })
        );
    },

    deactivate() {
        this.modalPanel.destroy();
        this.subscriptions.dispose();
        this.disassembledView.destroy();
    },

    disassemble(e) {
        var path = $(e.target).data('path');
        console.log("Command: ", 'java -jar "' + __dirname + '/OPALDisassembler.jar" ' + '"' + path + '"');
        var aThis = this;
        var child = ChildProcess.exec('java -jar "' + __dirname + '/OPALDisassembler.jar" ' + '"' + path + '"',
            function(error, stdout, stderr) {
                var lines = stdout.split('\n');
                var lastLine = lines[lines.length - 2];
                var lastString = lastLine.split(' ');
                lastString = lastString[lastString.length - 1];
                lastString = lastString.split('.html')[0];
                lastString += '.html';
                console.log("PATH-A", lastString);
                aThis.disassembledView = new DisassembledView(lastString);
                aThis.modalPanel = atom.workspace.addModalPanel({
                    item: aThis.disassembledView.getElement(),
                    visible: false
                });

                atom.workspace.toggle('atom://opal');
                console.log("Last-String", lastString);
                if (error !== null) {
                    console.log("Error -> " + error);
                }
            }
        );

    }

};
