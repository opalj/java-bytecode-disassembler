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
