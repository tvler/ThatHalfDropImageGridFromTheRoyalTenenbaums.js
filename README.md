# ThatOffsetImageGridFromTheRoyalTenenbaums.js

A brand-new javascript file for repeating an HTML element's background image in a manner such that there will always be a vertically and horizontally centered image, and adjacent columns will be vertically offset by exactly one-half of the image's height.

### [View webpage](http://tylerdeitz.co/ThatOffsetImageGridFromTheRoyalTenenbaums.js)

## 3 Ways To Use
1. HTML + inline URL
```html
<figure
  data-offset = 'wes1.jpg'
></figure>
```
2. HTML + CSS URL

 ```css
 figure{
  background:url('wes1.jpg')
}
```
```html
<figure
  data-offset
></figure>
```
3. HTML + JSON
```html
<figure
  data-offset = '{
    "src"      : "wes1.jpg",
    "width"    : "20%",
    "maxWidth" : 200
  }'
></figure>
```
### Default values
```javascript
{
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
