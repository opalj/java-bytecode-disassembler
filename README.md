# Java Bytecode Disassembler

A package for the Atom editor which enables you to easily run the OPAL Java Bytecode Disassembler on your java bytecode for a one-to-one representation of the class file directly from the Atom editor.

For more information on the OPAL project, visit [opal-project.de](http://www.opal-project.de/).

## Getting Started

Install the package from Atom's package installer by searching for Java-Bytecode-Disassembler. Alternatively (or if you want to work/expand on the package), you can install the package manually by downloading/cloning this repository and following the instructions below.

### Requirements

Make sure you have the latest version of Atom installed. The plugin has been tested with version 1.27.2

### Manual Installation

Clone the repository to your system

```
git clone https://github.com/nicolas-mosch/java-bytecode-disassembler
```

Move into the project's folder

```
cd java-bytecode-disassembler
```

Install dependencies

```
apm install
```

Link to Atom's packages

```
apm link
```

### Usage

To use the package simply right-click on a .class file in the tree-view and click on Opal-Disassemble. This should open a new tab with the disassembled view. In the settings you can select whether you want to open .class files with the disassembler by default.

### Problems

If you encounter any problems installing the package from the atom package manager, you can try to install it via the command line using the command below.

```
apm install java-bytecode-disassembler
```

## Latest Changes
* v0.10.0 - Feat: Add outline-view.
    * Previously, the information was displayed in a map panel at the top of the
    disassembled view. This has been moved to an outline-view on the right.
    The fields are auto-expanded, but can be collapsed if they are clicked.
* v0.9.1 - Doc: Fix README and CHANGELOG to include correct version number
* v0.9 - Feat: Adapt colours to match the syntax theme.
    * Previously, the syntax-theme in the disassembled view
    had the colours of the dark theme, regardless of the syntax
    theme selected by the user. This has been changed to provide
    the user with a more consistent experience.
    The downside: A light UI theme in combination with a dark syntax
    theme makes the attribute's inner classes hardly readable.
    If you use the aforementioned theme combination please change it
    or open an issue on Github.
* v0.8.2 - Fix: Increase default stdoutMaxBuffer to 16000
    * The default stdoutMaxBuffer is increased to 16000 because 4000
    was too little for some bigger files.
    Additionally, README.md and CHANGELOG.md have been updated.
* v0.8.1 - Fix: Space in jar name doesn't cause error anymore
* For a full list see: [CHANGELOG.md](https://github.com/nicolas-mosch/java-bytecode-disassembler/blob/master/CHANGELOG.md)


## Authors

* **Nicolas Morew**
* **Ruslan Sandler**

## License

This project is licensed under the BSD 2-Clause License - see the [LICENSE.md](LICENSE.md) file for details
