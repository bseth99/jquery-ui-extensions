/*!
 * Copyright (c) 2013 Ben Olson (https://github.com/bseth99/jquery-ui-extensions)
 * jQuery UI WaitButton 1.1.1
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
 */
 (function ( $, undefined ) {
    $.widget( "ui.waitbutton", $.ui.button, {

       version: "1.1.1",

       // Keep button prefix instead of waitbutton
       // otherwise waiting event is waitbuttonwaiting
       // which is weird.
       widgetEventPrefix: "button",

       options: {
          waitLabel: null,
          waitIcon: 'ui-icon-waiting'
       },

       _saved: null,

       _create: function() {

          this._super();

          this.element.addClass('ui-wait-button');
          this._saved = {};

          this._saveOptions();

       },

       _init: function() {

          this._super();

          this.disable();
          this._toggleWaitState();
          this._initWaitClick();

       },

       _initWaitClick: function() {

          /**
          *   channel clicks through waiting event instead
          *   base button does not listen to click -
          *   it listens to mousedown/up.  This prevents any external
          *   listeners from firing when we want to use the callback
          *   provided by the waiting event.
          */
          this.element.off( 'click' );

          this.element.one( 'click', $.proxy( this, '_toggleWaitState' ) );
       },

       _toggleWaitState: function() {

          var event;

          if ( this.options.disabled ) {

             this._setOptions({
                disabled: false,
                label: this._saved.label,
                icons: { primary: this._saved.icon }
             });

          } else {

             this._saveOptions();

             this._setOptions({
                disabled: true,
                label: this.options.waitLabel || this.options.label,
                icons: { primary: this.options.waitIcon }
             });

             event = arguments[0] || (new jQuery.Event( 'click', { target: this.element } ) );

             /* channel clicks through waiting event instead */
             event.preventDefault();
             event.stopPropagation();
             event.stopImmediatePropagation();

             this._trigger( 'waiting', event, { done: $.proxy( this, '_waitComplete' ) } );
          }

       },

       _waitComplete: function() {

          // Juggle arguments
          var label = (arguments[0] && typeof( arguments[0] ) == 'string' ? arguments[0] : null),
              enable = (label ? arguments[1] : arguments[0]);

          // Determine next state - either return to start or
          // use a different label and/or leave in disabled state

          if ( typeof( enable ) == 'undefined' ) enable = true;

          this._toggleWaitState();
          if ( enable ) {
             this._initWaitClick();
          } else {
             this.disable();
          }

          if ( label ) {
             this._setOption( 'label', label );
          }
       },

       _saveOptions: function() {

          this._saved.icon = this.options.icons.primary;
          this._saved.label = this.options.label;

       }

    });

})(jQuery);
