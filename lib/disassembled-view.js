'use babel';
import $ from "jquery";

export default class DisassembledView {

    constructor(fileName, htmlContent, uri) {
        var aThis = this;
        this.uri = uri;
        this.fileName = fileName;
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('java-bytecode-disassembler');

        this.element.innerHTML = htmlContent;

        $(this.element).find("#filter_by_method_name").addClass("native-key-bindings");

        this.toggleUnusedFlags();
        this.trimPackageNames();
        // adds a listener to details.method_body that is called when its attributes change
        var targets = this.element.querySelectorAll('details.method_body');
        var observer = new MutationObserver(function(mutations) {
            aThis.removeLongExceptionNames();
        });
        var config = {
            attributes: true,
            childList: false,
            characterData: false
        };
        targets.forEach(function(target) {
            observer.observe(target, config);
        });

        $(this.element).find('input[type="radio"]').click(this.toggleFilter.bind(this));
        $(this.element).find('input[type="checkbox"]').click(this.toggleFilter.bind(this));
        $(this.element).find('#filter_by_method_name').keyup(this.toggleFilter.bind(this));
        $(this.element).find('button[value="clear"]').click(this.clearFilter.bind(this));
    }

    getTitle() {
        return this.fileName + ' (disassembled)';
    }

    getURI() {
        return this.uri;
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
        this.element.remove();
    }

    getElement() {
        return this.element;
    }

    /**
     * Trims the package names of classes that are on the same package-path
     * as the disassembled class. Each match is replaced by a dot.
     *
     * Examples with java.awt.event.ActionEvent as disassembled class:
     * 		java.awt.event.InputEvent -> ...InputEvent
     *	 	java.awt.font.GraphicAttribute -> ..font.GraphicAttribute
     * 		org.opalj.SomeClass -> org.opalj.SomeClass
     */
    trimPackageNames() {
        // get defining class name and split for packages
        var definingClassNameFQN = this.element.querySelector("#defining_class").innerHTML;
        var definingPackages = definingClassNameFQN.split(".");
        // splice removes the class name from the package array and returns it:
        var definingClassName = definingPackages.splice(definingPackages.length - 1);

        for (var i = 1; i < definingPackages.length; i++) {
            definingPackages[i] = definingPackages[i - 1] + "." + definingPackages[i];
        }
        this.element.querySelectorAll(".fqn").forEach(function(e) {
            for (var i = definingPackages.length - 1; i >= 0; i--) {
                while (e.innerHTML.indexOf(definingPackages[i] + ".") >= 0) {
                    e.innerHTML = e.innerHTML.replace(definingPackages[i], new Array(i + 1).join("."));
                    e.title = definingPackages[i] + ".";
                }
            }
        });
    }


    toggleUnusedFlags() {
        // sets the input element on disabled and puts a corresponding color on its label
        var aThis = this;
        var disableInput = function(element, disable) {
            element.disabled = disable;
            var label = aThis.element.querySelector('label[for="' + element.id + '"]');
            if (disable)
                label.style.color = "lightgray";
            else
                label.style.color = "black";
        }
        var possibleFlags = this.element.querySelectorAll('input:not(:checked)[type="checkbox"],input:not(:checked)[type="radio"]');
        var selectedFlags = this.element.querySelectorAll('input:checked[type="checkbox"],input:checked[type="radio"]');

        var filterString = "div[class='method']"
        selectedFlags.forEach(function(e) {
            filterString += "[data-access-flags*='" + e.value + "']"
        });
        possibleFlags.forEach(function(e) {
            if (e.type == "radio") {
                // on radio types, we have to filter the currently set radio-button in the same set as they are mutually exclusive
                filterString = "div[class='method']"
                selectedFlags.forEach(function(f) {
                    if (e.name != f.name)
                        filterString += "[data-access-flags*='" + f.value + "']";
                });
            }
            var possibleElements = aThis.element.querySelectorAll(filterString + "[data-access-flags*='" + e.value + "']").length;
            if (possibleElements > 0)
                disableInput(e, false);
            else
                disableInput(e, true);
        });
    }

    /**
     * Removes the exception name from the exceptions overview if the containing element
     * (span) would overlap to the next section of the document.
     */
    removeLongExceptionNames() {
        var exceptions = this.element.querySelectorAll('td.exception');
        var aThis = this;
        exceptions.forEach(function(e) {
            var span = e.querySelector('span');
            if (span != null) {
                var tbody = span.parentNode.parentNode.parentNode;

                // if the totalOffset+width of the span is greater than totalOffset+height of
                // the table body it would overlap to the next section (exception table)
                if (aThis.totalOffset(span).top + span.clientWidth > aThis.totalOffset(tbody).top + tbody.clientHeight) {
                    span.innerHTML = span.getAttribute("data-exception-index") + ': ...';
                }
                if (aThis.totalOffset(span).top + span.clientWidth > aThis.totalOffset(tbody).top + tbody.clientHeight) {
                    span.innerHTML = span.getAttribute("data-exception-index") + ':';
                }
            }
        });
    }

    /**
     * Computes the offset of an HTMLElement from the top/left corner of the document
     * in contrast to HTMLElement.offsetLeft/offsetTop which computes the offset relative
     * to their HTMLElement.offsetParent node.
     */
    totalOffset(elem) {
        if (!elem) elem = this;

        var x = elem.offsetLeft;
        var y = elem.offsetTop;

        while (elem = elem.offsetParent) {
            x += elem.offsetLeft;
            y += elem.offsetTop;
        }

        return {
            left: x,
            top: y
        };
    }


    clearFilter() {
        // clear flags filter
        var flagsFilter = this.element.querySelectorAll('input:checked[type="checkbox"],input:checked[type="radio"]');
        flagsFilter.forEach(function(f) {
            f.checked = false
        });

        // clear name filter
        this.element.querySelectorAll('input[type="text"]').forEach(function(e) {
            e.value = ""
        })

        // update "view"
        this.toggleFilter();
    }

    toggleFilter() {
        var flagsFilter = this.element.querySelectorAll('input:checked[type="checkbox"],input:checked[type="radio"]');
        var nameFilter = this.element.querySelector('input[type="text"]').value
        if (flagsFilter.length == 0 && nameFilter.length == 0) {
            // clear filter property
            this.element.querySelectorAll('div[class="method"]').forEach(function(e) {
                e.style.display = 'block'
            })
        } else {
            // 1. hide all
            this.element.querySelectorAll("div[class='method']").forEach(function(e) {
                e.style.display = 'none'
            })

            var filterString = "div[class='method']"
            flagsFilter.forEach(function(e) {
                filterString += "[data-access-flags*='" + e.value + "']"
            });
            if (nameFilter.length > 0)
                filterString += "[data-name*='" + this.element.querySelector('input[type="text"]').value + "']";

            // 2. show filtered
            this.element.querySelectorAll(filterString).forEach(function(e) {
                e.style.display = 'block'
            })
        }
        this.toggleUnusedFlags();
    }
}
