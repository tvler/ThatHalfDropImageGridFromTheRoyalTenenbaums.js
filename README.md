# That Half-Drop Image Grid From <br> The Royal Tenenbaums <br> . JavaScript

###[Download](ThatHalfDropImageGridFromTheRoyalTenenbaums.js) ([minified](ThatHalfDropImageGridFromTheRoyalTenenbaums.min.js))
#### View [webpage](http://tylerdeitz.co/ThatHalfDropImageGridFromTheRoyalTenenbaums.js), [more samples](http://tylerdeitz.co/ThatHalfDropImageGridFromTheRoyalTenenbaums.js/samples)

![offset grid example](img/wes1-offsetexample.jpg)

A brand-new JavaScript file for repeating an HTML element's background image in a half-drop pattern with a vertically and horizontally centered image, like that thing from that movie. Each pattern is extensively customizable through JSON data attributes, with properties based off CSS naming standards.

## 3 Ways To Use
##### 1. HTML + inline URL
```html
<figure
  data-halfdrop = 'wes1.jpg'
></figure>
```
##### 2. HTML + CSS URL

```css
figure{
  background:url('wes1.jpg')
}
```
```html
<figure
  data-halfdrop
></figure>
```
##### 3. HTML + JSON
```html
<figure
  data-halfdrop = '{
    "src"      : "wes1.jpg",
    "width"    : "20%",
    "maxWidth" : 200
  }'
></figure>
```
*Default values*
```javascript
_halfdrop.defaultValues = {
  "src"       : "",
  // String of the image's URL
  // (If not given, CSS URL will be used)

  "snap"      : false,
  // Changes width of image to create a whole number of columns, only respecting one min/max property

  "minWidth"  : 0,
  "maxWidth"  : "100%",
  "width"     : 0,
  "minHeight" : 0,
  "maxHeight" : "100%",
  "height"    : 0
  // Can be a number or string ending in 'px' or '%'
}
```

##2 Steps To Run
##### 1. Link the javascript file
```html
<script
  src="ThatHalfDropImageGridFromTheRoyalTenenbaums.js"
></script>
```
*This creates the object ```_halfdrop```*
##### 2. Set an event to update the background
```javascript
_halfdrop.update()
// When a data-halfdrop element resizes, it's background needs to update
```

*Example hook*
```javascript
window.onresize =
  _halfdrop.update;
```

##Settings
##### 1. Add or remove ```data-halfdrop``` elements
```javascript
_halfdrop.init()
// Run this function after an element is added or removed
```

##### 2. Change [default values](#3-html--json)
```javascript
_halfdrop.defaultValues
// The exposed object's properties can be modified, which may reduce overall markup in some situations
// If it's modified after DOMContentLoaded, run _halfdrop.init()
```
