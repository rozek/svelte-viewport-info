# svelte-viewport-info #

informs about viewport size and orientation (not only in Svelte)

**NPM users**: please consider the [Github README](https://github.com/rozek/svelte-viewport-info/blob/main/README.md) for the latest description of this package (as updating the docs would otherwise always require a new NPM package version)

> Just a small note: if you like this module and plan to use it, consider "starring" this repository (you will find the "Star" button on the top right of this page), so that I know which of my repositories to take most care of.

## Installation ##

`svelte-viewport-info` may be used as an ECMAScript module (ESM), a CommonJS or AMD module or from a global variable.

You may either install the package into your build environment using [NPM](https://docs.npmjs.com/) with the command

```
npm install svelte-viewport-info
```

or load the plain script file directly

```
<script src="https://unpkg.com/svelte-viewport-info"></script>
```

## Access ##

How to access the package depends on the type of module you prefer

* ESM (or Svelte): `import Viewport from 'svelte-viewport-info'`
* CommonJS: `const Viewport = require('svelte-viewport-info')`
* AMD: `require(['svelte-viewport-info'], (Viewport) => {...})`

Alternatively, you may access the global variable `Viewport` directly.

Note for ECMAScript module users: all module functions and values are exported individually, thus allowing your bundler to perform some "tree-shaking" in order to include actually used functions or values (together with their dependencies) only.

## Usage within Svelte ##

For Svelte it is recommended to import the package within a module context:

```
<script context="module">
  import Viewport from 'svelte-viewport-info'
</script>

<script>
  console.log('Viewport Width x Height:     ',Viewport.Width+'x'+Viewport.Height)
  console.log('standard Screen Orientation: ',Viewport.Orientation)
  console.log('detailled Screen Orientation:',Viewport.detailledOrientation)
</script>

<svelte:body
  on:viewportchanged={() => {
    console.log('Viewport Size changed to: ',Viewport.Width+'x'+Viewport.Height)
  }}
  
  on:orientationchangeend={() => { console.log(
    'Screen Orientation changed to: ', Viewport.Orientation + (
      Viewport.detailledOrientation == null
      ? ''
      : '(' + Viewport.detailledOrientation + ')'
    )
  ) }}
/>
```

## Usage as ECMAscript, CommonJS or AMD Module (or as a global Variable) ##

Let's assume that you already "required" or "imported" (or simply loaded) the module according to your local environment. In that case, you may use it as follows:

```
console.log('Viewport Width x Height:     ',Viewport.Width+'x'+Viewport.Height)
console.log('standard Screen Orientation: ',Viewport.Orientation)
console.log('detailled Screen Orientation:',Viewport.detailledOrientation)

function observeViewportAndOrientation () {
  document.body.addEventListener('viewportchanged', () => {
    console.log('Viewport Size changed to: ',Viewport.Width+'x'+Viewport.Height)
  }}
  
  document.body.addEventListener('orientationchangeend', () => { console.log(
    'Screen Orientation changed to: ', Viewport.Orientation + (
      Viewport.detailledOrientation == null
      ? ''
      : '(' + Viewport.detailledOrientation + ')'
    )
  ) }}
}
  
if (
  (document.readyState === 'interactive') ||
  (document.readyState === 'complete')
) {
  observeViewportAndOrientation()
} else {
  window.addEventListener('DOMContentLoaded', observeViewportAndOrientation)
}
```

## Example ##

An example is available on the Svelte REPL - feel free to play with it!

* [svelte-viewport-info](https://svelte.dev/repl/84ad979c06e84c5e8a98933554ab49c6)

## Background Information ##

This package determines the current viewport size and device (or viewport) orientation. In addition, it listens to the events sent when these values change and informs the application about such changes. The idea behind this approach is to normalize the behaviour of various platforms and browsers.

The package's finding may either be retrieved using JavaScript or by styling a few CSS classes which are added to or removed from the document body depending on the current viewport `Orientation` or `detailledOrientation`.

### JavaScript API ###

This package offers a JavaScript `default` export, which may be imported (or `required`) as shown in the "Access" section above.

With such an import, the JavaScript API can be used as follows:

* **`Viewport.Width`** - retrieves the current viewport width in pixels. If the actual viewport size can not be determined, the inner width of the current browser window is used instead
* **`Viewport.Height`** - retrieves the current viewport height in pixels. If the actual viewport size can not be determined, the inner height of the current browser window is used instead<br>&nbsp;<br>
* **`Viewport.Orientation`** - retrieves the current device orientation. At first, a "media query" is attempted - if that does not work, the orientation is determined from the relation between viewport width and height. Possible results are:
  * **`"portrait"`** - the device is in a "Portrait" orientation
  * **`"landscape"`** - the device is in a "Landscape" orientation
* **`Viewport.detailledOrientation`** - informs about which (of the two possible) "Portrait" or "Landscape" orientations is actually active (if available). Possible results are:
  * **`"portrait-primary"`** - the device is in its "primary" "Portrait" orientation (usually upright)
  * **`"portrait-secondary"`** - the device is in its "secondary" "Portrait" orientation (usually upside down)
  * **`"landscape-primary"`** - the device is in its "primary" "Landscape" orientation (usually turned right from primary Portrait orientation)
  * **`"landscape-secondary"`** - the device is in its "secondary" "Landscape" orientation (usually turned left from primary Portrait orientation)
  * **`undefined`** - no detail available

### Events ###

Whenever viewport size and/or device orientation change, this package emits the following events:

* **`viewportchanged`** - viewport size has changed
* **`orientationchangeend`** - device orientation has changed

These events may easily be caught as follows

```
<svelte:body
  on:viewportchanged={...}
  on:orientationchangeend={...}
/>
```

or

```
document.body.addEventListener('viewportchanged',...)
document.body.addEventListener('orientationchangeend',...)
```

## CSS Classes ##

In addition, the package also adds or removes the following CSS classes to and from the document body depending on the current device orientation:

* **`Portrait`** - indicates that the device is currently in any "Portrait" orientation
* **`Landscape`** - indicates that the device is currently in any "Landscape" orientation
* **`Portrait-primary`** - indicates that the device is currently in its primary "Portrait" orientation
* **`Portrait-secondary`** - indicates that the device is currently in its secondary "Portrait" orientation
* **`Landscape-primary`** - indicates that the device is currently in its primary "Landscape" orientation
* **`Landscape-secondary`** - indicates that the device is currently in its secondary "Landscape" orientation

Any of the listed CSS classes is set only if the package actually recognizes the corresponding orientation - otherwise, it is missing.

## Build Instructions ##

You may easily build this package yourself.

Just install [NPM](https://docs.npmjs.com/) according to the instructions for your platform and follow these steps:

1. either clone this repository using [git](https://git-scm.com/) or [download a ZIP archive](https://github.com/rozek/svelte-viewport-info/archive/refs/heads/main.zip) with its contents to your disk and unpack it there 
2. open a shell and navigate to the root directory of this repository
3. run `npm install` in order to install the complete build environment
4. execute `npm run build` to create a new build

You may also look into the author's [build-configuration-study](https://github.com/rozek/build-configuration-study) for a general description of his build environment.

## License ##

[MIT License](LICENSE.md)
