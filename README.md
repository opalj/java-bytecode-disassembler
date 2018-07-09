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
* v0.12.1 - Fix: Display 3-Address-Code for methods in bottom dock
    * 3-Address-Code for methods isn't displayed in a new window anymore.
    Instead, it is displayed at the bottom of the disassembled view in a
    separate dock.
* v0.12.0 - Feature: Add option to show 3-Address-Code for methods
    * If you right-click a method-name in the disassembled view, you can
    display its 3-Address-Code by clicking on "Show 3-Address-Code (Method)"
    * Fixed a bug where 3-Address-Code for files with irregular characters
    wasn't displayed correctly.
* v0.11.0 - Feature: Add option to show 3-Address-Code to context menu
    * If you right-click a .class file in the file tree, you have the option
    to "Show 3-Address-Code" now.
* v0.10.1 - Fix: Add scroll-bar, increase text size (outline-view)
    * Previously, large classes couldn't be viewed in their entirety in the
    outline-view. This has been fixed by adding a scroll-bar.
    * The text size in outline-view has been increased to make it more easily
    readable and to match it the larger space, which the outline-view offers.
* v0.10.0 - Feat: Add outline-view.
    * Previously, the information was displayed in a map panel at the top of the
    disassembled view. This has been moved to an outline-view on the right.
    The fields are auto-expanded, but can be collapsed if they are clicked.
* For a full list see: [CHANGELOG.md](https://github.com/nicolas-mosch/java-bytecode-disassembler/blob/master/CHANGELOG.md)


## Authors

* **Nicolas Morew**
* **Ruslan Sandler**

## License

This project is licensed under the BSD 2-Clause License - see the [LICENSE.md](LICENSE.md) file for details
