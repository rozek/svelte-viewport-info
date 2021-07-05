//----------------------------------------------------------------------------//
//                            Svelte Viewport Info                            //
//----------------------------------------------------------------------------//
var MediaMatcher = (window.matchMedia ||
    // @ts-ignore
    window['webkitMatchmedia'] || window['mozMatchmedia'] || window['oMatchmedia']);
function MediaQuery(query) {
    return (MediaMatcher != null) && MediaMatcher(query).matches;
}
function DocumentIsReady() {
    return ((document.readyState === 'interactive') ||
        (document.readyState === 'complete'));
}
/**** determineViewportSize ****/
// Internet Explorer and MS/Edge are NOT supported
var ViewportWidth = 0; // given in px, explicit initialization...
var ViewportHeight = 0; // ...is needed to satisfy the compiler
function determineViewportSize() {
    ViewportWidth = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    ViewportHeight = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
}
// see https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
determineViewportSize();
var ScreenOrientation = undefined;
var detailledScreenOrientation = undefined;
// explicit initialization is needed to satisfy compiler
function determineScreenOrientation() {
    var Orientation;
    if ('orientation' in window.Screen) {
        Orientation = window.screen.orientation.type;
    }
    switch (Orientation) {
        case 'portrait-primary':
        case 'portrait-secondary':
            ScreenOrientation = 'portrait';
            detailledScreenOrientation = Orientation;
            break;
        case 'landscape-primary':
        case 'landscape-secondary':
            ScreenOrientation = 'landscape';
            detailledScreenOrientation = Orientation;
            break;
        default:
            switch (true) {
                case MediaQuery('(orientation:portrait)'):
                    ScreenOrientation = 'portrait';
                    break;
                case MediaQuery('(orientation:landscape)'):
                case ViewportWidth > ViewportHeight:
                    ScreenOrientation = 'landscape';
                    break;
                default: ScreenOrientation = 'portrait';
            }
            detailledScreenOrientation = undefined;
    }
    if (DocumentIsReady()) {
        document.body.classList.remove('Portrait', 'Landscape', 'Portrait-primary', 'Portrait-secondary', 'Landscape-primary', 'Landscape-secondary');
        switch (ScreenOrientation) {
            case 'portrait':
                document.body.classList.add('Portrait');
                break;
            case 'landscape':
                document.body.classList.add('Landscape');
                break;
        }
        if (detailledScreenOrientation != null) {
            var capitalized = function (Name) { return Name[0].toUpperCase() + Name.slice(1); };
            document.body.classList.add(capitalized(detailledScreenOrientation));
        }
    }
}
determineScreenOrientation();
if (!DocumentIsReady()) {
    window.addEventListener('DOMContentLoaded', determineScreenOrientation);
} // after document is loaded, classes will be applied as foreseen
/**** handle problem that "orientationchange" is fired too soon ****/
var oldViewportWidth = ViewportWidth;
var oldViewportHeight = ViewportHeight;
var oldScreenOrientation = ScreenOrientation;
var oldDetailledScreenOrientation = detailledScreenOrientation;
function rememberSettings() {
    oldViewportWidth = ViewportWidth;
    oldViewportHeight = ViewportHeight;
    oldScreenOrientation = ScreenOrientation;
    oldDetailledScreenOrientation = detailledScreenOrientation;
}
function submitEvents() {
    if (!DocumentIsReady()) {
        return;
    }
    if ((oldViewportWidth !== ViewportWidth) || (oldViewportHeight !== ViewportHeight)) {
        document.body.dispatchEvent(new Event('viewportchanged', { bubbles: true, cancelable: true }));
    }
    if ((oldScreenOrientation !== ScreenOrientation) ||
        (oldDetailledScreenOrientation !== detailledScreenOrientation)) {
        document.body.dispatchEvent(new Event('orientationchangeend', { bubbles: true, cancelable: true }));
    }
}
var Poller; // right now, it's difficult to determine the proper type
var PollCounter = 0;
var PollCounterLimit = 10; // i.e., stop polling after 1000ms
function stopPolling() {
    clearInterval(Poller);
    Poller = undefined;
    PollCounter = 0;
}
function pollForViewportAfterOrientationChange() {
    Poller = setInterval(function () {
        determineViewportSize();
        if ( // no update of screen size yet? => continue polling
        (oldViewportWidth === ViewportWidth) &&
            (oldViewportHeight === ViewportHeight)) {
            PollCounter += 1;
            if (PollCounter <= PollCounterLimit) {
                return;
            }
        } // nota bene: sometimes viewport does not change (e.g., in iframe)
        stopPolling();
        determineScreenOrientation(); // uses ViewportWidth/Height as fallback
        submitEvents();
        rememberSettings();
    }, 100);
}
/**** handler for "orientationchange" event ****/
function determineViewportSizeAndScreenOrientation() {
    determineViewportSize();
    determineScreenOrientation(); // uses screen_width/height as final fallback
    if (Poller != null) { // we are still polling because of former event
        stopPolling();
        submitEvents();
        rememberSettings();
    }
    if ((oldViewportWidth === ViewportWidth) &&
        (oldViewportHeight === ViewportHeight)) { // screen size did not (yet) change => start polling for change
        pollForViewportAfterOrientationChange();
    }
    else { // viewport size changed in time => do not poll
        submitEvents();
        rememberSettings();
    }
}
// see https://github.com/gajus/orientationchangeend
/**** update on changes ****/
window.addEventListener('orientationchange', function () {
    setTimeout(determineViewportSizeAndScreenOrientation, 10);
}); // seen on iOS 12: "orientationchange" fired before orientation is updated
window.addEventListener('resize', determineViewportSizeAndScreenOrientation);
if ('orientation' in screen) {
    screen.orientation.addEventListener('change', function () {
        setTimeout(determineViewportSizeAndScreenOrientation, 10);
    });
}
var svelteViewportInfo = {
    get Width() { return ViewportWidth; },
    get Height() { return ViewportHeight; },
    get Orientation() { return ScreenOrientation; },
    get detailledOrientation() { return detailledScreenOrientation; },
};

export default svelteViewportInfo;
//# sourceMappingURL=svelte-viewport-info.esm.js.map
