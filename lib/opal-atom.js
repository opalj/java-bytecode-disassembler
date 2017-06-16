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
        if(!fileName.endsWith(".class") && !fileName.endsWith(".jar")){
          atom.notifications.addWarning("Invalid file type", {
            detail: "Only files of type .class or .jar can be disassembled by OPAL"
          })
          return;
        }

        fileName = fileName.substr(0, fileName.lastIndexOf("."))


        var command =
          'java -jar "' + __dirname + '/OPALDisassembler.jar"'
          + ' -source ' + '"' + path + '" ' + fileName
          + ' -css "' + __dirname + '/../styles/disassembledView.css"'
          + ' -o "' + __dirname + '/../windows/tempView.html"'
        ;
        console.log("Command: ", command);
        var aThis = this;
        var child = ChildProcess.exec(command,
            function(error, stdout, stderr) {
                if (error !== null) {
                    console.error("Error! Could not disassemble with command: ", command);
                    console.error(error);
                    atom.notifications.addError("Error: could not disassemble", {
                      detail: "An error occured when trying to disassemble the file. Check the log for more information"
                    })
                    return;
                }

                aThis.disassembledView = new DisassembledView(fileName);
                aThis.modalPanel = atom.workspace.addModalPanel({
                    item: aThis.disassembledView.getElement(),
                    visible: false
                });

                atom.workspace.toggle('atom://opal-atom');
            }
        );
    },

    tryToDisassemble(e){
      console.log("Test", $(e.target).data('name'));
    }

};
