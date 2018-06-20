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
* v0.8.1 - Fix: Space in jar name doesn't cause error anymore
* v0.8.0 - Feat: Add support for java-9 and java-10. Fix colours for themes.
    * Previously, the tool worked only with java-8. Now it also functions
    with java-9 and 10.
    Additionally, some theme and colour combinations
    in Atom didn't work out (i.e. white colour on white background), so
    some colours were adjusted with the aim to be more easily readable.
* For a full list see: [CHANGELOG.md](https://github.com/nicolas-mosch/java-bytecode-disassembler/blob/master/CHANGELOG.md)


## Authors

* **Nicolas Morew**
* **Ruslan Sandler**

## License

This project is licensed under the BSD 2-Clause License - see the [LICENSE.md](LICENSE.md) file for details
