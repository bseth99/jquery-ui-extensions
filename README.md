jQuery UI Extensions
====================

This my collection of customizations and enhancements to the standard jQuery UI library.  So far, this
includes:

- **Spinner**: Add ```alignment``` to the available options to create four different alternative 
   layouts for the spin buttons.
   
- **SlideSpinner**: Adds a Slider control to the Spinner to enable visual reference to where
   a user is in the valid range and a faster way to change values.
   
- **LabeledSlider**: Adds tick marks at configurable intervals to the Slider control.  Optional text labels
   can also be passed to the widget.

- **ComboBox**: Enhances the demo provided on the [jQueryUI site](http://jqueryui.com/autocomplete/#combobox) 
   by adding a value function and some addtional features.
   
- **WaitButton**: Extends the default jQueryUI Button widget by adding a spinner and disabling the
   button when its clicked.  Prevents multiple clicking and provides visual feedback that something
   is happening.
   
- **Scrollable**: Enables monitoring whether an element is scrolled into the visible viewport.  Includes support
   to determine where the element is relative to the viewport and to scroll the elemement into view.

## Usage

Either download the
[Minified](https://raw.github.com/bseth99/jquery-ui-extensions/master/dist/ext-jquery-ui.min.js) or the 
[Full](https://raw.github.com/bseth99/jquery-ui-extensions/master/dist/ext-jquery-ui.js) source and add it
after the normal jQuery UI scripts.

Also download the [CSS](https://raw.github.com/bseth99/jquery-ui-extensions/master/dist/ext-jquery-ui.css)
file and include it after any jQuery UI CSS files.

You can also just browse the source and grab what you want to use.  Just be mindful of the dependencies:

- **SlideSpinner**: Requires the enhanced Spinner control

### WaitButton

WaitButton adds two options that enable controling the label and icon used to show the waiting status:

      $('#save')
         .waitbutton({ 
            waitLabel: 'Saving ...',
            waitIcon: 'my-icon-class'
         })
         
Neither are required to use the widget.  When omitted, the label will remain the same as the current label and
the class used for the primary icon will be the default ui-icon-waiting class which expects a GIF named 
waitbutton-loading.gif to be present in a images folder relative to the CSS file.  You can use the [one I have
created](https://raw.github.com/bseth99/jquery-ui-extensions/master/dist/images/waitbutton-loading.gif)
or design your own.  Just be aware that the ui-icon class on the button widget a lot 16x16 pixels for
the icon.

The widget triggers a ```waiting``` event when a user clicks the button.  An object is passed to the handler with
a callback that should be called once the action is complete.  Failure to call the callback will result in the
button remaining in the waiting state.

      $('#save')
         .waitbutton({ 
            waiting: function ( e, ui ) {
               
               // do something
               ui.done();
            }
         })
         
or

      $('#save')
         .waitbutton()
         .on( 'buttonwaiting',  function ( e, ui ) {
               
               // do something
               ui.done();
            }
         })    
      
The ```done()``` callback takes up to two option arguments that control the new label and state of the button.
Review the [demo](http://bseth99.github.io/jquery-ui-extensions/tests/visual/waitbutton/base.html) for examples of each variation.


### Scrollable

This widget enables monitoring, querying, or changing the scroll position of an element relative to a scrolling 
container.  A scrolling element is either the window or an element with the ````overflow```` style set to
````auto```` or ````scroll````

      $('#myelement').scrollable()
      
This will add myelement to the list of elements being monitored for their scroll position.  If the element scrolls into 
the visible viewport defined by its container, then an ````in```` event is triggered.  When it scrolls out, an
````out```` event is triggered.  Each event is triggered only one time when an element moves in and out of view.

#### Options

````direction```` - Determines if monitoring/positioning will occur for either ````both````, ````vertical```` only, or
````horizontal```` only.  Defaults to ````both````.  

      $('#myelement').scrollable({ direction: 'vertical' });
    

````offset```` - Adjust the logical size of the container such that the detection compares to a different
sized box than the physical one displayed in the browser.  Accepts pixels and percentages.
Positive value shrink the box while negative expand it.

      $('#myelement').scrollable({ offset: { left: '40%', top: '40%' } });
      
See the [example](http://bseth99.github.io/jquery-ui-extensions/tests/visual/scrollable/offset.html) to see how it works.      

#### Methods

````position```` - returns an object hash describing the state of the element relative to the scrolling container's
visible viewport:

- ````container```` [jQuery] - The scrolling parent container of the target element
- ````element```` [jQuery] - The target element
- ````position```` [Object] - A hash of dimensions and information regarding the state of the element relative to
the container.
   - ````container```` [Object] - The normalized (after applying ````offset````) left/right/top/bottom points of
the container element.
   - ````element```` [Object] - The left/right/top/bottom points of the target element.
   - ````inside```` [Boolean] - Is the element inside the defined visible viewport.
   - ````outside```` [Boolean] - Is the element outside the defined visible viewport.
   - ````left```` [Boolean] - Is the element left of the defined visible viewport.
   - ````right```` [Boolean] - Is the element right of the defined visible viewport.
   - ````top```` [Boolean] - Is the element above the defined visible viewport.
   - ````bottom```` [Boolean] - Is the element below the defined visible viewport.

````goto```` - Scrolls the element into the visible viewport.  Uses jQuery.animate to smooth the transistion.
Takes an optional config object with the following options:

- ````onlyOutside```` - Should the element be scrolled if its already in the visible area.
- ````my```` - Determines the final positioning of the target element relative to the container.
- ````at```` - Determines where the element should be positioned relative to the container.  
See the documentation on [jQuery UI Position](http://api.jqueryui.com/position/) for the format of ````my```` and ````at````.
- ````duration```` - Same options as [jQuery.animate()](http://api.jquery.com/animate/)
- ````easing```` - Accepts all the easing options available in [jQuery UI](http://jqueryui.com/effect/#easing)
- ````complete```` - callback function to execute once animation completes

See the [example](http://bseth99.github.io/jquery-ui-extensions/tests/visual/scrollable/goto.html) to experiment
with the positioning options.

#### Events

````in```` - triggered when the element scrolls into the defined viewport.

      $('#myelement').scrollable({ 
         in: function ( e, ui ) {
         
            ...
            
         }
      });
      
or 
      
      $('#myelement').on('scrollin', function ( e, ui ) {

            ...
            
      });

The ````ui```` object contains the same object hash that is returned by the ````position```` method.


````out```` - triggered when the element scrolls out of the defined viewport.  Same parameters and usage as ````in````.


## Demo

I created some [tests](http://bseth99.github.com/jquery-ui-extensions/tests/visual/index.html) that
show what the widgets can do.  


## License

Copyright (c) 2012 Ben Olson
Licensed under the MIT License
