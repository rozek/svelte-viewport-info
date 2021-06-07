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
