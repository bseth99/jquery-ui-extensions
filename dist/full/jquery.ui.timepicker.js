/*@preserve
 * Copyright (c) 2013-2014 Ben Olson (https://github.com/bseth99/jquery-ui-extensions)
 * jQuery UI TimePicker 0.1.1
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
 *  jquery.ui.spinner.js
 */

(function ($) {
   "use strict";

    var _base_stop = $.ui.spinner.prototype._stop;
    $.ui.spinner.prototype._stop = function( event ) {

         var value = this.value() || 0;

         if (event && event.type == 'keyup' && value != this._adjustValue(value) ) {
            this.value(this.previous);
            this._trigger( "invalid", event );
         } else {
            this.previous=value;
            this.element.val(this._format(value));
         }

         _base_stop.call( this, event );
      }

    $.widget( "ui.paddedspinner", $.ui.spinner, {
        widgetEventPrefix: "spin",
        options: {
           padCount: 2,
           padString: '0'
        },

        _parse: function( value ) {
            return +value;
        },

        _format: function( value ) {
            var str = value+'';
            while ( str.length < this.options.padCount )
               str = this.options.padString + str;
            return str;
        },

    });

    $.widget( "ui.ampmspinner", $.ui.spinner, {
        widgetEventPrefix: "spin",
        options: {
           max: 1,
           min: 0,
           alignment: 'vertical'
        },

        _parse: function( value ) {

            if ( typeof value === "string" ) {
                return value == 'AM' ? 0 : 1;
            }
            return value;
        },

        _format: function( value ) {
            return value === 0 ? 'AM' : 'PM';
        },

    });

   $.widget('osb.timepicker', {

      version: "1.1.0",

      widgetEventPrefix: 'timepicker',

      options: {
         // format: 'hh:mm'
      },

      _init: function () {

         var self = this,
             html = '<input class="ui-timepicker-hour"/><span style="font-size: 1.4em">:</span><input class="ui-timepicker-minute"/> <input class="ui-timepicker-ampm"/>';

         this.element.empty().html( html );

         this.$hour = this.element.children( '.ui-timepicker-hour' ).paddedspinner({
            alignment: 'vertical',
            min: 0,
            max: 13,
            spin: function( e, ui ) {

               var ampm,
                   val = +ui.value;

               if ( val == 0 || val == 13 ) {

                  if ( val == 0 ) self.$hour.paddedspinner( 'value', 12 );
                  if ( val == 13 ) self.$hour.paddedspinner( 'value', 1 );

                  ampm = self.$ampm.ampmspinner( 'value' );
                  self.$ampm.ampmspinner( 'value', ampm == 0 ? 1 : 0 );

                  self._trigger( 'change', self._value() );

                  return false;
               }

               self._trigger( 'change', self._value() );
            },
            stop: function() {

               var val = +self.$hour.val();

               if ( val == 0 || val == 13 ) {
                  self.$hour.val('')
               }

               self._ensureValue();
            }
         });

         this.$minute = this.element.children( '.ui-timepicker-minute' ).paddedspinner({
            alignment: 'vertical',
            min: -1,
            max: 60,
            spin: function( e, ui ) {

               var hour, val = +ui.value;

               if ( val == -1 || val == 60 ) {

                  if ( val == -1 ) self.$minute.paddedspinner( 'value', 59 );
                  if ( val == 60 ) self.$minute.paddedspinner( 'value', 0 );

                  hour = self.$hour.paddedspinner( 'value' );
                  hour = val == -1 ? hour -1 : hour + 1;
                  self.$hour
                     .paddedspinner( 'value', hour )
                     .data( 'ui-paddedspinner' )._trigger( 'spin', e, { value: hour } );

                  self._trigger( 'change', self._value() );

                  return false;
               }

               self._trigger( 'change', self._value() );
            },
            stop: function() {

               var val = +self.$minute.val();

               if ( val == -1 || val == 60 ) {
                  self.$hour.val('');
               }

               self._ensureValue();

            }
         });

         this.$ampm = this.element.children( '.ui-timepicker-ampm' ).ampmspinner({
            spin: function() {

               self._trigger( 'change', self._value() );
               self._ensureValue();
            }
         });

         this._on( this._events );
      },

      _events: {

         'click input': function( e ) {

            var $target = $( e.currentTarget );

            $target.select();
         }
      },

      _destroy: function () {
         this.element.empty();
      },

      _value: function() {
         var hour = this.$hour.val(),
             min = this.$minute.val(),
             ampm = this.$ampm.val();

         return hour + ':' + min + ' ' + ampm;
      },

      _parse: function( val ) {
         var parts = val.split( /[: ]/ ),
             hour, min, ampm;

         if ( parts.length < 2 ) return;

         hour = parts[0];
         min = parts[1];
         ampm = parts[2];

         this.$hour.paddedspinner( 'value', +hour );
         this.$minute.paddedspinner( 'value', +min );
         this.$ampm.ampmspinner( 'value', ampm == 'AM' ? 0 : 1 );

      },

      _ensureValue: function() {
         var dt = new Date(),
             hour = this.$hour.val(),
             min = this.$minute.val(),
             ampm = this.$ampm.val();

         if ( !hour ) this.$hour.paddedspinner( 'value', ( hour = dt.getHours() ) > 12 ? hour - 12 : hour );
         if ( !min ) this.$minute.paddedspinner( 'value',  dt.getMinutes() );
         if ( !ampm ) this.$ampm.ampmspinner( 'value',  dt.getHours() > 12 ? 'PM' : 'AM' );
      },

      value: function( val ) {

         if ( typeof( val ) == 'undefined' )
            return this._value();
         else
            this._parse( val );

      }

   });

})(jQuery);