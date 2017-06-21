'use babel';

import DisassembledView from './disassembled-view';
import {CompositeDisposable, Disposable} from 'atom';
import path from "path";
import $ from "jquery";
import ChildProcess from "child_process";
import fs from "fs";
import ConfigSchema from "./configuration.js";

export default
{
	config: ConfigSchema.config,
	views: {},
	modalPanel: null,
	subscriptions: null,

	activate(state)
	{
		var aThis = this;

		// Check if should open .class files with disassembler or normally on left-click
		$(".tree-view .file").on("click", function(e){
			var fileName = $(e.target).hasClass('name') ? $(e.target).data('name') : $(e.target).find('span.name').data('name');
			if(atom.config.get("Java-Bytecode-Disassembler.openOnClick") && fileName.endsWith(".class"))
			{
				e.stopPropagation();
				e.preventDefault();
				aThis.disassemble(e, true);
			}
		});

		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable(
			// Add an opener for our view.
			atom.workspace.addOpener(
				uri =>
				{
					if (typeof aThis.views[uri] !== 'undefined')
					{
						return aThis.views[uri];
					}
				}
			),
			// Register command
			atom.commands.add(
				'atom-workspace',
				{
					'opal-atom:disassemble': (e) => this.disassemble(e, false)
				}),

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
		this.modalPanel.destro
		y();
		this.subscriptions.dispose();
		for(var key in this.views){
			fs.unlink(this.views[key].htmlPath);
			this.views[key].destroy();
		}
	},

	disassemble(e, calledByLeftClick)
	{
		var path = $(e.target).hasClass('name') ? $(e.target).data('path') : $(e.target).find('span.name').data('path');
		var fileName = $(e.target).hasClass('name') ? $(e.target).data('name') : $(e.target).find('span.name').data('name');
		if (!fileName.endsWith(
				".class") && !fileName.endsWith(
				".jar"))
		{
			atom.notifications.addWarning(
				"Invalid file type",
				{
					detail: "Only files of type .class or .jar can be disassembled by OPAL"
				})
			return;
		}
		fileName = fileName.substr(0, fileName.lastIndexOf("."))

		var uri = 'atom://opal-atom-disassembled-' + fileName;

		if (
			calledByLeftClick
			&& (typeof this.views[uri] !== 'undefined')
			&& !atom.config.get("Java-Bytecode-Disassembler.redisassembleOnClick")
		){
			atom.workspace.open(uri);
			return;
		}

		var command =
			'java -jar "' + __dirname + '/OPALDisassembler.jar"' +
			' -source ' + '"' + path + '" ' + fileName +
			' -o "' + __dirname + '/../windows/'+fileName+'-disassembled.html"' +
			' -css "' + __dirname + '/../disassembler-styles/disassembledView.css"' +
			' -noDefaultCSS'
		;

		var aThis = this;
		var child = ChildProcess.exec(
			command,
			function(error, stdout, stderr)
			{
				if (error !== null)
				{
					console.error("Error! Could not disassemble with command: ", command);
					console.error(error);
					atom.notifications.addError(
						"Error: could not disassemble",
						{
							detail: "An error occured when trying to disassemble the file. Check the log for more information"
						}
					);
					return;
				}

				var view = new DisassembledView(
					fileName,
					__dirname + '/../windows/'+fileName+'-disassembled.html',
					uri
				);
				aThis.modalPanel = atom.workspace.addModalPanel(
					{
						item: view.getElement(),
						visible: false
					}
				);
				aThis.views[uri] = view;

				atom.workspace.open(uri);
			}
		);
	}
};
