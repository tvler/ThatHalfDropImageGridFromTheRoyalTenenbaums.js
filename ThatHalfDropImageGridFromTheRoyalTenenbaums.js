'use strict';

var _halfdrop = {};

// variables
//
_halfdrop.defaultValues = {
   // "public"
   src         : '',
   snap        : false,
   maxWidth    : -1,
   minWidth    : 0,
   width       : 0,
   maxHeight   : -1,
   minHeight   : 0,
   height      : 0,

   //"private" (don't enter these parameters into ur settings or else)
   keepRatio   : true,   // if the image aspect ratio won't be messed with
   ratio       : 0,
   oldWidth    : 0,
   oldHeight   : 0,
}

// initializing and first update
//
_halfdrop.init = function(){

   _halfdrop.elems     = document.querySelectorAll('[data-halfdrop]');
   _halfdrop.imgs      = [];
   _halfdrop.settings  = [];

   for(var j=0; j<this.elems.length; j++){

      // local vars
      //
      var elem         = this.elems[j],
          elemSettings = elem.getAttribute('data-halfdrop'),
          img          = new Image(),

          //deep, private clone of the default values
          //
          defVals  = this.extend( this.defaultValues, {} );

      // reading an element's settings
      //

      // ** if elemSettings is blank, get image from .style or .getComputedStyle
      // **
         if(!elemSettings){
            defVals.maxWidth = defVals.maxHeight = '100%';
            this.settings[j] = this.extend( defVals, {} );
            this.settings[j].src = (elem.style.backgroundImage || window.getComputedStyle(elem, null).backgroundImage);

            // replacing that url('') syntax madness
            //
            this.settings[j].src = this.settings[j].src.replace('url(','').replace(')','').replace("'","").replace('"','').replace("'","").replace('"','');

            elem.style.background = '';
         }

         // ** if an attribute is a JSON object
         // **
         else if(elemSettings[0] === '{'){
            elemSettings = JSON.parse(elemSettings);

            // if ANY dimension properties have been set,
            // REMOVE the default max width/height from the temporary clone of defaultValues
            //
            if(elemSettings.minWidth || elemSettings.maxWidth || elemSettings.width ||
               elemSettings.minHeight || elemSettings.maxHeight || elemSettings.height ||
               elemSettings.snap) {

               // override the default maxWidth and maxHeight values
               // ONLY if they haven't been manually set as default values
               //
               if(defVals.maxWidth  === -1) defVals.maxWidth  = 0;
               if(defVals.maxHeight === -1) defVals.maxHeight = 0;
            }
            else{
               // the max width/height are set to -1 initially because
               // if the global default value of maxWidth or maxHeight is manually set to "100%",
               // that would be ignored and treated like nothing was manually set by the user :(
               //
               defVals.maxWidth = defVals.maxHeight = '100%';
            }

            this.settings[j] = this.extend( defVals, elemSettings || {} );
            if(!this.settings[j].src){
               this.settings[j].src.replace('url(','').replace(')','').replace("'","").replace('"','').replace("'","").replace('"','');
            }
         }

      // ** else, the attribute data is only the image file
      // **
         else{
            defVals.maxWidth = defVals.maxHeight = '100%';
            this.settings[j] = this.extend( defVals, {} );
            this.settings[j].src = elemSettings;
         }

      //
      // end of reading the settings

      // checking if natural image ratio will be kept
      //
      if(this.settings[j].width && this.settings[j].height){
         this.settings[j].keepRatio = false;
      }

      // creating each element's associated image object
      //
      img.setAttribute('data-index', j);
      img.onload = _halfdrop.paintBack;
      img.src = this.settings[j].src;
      this.imgs.push(img);
   }
}

// updating image positions
//
_halfdrop.update = function(){
   for(var j=0; j<_halfdrop.elems.length; j++){
      _halfdrop.imgs[j].onload();
   }
}

