## v0.12.4
* Fix: Methods from the JDK can be displayed in 3-Address-Code now

## v0.12.3
* Fix: Bug fixes of issues mentioned below
    * 3-Address-Code wasn't displayed for several classes.
    * If the jar file had spaces, 3-Address-Code for methods wasn't displayed.

## v0.12.2
* Fix: Display 3-Address-Code for methods inside jars
    * Fixed a bug which disallowed displaying 3-Address-Code for methods
    belonging to .class files inside a jar.

## v0.12.1
* Fix: Display 3-Address-Code for methods in bottom dock
    * 3-Address-Code for methods isn't displayed in a new window anymore.
    Instead, it is displayed at the bottom of the disassembled view in a
    separate dock.

## v0.12.0
* Feature: Add option to show 3-Address-Code for methods
    * If you right-click a method-name in the disassembled view, you can
    display its 3-Address-Code by clicking on "Show 3-Address-Code (Method)"
    * Fixed a bug where 3-Address-Code for files with irregular characters
    wasn't displayed correctly.

## v0.11.0
* Feature: Add option to show 3-Address-Code to context menu
    * If you right-click a .class file in the file tree, you have the option
    to "Show 3-Address-Code" now.

## v0.10.1
* Fix: Add scroll-bar, increase text size (outline-view)
    * Previously, large classes couldn't be viewed in their entirety in the
    outline-view. This has been fixed by adding a scroll-bar.
    * The text size in outline-view has been increased to make it more easily
    readable and to match it the larger space, which the outline-view offers.

## v0.10.0
* Feat: Add outline-view.
    * Previously, the information was displayed in a map panel at the top of the
    disassembled view. This has been moved to an outline-view on the right.
    The fields are auto-expanded, but can be collapsed if they are clicked.

## v0.9.1
* Doc: Fix README and CHANGELOG to include correct version number

## v0.9
* Feat: Adapt colours to match the syntax theme.
    * Previously, the syntax-theme in the disassembled view
    had the colours of the dark theme, regardless of the syntax
    theme selected by the user. This has been changed to provide
    the user with a more consistent experience.
    The downside: A light UI theme in combination with a dark syntax
    theme makes the attribute's inner classes hardly readable.
    If you use the aforementioned theme combination please change it
    or open an issue on Github.

## v0.8.2
* Fix: Increase default stdoutMaxBuffer to 16000
    * The default stdoutMaxBuffer is increased to 16000 because 4000
    was too little for some bigger files.
    Additionally, README.md and CHANGELOG.md have been updated.

## v0.8.1
* Fix: Space in jar name doesn't cause error anymore

## v0.8.0
* Feat: Add support for java-9 and java-10. Fix colours for themes.
    * Previously, the tool worked only with java-8. Now it also functions
    with java-9 and 10.
    Additionally, some theme and colour combinations
    in Atom didn't work out (i.e. white colour on white background), so
    some colours were adjusted with the aim to be more easily readable.

## 0.1.0 - First Release
* Every feature added
* Every bug fixed
