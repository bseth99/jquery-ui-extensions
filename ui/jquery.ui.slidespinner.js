/*!
 * Copyright (c) 2012 Ben Olson (https://github.com/bseth99/jquery-ui-extensions)
 * jQuery UI SlideSpinner @VERSION
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaining a copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without
 * restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following
 * conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 *
 * Depends:
 *  jquery.ui.core.js
 *  jquery.ui.widget.js
 *  jquery.ui.button.js
 *  jquery.ui.spinner.js (bseth99/jquery-ui-extensions customized version)
 */

(function( $ ) {

$.widget( "ui.slidespinner", $.ui.spinner, {

   version: "@VERSION",

   widgetEventPrefix: "slidespinner",

   options: {
      alignment: 'vertical',
      min: 0,
      max: 100,
   },

   _create: function() {

      this.options.min = this.options.min || 0;
      this.options.max = this.options.max || 100;

      if ( this.options.alignment != 'vertical' &&
            this.options.alignment != 'horizontal' ) {
         this.options.alignment = 'vertical';
      }

      this._super();

      this._value( this.element.val() );
      this.uiSlider.slider( 'value', this.value() | 0 );
   },

   _draw: function( ) {

      var self = this,
          options = this.options;

      this._super();

      this.uiWrapper =
         this.uiSpinner
            .wrap( '<span>' )
            .parent()
            .addClass( 'ui-slidespinner' );

      this.uiSlider =
         $('<div>')
            .appendTo( this.uiWrapper )
            .slider({
                  orientation: options.alignment,
                  min: options.min,
                  max: options.max,
                  slide: function (e, ui) {
                     self._value( ui.value );
                  }
               });

      if ( options.alignment == 'vertical' ) {
         this.uiSlider
            .position({ my: 'left+5 top+5', at: 'right top', of: this.uiSpinner })
            .css( 'height', this.uiSpinner.outerHeight(true) - 10 );
      } else {
         this.uiSlider
            .position({ my: 'left+5 top+5', at: 'left bottom', of: this.uiSpinner })
            .css( 'width', this.uiSpinner.outerWidth(true) - 10 );
      }
   },

   _spin: function( step, event ) {

      this._super( step, event );

      this.uiSlider.slider( 'value', this.value() | 0 );
   },

   _stop: function( event ) {

      if ( event.type == 'keyup'  ) {
         this.uiSlider.slider( 'value', this.value() | 0 );
      }

      this._super( event );
  },

   _destroy: function( ) {

      this.uiSlider.remove();
      this.uiSpinner.unwrap();

      this._super();
   }

});

}( jQuery ) );
