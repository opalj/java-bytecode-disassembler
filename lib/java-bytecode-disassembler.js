'use babel';

import DisassembledView from './disassembled-view';
import {CompositeDisposable, Disposable} from 'atom';
import $ from "jquery";
import ChildProcess from "child_process";
import fs from "fs";
import ConfigSchema from "./configuration.js";

export default
{
	config: ConfigSchema.config,
	views: {},
	subscriptions: null,

	activate(state)
	{
		var aThis = this;

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable(
			// Add an opener for our view.
			atom.workspace.addOpener(
				uri =>
				{
					if(
						atom.config.get("Java-Bytecode-Disassembler.openOnClick")
						&& uri.endsWith(".class")
					){
						return aThis.disassemble(uri, true);
					}
					if(uri.endsWith("?force-disassemble")){
						return aThis.disassemble(uri.replace("?force-disassemble", ""), false);
					}
				}
			),
			// Register command
			atom.commands.add(
				'atom-workspace',
				{
					'java-bytecode-disassembler:disassemble': (e) => {
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
					item => {
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
		for(var key in this.views){
			fs.unlink(this.views[key].htmlPath);
			this.views[key].destroy();
		}
	},

	disassemble(dir, calledByLeftClick)
	{
		var fileName = dir.replace(/^.*[\\\/]/, '').replace('.class', '');

		if (
			calledByLeftClick
			&& (typeof this.views[dir] !== 'undefined')
			&& !atom.config.get("Java-Bytecode-Disassembler.redisassembleOnClick")
		){
			atom.workspace.open(dir);
			return;
		}

		var command =
			'java -jar "' + __dirname + '/OPALDisassembler.jar"' +
			' -source ' + '"' + dir + '" ' +
			' -noDefaultCSS'
		;

		var aThis = this;
		try{
			var child = ChildProcess.execSync(command).toString();
			return new DisassembledView(
				fileName,
				child.substring(child.lastIndexOf("<body>")+6,child.lastIndexOf("</body>")).replace(/(onclick|onkeyup)="[^"]*"/g, ""),
				dir
			);

		}catch(error){
			console.error(error.message);
			atom.notifications.addError(
				"Error disassembling the file. Check the log for more details",
				{
					detail: error.message
				}
			);
			return null;
		}
	}
};
