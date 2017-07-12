'use babel';

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
			default: '$HOME/.ivy2, $HOME/.m2'
		}
	}
};
