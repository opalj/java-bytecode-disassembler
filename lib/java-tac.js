'use babel';
import TacView from './tac-view';
import ChildProcess from "child_process";
import ConfigSchema from "./configuration.js";
import path from "path";
import os from "os";

/*
"atom-workspace": [
	{
		"label": "Show 3-Address-Code (Method)",
		"command": "java-tac:process-method"
	}
]
*/

export default {
  config: ConfigSchema.config,
  subscriptions: null,

  processFile(classPath) {
    var classDir = classPath.substring(0, classPath.lastIndexOf("/") + 1);
    var className = classPath.replace(classDir, "").replace(".class", "");
    var command = 'java -jar "' + this.escapePath(__dirname + '/OPALTACDisassembler.jar') +
      '" -cp "' + classDir + '" -class "' + className + '"';

    var aThis = this;
    var result;

    var view = new TacView(
      classPath,
      className,
    );


    console.log("command: " + command);

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
      }
    );

    return view;
  },

  escapePath(dir) {
    if (os.platform() !== 'win32') {
      dir = dir.replace(/(["\s'$`\\])/g, '\\$1');
    }
    return path.normalize(dir);
  }

};
