'use babel';
import $ from "jquery";
import path from "path";
import fs from "fs";

export default class DisassembledView {

    constructor(fileName, htmlContent, uri, jarPath) {
        var aThis = this;
        this.uri = uri;
        this.fileName = fileName;
        this.jarPath = jarPath;
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
          '.members .fields .field .field_declaration'
        ).each(
          function(index, element){
            element.id = "field-" + index;
            liNestedField = document.createElement('li');
            liNestedField.classList.add('map-element');
            liNestedField.setAttribute('data-target-id', "field-" + index);
            liNestedField.appendChild(element.cloneNode(true));

            // set tooltip
            var title = $(element).find(".access_flags").html()
              + " " + $(element).find(".field_type").html().replace("&lt;", "<").replace("&gt;", ">")
              + $(element).find(".name").html()
            ;
            liNestedField.setAttribute(
              "title",
              title
            );

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
          '.methods .method .method_declaration'
        ).each(
          function(index, element){
            element.id = "method-signature-" + index;
            liNestedMethod = document.createElement('li');
            liNestedMethod.classList.add('map-element');
            liNestedMethod.setAttribute('data-target-id', "method-signature-" + index);

            // set tooltip
            var title = $(element).find(".access_flags").html()
              + " " + $(element).find(".return").html().replace("&lt;", "<").replace("&gt;", ">")
              + " " + $(element).find(".name").html().replace("&lt;", "<").replace("&gt;", ">")
              + " ( "
            ;
            $(element).find(".parameters .parameter")
              .each(function(index, param){
                title += param.innerHTML
                  .replace("&lt;", "<").replace("&gt;", ">") + " "
                ;
              }
            );
            title += ")";
            liNestedMethod.setAttribute(
              "title",
              title
            );

            liNestedMethod.appendChild(element.cloneNode(true));
            ulNestedMethods.appendChild(liNestedMethod);
          }
        );
        liMethods.appendChild(ulNestedMethods);
        ul.appendChild(liMethods);
        mapPanel.appendChild(ul);
        this.element.appendChild(mapPanel);
        $(ul).find(".object_type").removeClass("object_type");

        $(this.element).find(".object_type:not(summary *)").click(this.tryToDisassembleFQN.bind(this));

        $(this.element).find(".tooltip").removeClass("tooltip");

        if(!atom.config.get("Java-Bytecode-Disassembler.fieldsExpandedByDefault")){
          $(this.element).find("details[open]").removeAttr("open");
        }


        // Init map
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
      this.element.addEventListener("DOMContentLoaded", function(event) {
        this.toggleUnusedFlags();
        this.trimPackageNames();
        var aThis = this;
      	// adds a listener to details.method_body that is called when its attributes change
      	var targets = this.element.querySelectorAll('details.method_body');
      	var observer = new MutationObserver(function(mutations) {
      		aThis.removeLongExceptionNames();
      	});
      	var config = { attributes: true, childList: false, characterData: false};
      	targets.forEach(function(target) {
      		observer.observe(target, config);
      	});
      }.bind(this));
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
       var definingClassNameFQN = this.element.querySelector("#defined_class").innerHTML;
       var definingPackages = definingClassNameFQN.split(".");
       // splice removes the class name from the package array and returns it:
       var definingClassName = definingPackages.splice(definingPackages.length-1);

       for(var i=1;i<definingPackages.length;i++) {
         definingPackages[i] = definingPackages[i-1] + "." + definingPackages[i];
       }
       this.element.querySelectorAll(".object_type").forEach(function(e) {
         for(var i=definingPackages.length-1;i>=0;i--) {
           while (e.innerHTML.indexOf(definingPackages[i]+".") >= 0) {
             e.innerHTML = e.innerHTML.replace(definingPackages[i], new Array(i + 1).join( "." ));
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
      exceptions.forEach(function(e) {
       var span = e.querySelector('span');
       if (span != null) {
         var tbody = span.parentNode.parentNode.parentNode;

         // if the totalOffset+width of the span is greater than totalOffset+height of
         // the table body it would overlap to the next section (exception table)
         if (totalOffset(span).top+span.clientWidth > totalOffset(tbody).top+tbody.clientHeight) {
           span.innerHTML = span.getAttribute("data-exception-index") + ': ...';
         }

         if (totalOffset(span).top+span.clientWidth > totalOffset(tbody).top+tbody.clientHeight) {
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
   if(!elem) elem = this;

   var x = elem.offsetLeft;
   var y = elem.offsetTop;

   while (elem = elem.offsetParent) {
     x += elem.offsetLeft;
     y += elem.offsetTop;
   }

   return { left: x, top: y };
  }

    tryToDisassembleFQN(e){
      var canonicalClassName = e.target.innerHTML;
      if(canonicalClassName.startsWith('.')){
        canonicalClassName = canonicalClassName.replace(/^\.+/g, e.target.title);
      }

      if(this.jarPath){
        atom.workspace.open(jarPath + "?className=" + canonicalClassName);
        return;
      }

      var classPath = e.target.innerHTML.replace(/\./g, path.sep) + '.class';

      var dir = this.uri.substring(0, this.uri.lastIndexOf(path.sep));

      if( dir.lastIndexOf(classPath) > -1){
        dir = dir.substring(0, dir.lastIndexOf(classPath));
      }

      if (fs.existsSync(dir + classPath))
      {
        atom.workspace.open(dir + "/" + classPath + "?force-disassemble");
      }
      else{
        var projectPaths = atom.project.getPaths();
        for(var i = 0; i < projectPaths.length; i++){
          if(dir.indexOf(projectPaths[i]) >= 0){
            dir = projectPaths[i];
            atom.workspace.open(dir + "?className=" + canonicalClassName);
            return;
          }
        }
        atom.workspace.open(dir + "?className=" + canonicalClassName);
      }
    }
}