// painting an element's background
//
_halfdrop.paintBack = function(){

   // locar vars
   //
   var index    = parseInt(this.getAttribute('data-index')),
       elem     = _halfdrop.elems[index],
       settings = _halfdrop.settings[index],
       elemW    = elem.offsetWidth,
       elemH    = elem.offsetHeight,
       url      = 'url("'+this.src+'") repeat-y ',
       style    = '',
       imgW     = this.naturalWidth,
       imgH     = this.naturalHeight,
       size;

   // DON'T RUN THIS FUNCTION IF THE ELEMENT WIDTH AND HEIGHT ARE THE SAME AS LAST TIME
   //
   if(settings.oldWidth && settings.oldWidth === elemW && settings.oldHeight === elemH){
      return;
   }

   settings.oldWidth =  elemW;
   settings.oldHeight = elemH;

   // setting ratio for the first time
   //
   if(!settings.ratio){
      settings.ratio = this.width / this.height;
   }

   // conditional formating based on settings
   //

   // ** if the ratio is being kept
   // ** aka if width XOR height has been declared
   // **
      if(settings.keepRatio){
         if(settings.width){
            imgW = _halfdrop.parseInput(settings.width, elemW);
            imgH = imgW / settings.ratio;
         }
         else if(settings.height){
            imgH = _halfdrop.parseInput(settings.height, elemH);
            imgW = imgH * settings.ratio;
         }
         if(settings.minWidth && imgW < (size = _halfdrop.parseInput(settings.minWidth, elemW))){
            imgW = size;
            imgH = imgW / settings.ratio;
         }
         if(settings.minHeight && imgH < (size = _halfdrop.parseInput(settings.minHeight, elemH))){
            imgH = size;
            imgW = imgH * settings.ratio;
         }
         if(settings.maxWidth && imgW > (size = _halfdrop.parseInput(settings.maxWidth, elemW))){
            imgW = size;
            imgH = imgW / settings.ratio;
         }
         if(settings.maxHeight && imgH > (size = _halfdrop.parseInput(settings.maxHeight, elemH))){
            imgH = size;
            imgW = imgH * settings.ratio;
         }
      }

   // ** if the ratio is NOT being kept
   // ** aka if width AND height has been declared
   // **
      else{
         imgW = _halfdrop.parseInput(settings.width, elemW);
         imgH = _halfdrop.parseInput(settings.height, elemH);
         if(settings.minWidth && imgW < (size = _halfdrop.parseInput(settings.minWidth, elemW))){
            imgW = size;
         }
         if(settings.minHeight && imgH < (size = _halfdrop.parseInput(settings.minHeight, elemH))){
            imgH = size;
         }
         if(settings.maxWidth && imgW > (size = _halfdrop.parseInput(settings.maxWidth, elemW))){
            imgW = size;
         }
         if(settings.maxHeight && imgH > (size = _halfdrop.parseInput(settings.maxHeight, elemH))){
            imgH = size;
         }
      }

   // ** snapping to column width
   // **
      if(settings.snap){

         // if both max width/height are set, choose the smallest constraint
         //
         if(settings.maxWidth && settings.maxHeight){
            var snapWidth = Math.min(_halfdrop.parseInput(settings.maxWidth, elemW), _halfdrop.parseInput(settings.maxHeight, elemH) * settings.ratio);
            var floorOrCeil = Math.ceil;
         }

         // if max width is set
         //
         else if(settings.maxWidth){
            var snapWidth = _halfdrop.parseInput(settings.maxWidth, elemW);
            var floorOrCeil = Math.ceil;
         }

         //if max height is set
         //
         else if(settings.maxHeight){
            var snapWidth   = _halfdrop.parseInput(settings.maxHeight, elemH) * settings.ratio;
            var floorOrCeil = Math.ceil;
         }

         // if both min width/height are set, choose the largest constraint
         //
         else if(settings.minWidth && settings.minHeight){
            var snapWidth   = Math.max(_halfdrop.parseInput(settings.minWidth, elemW), _halfdrop.parseInput(settings.minHeight, elemH) * settings.ratio);
            var floorOrCeil = Math.floor;
         }

         // if min width is set
         //
         else if(settings.minWidth){
            var snapWidth   = _halfdrop.parseInput(settings.minWidth, elemW);
            var floorOrCeil = Math.floor;
         }

         // if min height is set
         //
         else if(settings.minHeight){
            var snapWidth   = _halfdrop.parseInput(settings.minHeight, elemH) * settings.ratio;
            var floorOrCeil = Math.floor;
         }

         // if nothing's set, just create a 3 column grid :(
         //
         else{
            var snapWidth   = elemW / 3;
            var floorOrCeil = Math.ceil;
         }
         var snapRows = floorOrCeil((elemW / snapWidth - 1) / 2) * 2 + 1;
         if(snapRows < 3) snapRows = 3;
         imgW = elemW / snapRows;
         imgH = imgW / settings.ratio;
      }
   //
   // end of conditional settings

   // maxing the image dimensions because CSS background doesn't take
   // decimal image sizes
   //
   imgW = Math.ceil(imgW);
   imgH = Math.ceil(imgH);

   // creating local vars that depend on the conditional settings
   //
   var vert   = ' / '+imgW+'px '+imgH+'px, ',
       center = Math.ceil((elemW - imgW) / 2),
       amount = Math.floor(Math.ceil(elemW / imgW) / 2),
       i      = 1,
       rows   = 2*amount + 1,
       place;

   // the painting!!!!!!!!!!!!
   //
   while(i <= amount){
      place = 'px ' + (elemH/2)+'px' + vert;
      style += url+(center + i * imgW)+place + url+(center - i * imgW)+place;
      i += 2;
   }
   style += 'url("'+this.src+'") repeat '+(center)+'px 50%' + vert;
   style = style.slice(0,-2);

   elem.style.background = style;
}

// extend settings object (via github.com/cferdinandi/smooth-scroll/blob/master/src/js/smooth-scroll.js)
//
_halfdrop.extend = function () {

   // local vars
   //
   var extended = {};
   var deep     = false;
   var i        = 0;
   var length   = arguments.length;

   // Check if a deep merge
   //
   if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
      deep = arguments[0];
      i++;
   }

   // Merge the object into the extended object
   //
   var merge = function (obj) {
      for ( var prop in obj ) {
         if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
            // If deep merge and property is an object, merge properties
            if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
               extended[prop] = extend( true, extended[prop], obj[prop] );
            } else {
               extended[prop] = obj[prop];
            }
         }
      }
   };

   // Loop through each object and conduct a merge
   //
   for ( ; i < length; i++ ) {
      var obj = arguments[i];
      merge(obj);
   }

   return extended;
}

_halfdrop.parseInput = function(inp, elemDim){
   var unit;
   var num  = parseFloat(inp);

   // if there is a unit at the end of the inp string
   //
   if(isNaN(inp)){
      unit = ( inp.match(/(%|px)$/)||["px"] ) [0];
   }

   // if unit is a percentage
   //
   if(unit === '%'){
      num *= elemDim / 100;
   }

   return num;
}

if(document.readyState !== 'loading'){
   _halfdrop.init();
}
else{
   document.addEventListener("DOMContentLoaded", function() {
      _halfdrop.init();
   });
}
