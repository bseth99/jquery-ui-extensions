/*!
 * Copyright (c) 2013 Ben Olson (https://github.com/bseth99/jquery-ui-extensions)
 * jQuery UI Scrollable 1.0.3
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
 */

(function ($) {

   var rootex = /^(?:html)$/i,
       max = Math.max,
       abs = Math.abs,
       round = Math.round,
       rhorizontal = /left|center|right/,
       rvertical = /top|center|bottom/,
       roffset = /[\+\-]\d+(\.[\d]+)?%?/,
       rposition = /^\w+/,
       rpercent = /%$/;

   /**
   * Helpers from jQuery UI Position
   * http://jqueryui.com
   *
   * Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   *
   * http://api.jqueryui.com/position/
   */
   function getOffsets( offsets, width, height ) {
      return [
         parseFloat( offsets[ 0 ] ) * ( rpercent.test( offsets[ 0 ] ) ? width / 100 : 1 ),
         parseFloat( offsets[ 1 ] ) * ( rpercent.test( offsets[ 1 ] ) ? height / 100 : 1 )
      ];
   }

   function parseCss( element, property ) {
      return parseInt( $.css( element, property ), 10 ) || 0;
   }
   /*
   * End jQuery UI Position
   **/

   function trackScrolling( scroller ) {

      var _waiter = null;

      scroller.onscroll = function ( e ) {

            if ( !_waiter ) {

               _waiter = setTimeout(function () {

                  $.each(scroller.watch, function () {

                     this._checkPositioning( e );

                  });

                  _waiter = null;

               }, 300);
            }

         }

      scroller.element.on('scroll', scroller.onscroll);
   }

   var monitor = {

      scrollers: [],

      getScroller: function ( obj ) {

         var scroller;
         for ( var i=0;i<this.scrollers.length;i++ ) {

            if ( this.scrollers[i].element[0] === obj[0] ) {
               scroller = this.scrollers[i];
               break;
            }
         }

         return scroller;
      },

      attach: function ( scroll ) {

         var scroller;

         if ( !( scroller = this.getScroller( scroll.container ) ) ) {
            scroller = { element: scroll.container, watch: [], onscroll: null };
            this.scrollers.push( scroller );
            trackScrolling( scroller );
         }

         scroller.watch.push( scroll );

      },

      detach: function ( scroll ) {

         var scroller;

         if ( ( scroller = this.getScroller( scroll.container ) ) ) {

            for ( var i=0;i<scroller.watch.length;i++ ) {

               if ( scroller.watch[i] === scroll ) {
                  scroller.watch.splice( i, 1 );
                  break;
               }
            }

            if ( scroller.watch.length == 0 ) {
               scroller.element.off( 'scroll', scroller.onscroll );
            }

         }
      }
   }

   $.widget('ui.scrollable', {

      version: "1.0.3",

      widgetEventPrefix: 'scroll',

      options: {
         in: null,
         out: null,
         direction: 'both',
         offset: null
      },

      inView: false,

      _create: function () {

         this.options.offset = this.options.offset || { top: 0, left: 0, bottom: 0, right: 0 };
      },

      _init: function () {

         if ( this.container ) {
            monitor.detach( this );
         }

         this.container = this.element.closest(':scrollable'+( this.direction == 'both' ? '' : '('+this.direction+')'));
         if ( rootex.test(this.container[0].nodeName) ) this.container = $(window);
         monitor.attach( this );

         this._checkPositioning();
      },

      _destroy: function () {
         monitor.detach( this );
         this.container = null;
      },

      _checkPositioning: function( e ) {

         var _inView = this.inView,
             pos = this.position();

         this.inView = pos.inside;

         if ( this.inView ) {
            if ( !_inView ) {
               this._trigger( 'in', e, { container: this.container, element: this.element, position: pos } );
            }
         } else if ( _inView ) {
            this._trigger( 'out', e, { container: this.container, element: this.element, position: pos } );
         }


      },

      position: function() {

         var doc = {
                  top: this.container.scrollTop(),
                  left: this.container.scrollLeft()
               },
             elem = this.element.position(),
             ofs = $.extend({}, this.options.offset),
             width = this.container.width(),
             height = this.container.height(),
             otmp, ret;

         // normalize
         if ( ofs.vertical || ofs.y ) {
            otmp = getOffsets( [0, ofs.vertical || ofs.y], width, height );
            ofs.top = ofs.bottom = otmp[1] / 2;
         }

         if ( ofs.horizontal || ofs.x ) {
            otmp = getOffsets( [ofs.horizontal || ofs.x, 0], width, height );
            ofs.left = ofs.right = otmp[0] / 2;
         }

         otmp = getOffsets( [ofs.left || 0, ofs.top || 0], width, height );
         ofs.left = otmp[0]; ofs.top = otmp[1];

         otmp = getOffsets( [ofs.right || 0, ofs.bottom || 0], width, height );
         ofs.right = otmp[0]; ofs.bottom = otmp[1];

         doc.right = doc.left + width - ofs.right;
         doc.bottom = doc.top + height - ofs.bottom;
         doc.left += ofs.left;
         doc.top += ofs.top;

         elem.right = elem.left + this.element.width();
         elem.bottom = elem.top + this.element.height();

         ret = {
            container: doc,
            element: elem,
            inside: false,
            outside: false,
            left: elem.right < doc.left,
            right: elem.left > doc.right,
            top: elem.bottom < doc.top,
            bottom: elem.top > doc.bottom
         };

         ret.inside = !ret.left && !ret.right && !ret.top && !ret.bottom;
         ret.outside = !ret.inside;

         return ret;
      },

      goto: function ( options ) {

         var options = options || {},
             offsets = {},
             position = this.position(),
             targetWidth = this.container.width(),
             targetHeight = this.container.height(),
             elemWidth = this.element.outerWidth(true),
             elemHeight = this.element.outerHeight(true),
             dir = this.options.direction,
             target = (this.container[0] === window ? $('html') : this.container),
             scroll, atOffset, myOffset;

   /**
   * Adapted from jQuery UI Position
   * http://jqueryui.com
   *
   * Copyright 2013 jQuery Foundation and other contributors
   * Released under the MIT license.
   * http://jquery.org/license
   *
   * http://api.jqueryui.com/position/
   */

         if ( !options.onlyOutside || ( options.onlyOutside && !this.inView ) ) {

            $.each( [ "my", "at" ], function() {
               var pos = ( options[ this ] || "" ).split( " " ),
                  horizontalOffset,
                  verticalOffset;

               if ( pos.length === 1) {
                  pos = rhorizontal.test( pos[ 0 ] ) ?
                     pos.concat( [ "center" ] ) :
                     rvertical.test( pos[ 0 ] ) ?
                        [ "center" ].concat( pos ) :
                        [ "center", "center" ];
               }
               pos[ 0 ] = rhorizontal.test( pos[ 0 ] ) ? pos[ 0 ] : "center";
               pos[ 1 ] = rvertical.test( pos[ 1 ] ) ? pos[ 1 ] : "center";

               // calculate offsets
               horizontalOffset = roffset.exec( pos[ 0 ] );
               verticalOffset = roffset.exec( pos[ 1 ] );
               offsets[ this ] = [
                  horizontalOffset ? horizontalOffset[ 0 ] : 0,
                  verticalOffset ? verticalOffset[ 0 ] : 0
               ];

               // reduce to just the positions without the offsets
               options[ this ] = [
                  rposition.exec( pos[ 0 ] )[ 0 ],
                  rposition.exec( pos[ 1 ] )[ 0 ]
               ];
            });


            if ( options.at[ 0 ] === "right" ) {
               position.element.left -= targetWidth;
            } else if ( options.at[ 0 ] === "center" ) {
               position.element.left -= targetWidth / 2;
            }

            if ( options.at[ 1 ] === "bottom" ) {
               position.element.top -= targetHeight;
            } else if ( options.at[ 1 ] === "center" ) {
               position.element.top -= targetHeight / 2;
            }

            atOffset = getOffsets( offsets.at, targetWidth, targetHeight );
            position.element.left -= atOffset[ 0 ];
            position.element.top -= atOffset[ 1 ];

            myOffset = getOffsets( offsets.my, elemWidth, elemHeight );

            if ( options.my[ 0 ] === "right" ) {
               position.element.left += elemWidth;
            } else if ( options.my[ 0 ] === "center" ) {
               position.element.left += elemWidth / 2;
            }

            if ( options.my[ 1 ] === "bottom" ) {
               position.element.top += elemHeight;
            } else if ( options.my[ 1 ] === "center" ) {
               position.element.top += elemHeight / 2;
            }

            position.element.left -= myOffset[ 0 ];
            position.element.top -= myOffset[ 1 ];

   /*
   * End jQuery UI Position
   **/

            scroll = {};

            if ( dir == 'both' || dir == 'horizontal' )
               scroll.scrollLeft = round(position.element.left)+'px';

            if ( dir == 'both' || dir == 'vertical' )
               scroll.scrollTop = round(position.element.top)+'px';

            target
               .animate( scroll, {
                  duration: options.duration || 'slow',
                  easing: options.easing || 'swing',
                  complete: options.complete
               });

         } else {

            if ( $.isFunction( options.complete ) )
               options.complete.call( this.element );
         }
      }
   });

   /**
   *  Inspired by (and similar to) https://github.com/litera/jquery-scrollintoview
   *
   */
   $.expr[":"].scrollable = $.expr.createPseudo(function( dir ) {

      var dir = (!dir || dir == 'undefined' ? 'both' : dir);

      return function( elem ) {

         var $el = $(elem),
             isRoot = rootex.test(elem.nodeName),
             styles = $el.css(['overflow-x', 'overflow-y']),
             overflow = {
                   x: (styles['overflow-x'] == 'auto' || styles['overflow-x'] == 'scroll'),
                   y: (styles['overflow-y'] == 'auto' || styles['overflow-y'] == 'scroll')
                },
             test = false;

         if ( !isRoot && !overflow.x && !overflow.y ) {

            return false;
         }

         if ( dir == 'both' || dir == 'vertical' )
            test = test || ( overflow.x || isRoot ) && elem.scrollWidth > elem.clientWidth;

         if ( dir == 'both' || dir == 'horizontal' )
            test = test || ( overflow.y || isRoot ) && elem.scrollHeight > elem.clientHeight;

         return test;
      }
   });


   /**
   * Fix scrolling animations on html/body
   * https://github.com/balupton/jquery-scrollto
   *
   */

   $.propHooks.scrollTop = $.propHooks.scrollLeft = {
      get: function(elem,prop) {
         var result = null;
         if ( elem.tagName === 'HTML' || elem.tagName === 'BODY' ) {
            if ( prop === 'scrollLeft' ) {
               result = window.scrollX;
            } else if ( prop === 'scrollTop' ) {
               result = window.scrollY;
            }
         }
         if ( result == null ) {
            result = elem[prop];
         }
         return result;
      }
   };

   $.Tween.propHooks.scrollTop = $.Tween.propHooks.scrollLeft = {
      get: function(tween) {
         return $.propHooks.scrollTop.get(tween.elem, tween.prop);
      },
      set: function(tween) {
         // Our safari fix
         if ( tween.elem.tagName === 'HTML' || tween.elem.tagName === 'BODY' ) {
            // Defaults
            tween.options.bodyScrollLeft = (tween.options.bodyScrollLeft || window.scrollX);
            tween.options.bodyScrollTop = (tween.options.bodyScrollTop || window.scrollY);

            // Apply
            if ( tween.prop === 'scrollLeft' ) {
               tween.options.bodyScrollLeft = Math.round(tween.now);
            }
            else if ( tween.prop === 'scrollTop' ) {
               tween.options.bodyScrollTop = Math.round(tween.now);
            }

            // Apply
            window.scrollTo(tween.options.bodyScrollLeft, tween.options.bodyScrollTop);
         }
         // jQuery's IE8 Fix
         else if ( tween.elem.nodeType && tween.elem.parentNode ) {
            tween.elem[ tween.prop ] = tween.now;
         }
      }
   };

})(jQuery);