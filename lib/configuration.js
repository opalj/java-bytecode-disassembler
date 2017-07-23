'use babel';
import os from "os";
var home;
if(os.platform() !== 'win32'){
	home = "~";
}else{
	home = "%HOMEDRIVE%%HOMEPATH%";
}

export default
{
	config: {
		openOnClick: {
			title: 'Default .class Viewer',
			description: 'When this option is enabled .class files will be opened directly with the Opal Java Bytecode Disassembler instead of the text editor',
			type: 'boolean',
			default: true
		},
		checkInJDK: {
			title: 'Check for classes in JDK',
			description: 'When this option is enabled, opening an object-type from the disassembled-view will also look for that type in the JDK',
			type: 'boolean',
			default: true
		},
		additionalPathsToCheck: {
			title: 'Class Sources',
			description: 'The given paths will be checked as well when opening an object-type from the disassembled-view',
			type: 'string',
			default: home + '/.ivy2, ' + home + '/.m2'
		},
		fieldsExpandedByDefault:{
			title: 'Expand Fields and Methods',
			description: 'When this option is enabled, the fields and methods subsections of the disassembled-view will be expanded by default',
			type: 'boolean',
			default: true
		}
	}
};
