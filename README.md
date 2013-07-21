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
   
- **Scrollable**: Moved to [bseth99/jquery-ui-scrollable](https://github.com/bseth99/jquery-ui-scrollable)

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


## Demo

I created some [tests](http://bseth99.github.com/jquery-ui-extensions/tests/visual/index.html) that
show what the widgets can do.  


## License

Copyright (c) 2012 Ben Olson
Licensed under the MIT License
