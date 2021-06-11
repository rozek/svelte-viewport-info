# svelte-viewport-info #

informs about viewport size and orientation

**NPM users**: please consider the [Github README](https://github.com/rozek/svelte-viewport-info/blob/main/README.md) for the latest description of this package (as updating the docs would otherwise always require a new NPM package version)

### Installation ###

```
npm install svelte-viewport-info
```

### Usage ###

```
<script>
  import Viewport from 'svelte-viewport-info'

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

### Example ###

An example is available on the Svelte REPL - feel free to play with it!

* [svelte-viewport-info](https://svelte.dev/repl/84ad979c06e84c5e8a98933554ab49c6)

### Background Information ###

This package determines the current viewport size and device (or viewport) orientation. In addition, it listens to the events sent when these values change and informs Svelte about such changes. The idea behind this approach is to normalize the behaviour of various platforms and browsers.

The package's finding may either be retrieved using JavaScript or by styling a few CSS classes which are added to or removed from the document body depending on the current viewport `Orientation` or `detailledOrientation`.

#### JavaScript API ####

This package offers a JavaScript `default` export, which may be imported as follows

  `import Viewport from 'svelte-viewport-info'`

With such an import, the JavaScript API can be used as follows:

* `Viewport.Width` - retrieves the current viewport width in pixels. If the actual viewport size can not be determined, the inner width of the current browser window is used instead
* `Viewport.Height` - retrieves the current viewport height in pixels. If the actual viewport size can not be determined, the inner height of the current browser window is used instead<br>&nbsp;<br>
* `Orientation` - retrieves the current device orientation. At first, a "media query" is attempted - if that does not work, the orientation is determined from the relation between viewport width and height. Possible results are:
  * `portrait` - the device is in a "Portrait" orientation
  * `landscape` - the device is in a "Landscape" orientation
* `detailledOrientation` - informs about which (of the two possible) "Portrait" or "Landscape" orientations is actually active (if available). Possible results are:
  * `portrait-primary` - the device is in its "primary" "Portrait" orientation (usually upright)
  * `portrait-secondary` - the device is in its "secondary" "Portrait" orientation (usually upside down)
  * `landscape-primary` - the device is in its "primary" "Landscape" orientation (usually turned right from primary Portrait orientation)
  * `landscape-secondary` - the device is in its "secondary" "Landscape" orientation (usually turned left from primary Portrait orientation)
  * undefined - no detail available

#### Events ####

Whenever viewport size and/or device orientation change, this package emits the following events:

* `viewportchanged` - viewport size has changed
* `orientationchangeend` - device orientation has changed

These events may easily be caught as follows

```
<svelte:body
  on:viewportchanged={...}
  on:orientationchangeend={...}
/>
```

### CSS Classes ###

In addition, the package also adds or removes the following CSS classes depending on the current device orientation:

* `Portrait` - indicates that the device is currently in any "Portrait" orientation
* `Landscape` - indicates that the device is currently in any "Landscape" orientation
* `Portrait-primary` - indicates that the device is currently in its primary "Portrait" orientation
* `Portrait-secondary` - indicates that the device is currently in its secondary "Portrait" orientation
* `Landscape-primary` - indicates that the device is currently in its primary "Landscape" orientation
* `Landscape-secondary` - indicates that the device is currently in its secondary "Landscape" orientation

Any of the listed CSS classes is set only if the package can actually recognize the corresponding orientation - otherwise, it is missing.
