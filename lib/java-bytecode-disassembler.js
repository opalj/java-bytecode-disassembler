'use babel';

import DisassembledView from './disassembled-view';
import {CompositeDisposable, Disposable} from 'atom';
import $ from "jquery";
import ChildProcess from "child_process";
import ConfigSchema from "./configuration.js";
import path from "path";
import os from "os";
import fs from "fs";

export default
{
	config: ConfigSchema.config,
	subscriptions: null,

	activate(state)
	{
		var aThis = this;

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable(
			// Add an opener for our view.
			atom.workspace.addOpener(
				function(uri, other)
				{
					if(
						!uri.endsWith(".jar")
						&& !uri.includes("?className")
						&& uri.includes(".jar")
					){
						jarPath = atom.workspace.getActivePaneItem().getPath();
						return aThis.disassemble(uri, false, jarPath);
					}
					if(
						atom.config.get("Java-Bytecode-Disassembler.openOnClick")
						&& uri.endsWith(".class")
					){
						return aThis.disassemble(uri, false);
					}
					if(uri.endsWith("?force-disassemble")){
						return aThis.disassemble(uri.replace("?force-disassemble", ""), false);
					}
					if(uri.includes("?className=")){
						var split = uri.split("?className=");
						if(split.includes("&noClassName")){
							return aThis.disassemble("", split[1].replace("&noClassName", ""));
						}
						return aThis.disassemble(split[0], split[1]);
					}
				}
			),
			// Register command
			atom.commands.add(
				'atom-workspace',
				{
					'java-bytecode-disassembler:disassemble': function(e){
						var dir = $(e.target).hasClass('name') ? $(e.target).data('path') : $(e.target).find('span.name').data('path');
						if (!dir.endsWith(".class") && !dir.endsWith(".jar"))
						{
							atom.notifications.addWarning(
								"Invalid file type",
								{
									detail: "Only files of type .class or .jar can be disassembled by OPAL"
								})
							return;
						}
						atom.workspace.open(dir + "?force-disassemble");
					}
				}
			),
			// Destroy any OpalViews when the package is deactivated.
			new Disposable(() =>
			{
				atom.workspace.getPaneItems().forEach(
					function(item){
						if (item instanceof DisassembledView)
						{
							item.destroy();
						}
					}
				);
			})
		);
	},

	deactivate()
	{
		this.subscriptions.dispose();
	},

	disassemble(dir, className, jarPath)
	{
		var fileName = "";

		var command =
			'java -jar "' + this.escapePath(__dirname+ '/OPALDisassembler.jar') + '"'
			+ ' -noHeader'
		;

		if(atom.config.get("Java-Bytecode-Disassembler.checkInJDK")){
			command += ' -sourceJDK';
		}

		var additionalPathsToCheck = atom.config.get("Java-Bytecode-Disassembler.additionalPathsToCheck").replace(/\s/g,'').split(',');
		for(var i = 0; i < additionalPathsToCheck.length; i++){
			if(fs.existsSync(this.escapePath(additionalPathsToCheck[i]))){
				command += ' -source "' + this.escapePath(additionalPathsToCheck[i]) + '"';
			}
		}

		if(dir.length){
			command += ' -source "' + this.escapePath(dir) + '"';
			fileName = dir.replace(/^.*[\\\/]/, '').replace('.class', '');
		}

		if(className){
			command += ' ' + className;
			fileName = className;
		}
		var aThis = this;
		var result;
		try{
			result = ChildProcess.execSync(command);
		}catch(error){
			console.error(error.message);
			atom.notifications.addError(
				"Error disassembling the file. Check the log for more details",
				{
					detail: error.message
				}
			);
			return false;
		}

		return new DisassembledView(
			fileName,
			result.toString(),
			dir,
			jarPath
		);
	},

	escapePath(dir){
		if(os.platform() !== 'win32'){
			dir = dir.replace(/(["\s'$`\\])/g,'\\$1');
		}
		return path.normalize(dir);
	}
};
