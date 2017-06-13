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
                if (uri === 'atom://opal-atom') {
                    return aThis.disassembledView;
                }
            }),

            // Register command
            atom.commands.add('atom-workspace', {
                'opal-atom:disassemble': (e) => this.disassemble(e),
                'opal-atom:tryToDisassemble': (e) => this.tryToDisassemble(e)
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
        fs.unlink(__dirname + '/../windows/tempView.html');
    },

    disassemble(e) {
        var path = $(e.target).data('path');
        var fileName = $(e.target).data('name');
        fileName = fileName.substr(0, fileName.lastIndexOf("."))

        var command = 'java -jar "' + __dirname + '/OPALDisassembler.jar" -source ' + '"' + path + '" ' + fileName + ' -o "' + __dirname + '/../windows/tempView.html"';
        console.log("Command: ", command);
        var aThis = this;
        var child = ChildProcess.exec(command,
            function(error, stdout, stderr) {
                aThis.disassembledView = new DisassembledView(fileName);
                aThis.modalPanel = atom.workspace.addModalPanel({
                    item: aThis.disassembledView.getElement(),
                    visible: false
                });

                atom.workspace.toggle('atom://opal-atom');


                if (error !== null) {
                    console.log("Error -> " + error);
                }
            }
        );
    },

    tryToDisassemble(e){
      console.log("Test", $(e.target).data('name'));
    }

};
