'use babel';

export default
{
	config: {
		openOnClick: {
			title: 'Default .class Viewer',
			description: 'When this option is enabled .class files will be opened directly with the Opal Java Bytecode Disassembler instead of the text editor',
			type: 'boolean',
			default: false
		},
		redisassembleOnClick: {
			title: 'Always Disassemble',
			description: 'When this option is enabled, opening a .class file with the Opal Java Bytecode Disassembler will always disassemble it again before displaying the disassembled view',
			type: 'boolean',
			default: false
		}
	}
};
