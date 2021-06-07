  let MediaMatcher = (
    window.matchMedia ||
// @ts-ignore
    window['webkitMatchmedia'] || window['mozMatchmedia'] || window['oMatchmedia']
  )

  function MediaQuery (query:string):boolean {
    return (MediaMatcher != null) && MediaMatcher(query).matches
  }

  /**** determineViewportSize ****/
  // Internet Explorer and MS/Edge are NOT supported

    let ViewportWidth:number  = 0     // given in px, explicit initialization...
    let ViewportHeight:number = 0        // ...is needed to satisfy the compiler

    function determineViewportSize ():void {
      ViewportWidth = Math.max(
        document.documentElement.clientWidth  || 0, window.innerWidth  || 0
      )
      ViewportHeight = Math.max(
        document.documentElement.clientHeight || 0, window.innerHeight || 0
      )
    }
    // see https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript

    determineViewportSize()
  /**** determineScreenOrientation ****/

    let ScreenOrientation:'portrait'|'landscape'
    let detailledScreenOrientation:'portrait-primary'|'portrait-secondary'|'landscape-primary'|'landscape-secondary'|undefined

    function determineScreenOrientation ():void {
      let Orientation
        if ('orientation' in window.Screen) {
          Orientation = window.screen.orientation.type
        }
      switch (Orientation) {
        case 'portrait-primary':
        case 'portrait-secondary':
          ScreenOrientation          = 'portrait'
          detailledScreenOrientation = Orientation
          break
        case 'landscape-primary':
        case 'landscape-secondary':
          ScreenOrientation          = 'landscape'
          detailledScreenOrientation = Orientation
          break
        default:
          switch (true) {
            case MediaQuery('(orientation:portrait)'):  ScreenOrientation = 'portrait';  break
            case MediaQuery('(orientation:landscape)'):
            case ViewportWidth > ViewportHeight:        ScreenOrientation = 'landscape'; break
            default:                                    ScreenOrientation = 'portrait'
          }
          detailledScreenOrientation = undefined
      }

      document.body.classList.remove(
        'Portrait','Landscape','Portrait-primary','Portrait-secondary',
        'Landscape-primary','Landscape-secondary'
      )

      switch (ScreenOrientation) {
        case 'portrait':  document.body.classList.add('Portrait');  break
        case 'landscape': document.body.classList.add('Landscape'); break
      }
      if (detailledScreenOrientation != null) {
        const capitalized = (Name:string) => Name[0].toUpperCase() + Name.slice(1)
        document.body.classList.add(capitalized(detailledScreenOrientation))
      }
    }

    determineScreenOrientation()                   // uses viewport_width/height

  /**** handle problem that "orientationchange" is fired too soon ****/

    let oldViewportWidth  = ViewportWidth
    let oldViewportHeight = ViewportHeight

    function rememberSettings ():void {
      oldViewportWidth  = ViewportWidth
      oldViewportHeight = ViewportHeight
    }

    function submitEvents ():void {
      document.body.dispatchEvent(
        new Event('viewportchanged', { bubbles:true, cancelable:true })
      )
      document.body.dispatchEvent(
        new Event('orientationchangeend', { bubbles:true, cancelable:true })
      )
    }

    let   Poller:any   // right now, it's difficult to determine the proper type
    let   PollCounter      = 0
    const PollCounterLimit = 10               // i.e., stop polling after 1000ms

    function stopPolling ():void {
      clearInterval(Poller)

      Poller      = undefined
      PollCounter = 0
    }

    function pollForViewportAfterOrientationChange ():void {
      Poller = setInterval(function () {
        determineViewportSize()
        if (                // no update of screen size yet? => continue polling
          (oldViewportWidth  === ViewportWidth) &&
          (oldViewportHeight === ViewportHeight)
        ) {
          PollCounter += 1
          if (PollCounter <= PollCounterLimit) { return }
        }     // nota bene: sometimes viewport does not change (e.g., in iframe)

        stopPolling()

        determineScreenOrientation()   // uses viewport_width/height as fallback
        rememberSettings()
        submitEvents()
      }, 100)
    }

  /**** handler for "orientationchange" event ****/

    function determineViewportSizeAndScreenOrientation ():void {
      determineViewportSize()
      determineScreenOrientation() // uses screen_width/height as final fallback

      if (Poller != null) {      // we are still polling because of former event
        stopPolling()
        rememberSettings()
        submitEvents()
      }

      if (
        (oldViewportWidth  === ViewportWidth) &&
        (oldViewportHeight === ViewportHeight)
      ) {        // screen size did not (yet) change => start polling for change
        pollForViewportAfterOrientationChange()
      } else {                   // viewport size changed in time => do not poll
        rememberSettings()
        submitEvents()
      }
    }
  // see https://github.com/gajus/orientationchangeend

  /**** update on changes ****/

    window.addEventListener('orientationchange', function () {
      setTimeout(determineViewportSizeAndScreenOrientation,10)
    })// seen on iOS 12: "orientationchange" fired before orientation is updated

    window.addEventListener('resize', determineViewportSizeAndScreenOrientation)

  export default {
    get Width ()  { return ViewportWidth },
    get Height () { return ViewportHeight },

    get Orientation () { return ScreenOrientation },
  }

