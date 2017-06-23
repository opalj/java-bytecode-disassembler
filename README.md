# Java Bytecode Disassembler

A package for the Atom editor which enables you to easily run the OPAL Java Bytecode Disassembler on your java bytecode for a one-to-one representation of the class file directly from the Atom editor.

For more information on the OPAL project, visit [opal-project.de](http://www.opal-project.de/).

## Getting Started

Currently you can only install the package manually by downloading/cloning this repository and following the instructions below.

### Requirements

Make sure you have the latest version of Atom installed. The plugin has been tested with version 1.18.0

### Installing

Clone the repository to your system

```
git clone https://github.com/nicolas-mosch/java-bytecode-disassembler
```

Install dependencies (from project's folder)

```
apm install
```

Link to Atom's packages (from project's folder)

```
apm link
```

### Usage

To use the package simply right-click on a .class file in the tree-view and click on Opal-Disassemble. This should open a new tab with the disassembled view.

## Authors

* **Nicolas Morew**

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
