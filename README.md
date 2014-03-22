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
  
- **TimePicker**: Uses several Spinner widgets to allow entering time.  The spinners will automatically
   rollover another time component (ie hours flip from 11 -> 12 so AM -> PM and minutes cause hours to 
   increment/decrement).  [Read this blog post](http://www.benknowscode.com/2014/03/build-time-picker-using-jquery-ui.html)
   for more information.

- **Scrollable**: Moved to [bseth99/jquery-ui-scrollable](https://github.com/bseth99/jquery-ui-scrollable)


[Usage information and demos](http://bseth99.github.io/jquery-ui-extensions/index.html) 


## License

Copyright (c) 2012-2014 Ben Olson  
Licensed under the MIT License
