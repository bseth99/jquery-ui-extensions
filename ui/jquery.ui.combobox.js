 /* Copyright Ben Olson (https://github.com/bseth99/jquery-ui-extensions)
 *
 *  Adapted from Jörn Zaefferer original implementation at
 *  http://www.learningjquery.com/2010/06/a-jquery-ui-combobox-under-the-hood
 *
 *  And the demo at
 *  http://jqueryui.com/autocomplete/#combobox
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
 */

(function( $, undefined ) {

   $.widget( "ui.combobox", {

      widgetEventPrefix: "combobox",

      uiCombo: null,
      uiInput: null,

      _create: function() {

         var self = this,
             select = this.element.hide(),
             input, wrapper;

         select.prop('selectedIndex', -1);

         input = this.uiInput =
                  $( "<input />" )
                      .insertAfter(select)
                      .addClass("ui-widget ui-widget-content ui-corner-left ui-combobox-input");

         wrapper = this.uiCombo =
            input.wrap( '<span>' )
               .parent()
               .addClass( 'ui-combobox' )
               .insertAfter( select );

         input
          .autocomplete({

             delay: 0,
             minLength: 0,

             appendTo: wrapper,
             source: function(request, response) {

                var matcher = new RegExp( $.ui.autocomplete.escapeRegex(request.term), 'i' );
                response( select.children('option').map(function() {

                         var text = $( this ).text();

                         if ( this.value && ( !request.term || matcher.test(text) ) ) {

                            return {
                                  label: text.replace(
                                     new RegExp(
                                        "(?![^&;]+;)(?!<[^<>]*)(" +
                                        $.ui.autocomplete.escapeRegex(request.term) +
                                        ")(?![^<>]*>)(?![^&;]+;)", "gi"),
                                        "<strong>$1</strong>"),
                                  value: text,
                                  option: this
                               };
                         }
                     })
                  );
            },

            select: function( event, ui ) {

               ui.item.option.selected = true;
               self._trigger( "select", event, {
                     item: ui.item.option
                  });

            },

            change: function(event, ui) {

               if ( !ui.item ) {

                  var matcher = new RegExp( "^" + $.ui.autocomplete.escapeRegex( $(this).val() ) + "$", "i" ),
                  valid = false;

                  select.children( "option" ).each(function() {
                        if ( this.value.match( matcher ) ) {
                           this.selected = valid = true;
                           return false;
                        }
                     });

                   if ( !valid ) {

                      // remove invalid value, as it didn't match anything
                      $( this ).val( "" );
                      select.prop('selectedIndex', -1);
                      return false;

                   }
               }

               self._trigger( "change", event, {
                     item: ui.item.option
                   });

            },

            open: function ( event, ui ) {

               wrapper.children('.ui-autocomplete')
                  .outerWidth(wrapper.outerWidth(true));
            }

          });

         input.data( "ui-autocomplete" )._renderItem = function( ul, item ) {

               return $( "<li></li>" )
                           .data( "item.autocomplete", item )
                           .append( "<a>" + item.label + "</a>" )
                           .appendTo( ul );

            };

         $( "<button>" )
            .attr( "tabIndex", -1 )
            .attr( "title", "Show All Items" )
            .insertAfter( input )
            .button({
               icons: {
                  primary: "ui-icon-triangle-1-s"
               },
               text: false
            })
            .removeClass( "ui-corner-all" )
            .addClass( "ui-corner-right ui-button-icon ui-combobox-button" )
            .click(function() {
                  // close if already visible
                  if (input.autocomplete("widget").is(":visible")) {
                     input.autocomplete("close");
                     return;
                  }
                  // pass empty string as value to search for, displaying all results
                  input.autocomplete("search", "");
                  input.focus();
               });
      },

      value: function ( newVal ) {
         var select = this.element,
             valid = false,
             selected;

         if ( !arguments.length ) {
            selected = select.children( ":selected" );
            return selected.length > 0 ? selected.val() : null;
         }

         select.prop('selectedIndex', -1);
         select.children('option').each(function() {
               if ( this.value == newVal ) {
                  this.selected = valid = true;
                  return false;
               }
            });

         if ( valid )
            this.uiInput.val(select.children(':selected').text());

      },

      _destroy: function () {
         this.uiCombo.remove();
         this.element.show();
      }

    });


}(jQuery));
