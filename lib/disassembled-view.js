'use babel';
import $ from "jquery";
import path from "path";
import fs from "fs";

export default class DisassembledView {

    constructor(fileName, htmlContent, uri) {
        var aThis = this;
        this.uri = uri;
        this.fileName = fileName;
        // Create root element
        this.element = document.createElement('div');
        this.element.classList.add('java-bytecode-disassembler');
        this.element.classList.add('pane-item');
        this.element.innerHTML = htmlContent;

        var mapPanel = document.createElement('div');
        mapPanel.id = "disassembled-view-map-panel";
        var ul = document.createElement('ul');
        ul.id = "disassembled-view-map-tree";

        // Add fields
        var liFields = document.createElement('li');
        var spanFields = document.createElement('span');
        spanFields.innerHTML = 'Fields';
        spanFields.classList.add('collapsed', 'handle');
        liFields.appendChild(spanFields);

        var ulNestedFields = document.createElement('ul');
        var liNestedField;

        $(this.element).find(
          '.members .fields .field'
        ).each(
          function(index, element){
            element.id = "field-" + index;
            liNestedField = document.createElement('li');
            liNestedField.classList.add('map-element');
            liNestedField.setAttribute('data-target-id', "field-" + index);
            liNestedField.innerHTML = element.innerHTML;
            ulNestedFields.appendChild(liNestedField);
          }
        );
        liFields.appendChild(ulNestedFields);
        ul.appendChild(liFields);

        // Add methods
        var liMethods = document.createElement('li');
        var spanMethods = document.createElement('span');
        spanMethods.innerHTML = 'Methods';
        spanMethods.classList.add('collapsed', 'handle');
        liMethods.appendChild(spanMethods);
        var ulNestedMethods = document.createElement('ul');
        var liNestedMethod;

        $(this.element).find(
          '.methods .method .method_signature'
        ).each(
          function(index, element){
            element.id = "method-signature-" + index;
            liNestedMethod = document.createElement('li');
            liNestedMethod.classList.add('map-element');
            liNestedMethod.setAttribute('data-target-id', "method-signature-" + index);

            liNestedMethod.innerHTML = $(element).html();
            ulNestedMethods.appendChild(liNestedMethod);
          }
        );
        liMethods.appendChild(ulNestedMethods);
        ul.appendChild(liMethods);
        mapPanel.appendChild(ul);
        this.element.appendChild(mapPanel);

        $(this.element).find(".fqn").click(this.tryToDisassembleFQN.bind(this));
        $(this.element).find(".tooltip").removeClass("tooltip");



        $(ul).find("ul").hide();


        $(ul).find("span.handle").each(function() {
           $(this).click(function() {
             $(this).toggleClass("collapsed expanded");
             $(this).siblings("ul").toggle();
           });
        });

        $(ul).find('.map-element').each(function(){
           $(this).click(function(e){
             if($(this).data('target-id').startsWith("method-signature")){
                details = $('.class_file .members .methods').children("details").get(0);
             }else{
                details = $('.class_file .members .fields').children("details").get(0);
             }
             if(!details.open){
                details.open = true;
             }
             var targetId = "#" + $(this).data('target-id');
             $(targetId).addClass("highlighted");
             var interval = setInterval(
                function(){
                   $(targetId).removeClass("highlighted");
                   clearInterval(interval);
                },
                1200
             );
             $('.class_file').animate(
                {
                   scrollTop: parseInt($('.class_file').scrollTop() + $(targetId).offset().top - $(targetId).height() * 2)
                },
                {
                   duration: 500
                }
             );
          });
       });
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

    tryToDisassembleFQN(e){
      var classPath = e.target.innerHTML.replace(/\./g, path.sep) + '.class';
      var classPathRoot = classPath.split(path.sep)[0];

      var dir = this.uri.substring(0, this.uri.lastIndexOf(path.sep) + 1);
      if( dir.lastIndexOf(classPathRoot) > -1){
        dir = dir.substring(0, dir.lastIndexOf(classPathRoot));
      }
      dir += classPath;

      if (!fs.existsSync(dir))
      {
        atom.notifications.addWarning(
          "Error trying to disassemble file",
          {
            detail: "Could not find file: " + dir
          })
        return;
      }
      atom.workspace.open(dir + "?force-disassemble");

    }


}
