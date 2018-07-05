'use babel';

import DisassembledView from './disassembled-view';
import
{
	CompositeDisposable,
	Disposable
}
from 'atom';
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

               // If class was opened from a jar (ArchiveVeiew),
               // the path of the jar needs to be retrieved and stored in view
               // in order to open other classes in the jar from the view.
					if (
                  uri.endsWith(".class")
                  && !uri.endsWith(".jar")
                  && !uri.includes("?className")
                  && uri.includes(".jar")
               ){
						jarPath = atom.workspace.getActivePaneItem().getPath();
						sanitizedJarPath = "\"" + jarPath + "\"";
						return aThis.disassemble(uri, false, sanitizedJarPath);
					}

               // If it ends with .class and path doesnt contain '.jar',
               // then it must be a .class file from the file-tree
					if (
                  atom.config.get("Java-Bytecode-Disassembler.openOnClick")
                  && uri.endsWith(".class")
               ){
						return aThis.disassemble(uri, false);
					}

               // If it ends with force-disassemble,
               // then it's a class opened from the disassembled-view
               // or it's a class opened from context-menu disassemble option
               if (uri.endsWith("?force-disassemble"))
					{
						return aThis.disassemble(uri.replace("?force-disassemble",""), false);
					}

               // If it contains className, then the direct path is unknown and
               // a className to be searched for must be provided
					if (uri.includes("?className="))
					{
						var split = uri.split("?className=");
						return aThis.disassemble(split[0], split[1]);
					}
				}
			),
			// Register command
			atom.commands.add(
				'atom-workspace',
				{
					'java-bytecode-disassembler:disassemble': function(e)
					{
                  // Get dir depending on if clicked on area besides name
                  var dir = $(e.target).hasClass('name')
                     ? $(e.target).data('path')
                     : $(e.target).find('span.name').data('path')
                  ;

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
			// Destroy any DisassembledViews when the package is deactivated.
			new Disposable(() =>
			{
				atom.workspace.getPaneItems().forEach(
					function(item)
					{
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

	disassemble(dir, className, sanitizedJarPath)
	{
		var fileName = "";

		var command = 'java -jar "' + this.escapePath(__dirname + '/OPALDisassembler.jar') + '"'
         + ' -noHeader'
		//+ ' -showProgress'
		;

		if (atom.config.get("Java-Bytecode-Disassembler.checkInJDK"))
		{
			command += ' -sourceJDK';
		}

		var additionalPathsToCheck = atom.config
         .get("Java-Bytecode-Disassembler.additionalPathsToCheck")
			.replace(/\s/g, '')
			.split(',')
      ;

      // Find additional paths to check from settings and add them if they exist
      for (var i = 0; i < additionalPathsToCheck.length; i++)
		{
			if (fs.existsSync(this.escapePath(additionalPathsToCheck[i])))
			{
				command += ' -source "' + this.escapePath(additionalPathsToCheck[i]) + '"';
			}
		}


		if (dir.length)
		{
			sanitizedDir = "\"" + this.escapePath(dir) + "\"";
			command += ' -source "' + sanitizedDir + '"';
			fileName = dir.replace(/^.*[\\\/]/, '').replace('.class', '');
		}

		if (className)
		{
			command += ' ' + className;
			fileName = className;
		}

		var aThis = this;
		var result;

		var view = new DisassembledView(
			fileName,
			dir,
			sanitizedJarPath
		);

		var child = ChildProcess.exec(
			command,
			{ // exec options
				timeout: atom.config.get(
					"Java-Bytecode-Disassembler.disassemblerTimeout"
				),
				maxBuffer: atom.config.get(
					"Java-Bytecode-Disassembler.stdoutMaxBuffer"
				) * 1024
			},
			function(error, stdout, stderror) // exec callback
			{
				if (error)
				{
					console.error(error.message);
					var errorMessage =
						error.message === "stdout maxBuffer exceeded"
                  ? "Disassembler Max-Buffer exceeded ("
                     + atom.config.get("Java-Bytecode-Disassembler.stdoutMaxBuffer")
                     + "kb). You can increase this number in the settings"
                  : error.message
               ;
					atom.notifications.addError(
						"Error disassembling the file. Check the log for more details",
						{
							detail: errorMessage
						}
					);
					view.loadErrorMessage(errorMessage);
					return;
				}
				view.loadFinalContent(stdout.toString());

				const outlineItem = {
					element: view.getMapPanel(),
					visible: true,
					getTitle() {return 'Outline'},
					getDefaultLocation() {return 'right'},
				};

				atom.workspace.open(outlineItem);
			}
		);

		/*
		child.stdout.on('data', function(data) {
		  if(!data.toString().includes("<")){
		    view.addProgressInfo(data.toString());
		  }
		});
		*/

		return view;
	},

	escapePath(dir)
	{
		if (os.platform() !== 'win32')
		{
			dir = dir.replace(/(["\s'$`\\])/g, '\\$1');
		}
		return path.normalize(dir);
	}
};
