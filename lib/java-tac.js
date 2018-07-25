'use babel';
import TacView from './tac-view';
import ChildProcess from "child_process";
import ConfigSchema from "./configuration.js";
import path from "path";
import os from "os";

export default {
  config: ConfigSchema.config,
  subscriptions: null,

  processFile(classPath) {
    var classDir = classPath.substring(0, classPath.lastIndexOf("/") + 1);
    var classNameMethod = classPath.replace(classDir, "").replace(".class", "");
    var className = classNameMethod.replace(/\?method-name.*/, "");
    var methodName = classNameMethod.replace(/.*\?method-name/, "");
    var path = classDir + className + ".class";
    var command = 'java -jar "' + this.escapePath(__dirname + '/OPALTACDisassembler.jar');

    // jdk class / not a jdk class
    if(classPath.includes("?jdk")){
      className = className.replace("?jdk", "");
      command += '" -JDK ' + "-class " + className;
    } else {
      command += '" -cp "' + this.escapePath(path) + '"';
    }

    // fixes jars with space in name
    if(classPath.includes(".jar")){
      command = command.replace(new RegExp("%20", "g"), "\ ");
    }

    // if a specific method is to be shown
    if (classPath.indexOf("?method-name") != -1) {
      command += ' -method "' + methodName + '"';
    }

    var aThis = this;
    var result;

    var view = new TacView(
      classPath,
      className,
    );

    var child = ChildProcess.exec(

      command, { // exec options
        timeout: atom.config.get(
          "Java-Bytecode-Disassembler.disassemblerTimeout"
        ),
        maxBuffer: atom.config.get(
          "Java-Bytecode-Disassembler.stdoutMaxBuffer"
        ) * 1024
      },

      function(error, stdout, stderror) {
        view.loadFinalContent(stdout.toString());

        if (classPath.indexOf("?method-name") != -1) {
          const tacItem = {
            element: view.getElement(),
            visible: true,
            getTitle() {
              return '3-Address-Code'
            },
            getDefaultLocation() {
              return 'bottom'
            },
          };

          atom.workspace.open(tacItem);
        }
      }
    );

    if (classPath.indexOf("?method-name") == -1) {
      return view;
    }
  },

  escapePath(dir) {
    if (os.platform() !== 'win32') {
      dir = dir.replace(/(["\s'$`\\])/g, '\\$1');
    }
    return path.normalize(dir);
  }

};
