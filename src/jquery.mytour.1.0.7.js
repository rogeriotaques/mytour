/**
 * MyTour - jQuery plugin to create an easy virtual tour across any website.  
 * Copyright (c) 2012, Rogério Taques. 
 *
 * Licensed under MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this 
 * software and associated documentation files (the "Software"), to deal in the Software 
 * without restriction, including without limitation the rights to use, copy, modify, merge, 
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons 
 * to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or 
 * substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING 
 * BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND 
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, 
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 * @requires jQuery v1.2 or above
 * @version 1.0
 * @cat Plugins/UI 
 * @author Rogério Taques (rogerio@awin.com.br | http://awin.com.br)
 * @see http://code.google.com/p/jquery-mytour/
 */

/**
 * CHANGELOG
 * 
 * 1.0.7 Start using strict mode.
 * 1.0.6 An enhancement for the highlight of target element.
 * 1.0.5 Supports a new nub position (none)
 * 1.0.4 Enhancements ...
 * 1.0.3 Changes on box layout. Added visual effects and highlight for targets.
 * 1.0.2 Many improovements and minor bugfixes. Runs faster and the user has more control on the steps.
 * 1.0.1 Bugfix when the item is not found. Mytour goes automatcaly to next one.
 * 
 * 1.0 First released version.
 * 
 */

(function($){
	
    "use strict";
    
	var version = '1.0.7',
	
		stepContainer = [],
		stepCurrent = 0,
		tourTrigger = null,
	
		defaults = {
			
			start: 0,					// indicate which step will start tour
			
			buttons: { 					// buttons:
				next: 'Next',			// next step. 
				prev: 'Prev',			// previous step.
				start: 'Start',			// backward to the first set step.
				finish: 'Finish',		// stop presentation.
				menu: true				// show/ hide the dropdown menu with the steps
			},
			
			autoPlay: false, 			// (true/ false) if true, start the tour automaticaly 
			timer: 5000, 				// time elipsed before goes to the next step (if null, then don't goes)
			
			steps: '#my-tour-steps', 	// which objects will contain the steps that will be displayed for the user.
			stepHolder: 'li',			// which tag is used to hold the step content
			
			onStart: null,				// callback method, called when my-tour is started
			onShow: null,				// callback method, called when my-tour is played for the 1st time
			beforePlay: null,			// callback method, called always before play any step
			afterPlay: null,			// callback method, called always after has played any step
			onFinish: null,				// callback method, called when my-tour is finished
			
			debug: false				// (true/false) if set TRUE, log on console each step
			
		},
		
		methods = {
			
			version: function() {
				
				return this.each(function() {
					$(this).html(version);
				});
			
			},
			
			init: function( options ) {
				
				var o = $.extend(defaults, options);
				
				return this.each( function() {
					
					var t = $(this),
						s = $(o.steps+' > '+o.stepHolder),
						tip = $('<div />', { id: "my-tour-tooltip", class: "my-tour-tooltip"}),
						overlay = $('<div />', { id: "my-tour-overlay", class: "my-tour-overlay"}),
						shield  = $('<div />', { id: "my-tour-shield", class: "my-tour-shield"}),
                        i = 0;
					
					s.hide(); // hide the steps holder
					
					// foreach step found, remove it from the page and store it on the container
					for( i in s ) 
					{
						// only store valid steps
						if ($($(s[i]).data('id')).length) 
						{
							stepContainer[stepContainer.length] = $(s[i]).clone();
						}
						
						$(s[i]).remove();
					}
					
					// create a tooltip box and append it on the body
					$('body')
						.append(overlay.hide())
						.append(shield.hide())
						.append(tip.hide());
					
					tip.append( $('<div />', {id:"my-tour-content"}) )
					   .append( $('<span/>', {id:"my-tour-tooltip-nub", class:"my-tour-tooltip-nub"}) )
					   .append( $('<div />', {id:"my-tour-button-bar"}) );
					
					// define the start point
					stepCurrent = parseInt((o.start || 0), 10);
					
					// when start point is out of range ...
					if (stepCurrent > stepContainer.length || stepCurrent < 0) stepCurrent = 0;
					
					// set trigger's action ...
					t.click(function(e) {
						e.preventDefault();
						
						tourTrigger = t;
						
						if (o.onShow && 'function' == typeof(o.onShow)) 
						{
							o.onShow();
						}
						
						_play(o);
					});
					
					if (o.onStart && 'function' == typeof(o.onStart)) 
					{
						o.onStart();
					}
					
					// if the autoplay is set, then start
					if (o.autoPlay) 
					{
						
						if (o.onShow && 'function' == typeof(o.onShow)) 
						{
							o.onShow();
						}
						
						_autoplay(o); 
					}
					
				} );
				
			} // init
			
		}; // methods
	
	function _autoplay( options ) 
	{
		
		if (stepCurrent < stepContainer.length - 1) 
		{
			setTimeout( function() {
				stepCurrent++;
				_autoplay(options);
			}, options.timer );
		}
		
		_play(options);
	} // _autoplay
	
	function _stop(options) 
	{
		stepCurrent = 0;
		
		// visual effects 
		$('#my-tour-tooltip').fadeOut('fast');
		$('#my-tour-overlay, #my-tour-shield').fadeOut('fast');
		$('.my-tour-highlight').removeClass('my-tour-highlight');
		
		// animate to scroll until the element
		// centralize the trigger since it's possible.
		centerWindow  = Math.ceil($(window).height() / 2);
		triggerOffset = Math.ceil(tourTrigger.offset().top - centerWindow);
		
		$("html, body").animate({scrollTop: triggerOffset}, 'fast');
		
		if (options.onFinish && 'function' == typeof(options.onFinish)) 
		{
			options.onFinish();
		}
	}; // _stop
	
	// says when a object has (or is into an object with) fixed position
	function _isFixed( obj )
	{
		if ($(obj).css('position') == 'fixed') return true;
		if (! $(obj).parent().is('body')) return _isFixed($(obj).parent());
		return false;
		
	} // _isFixed

	// the tour itself
	function _play( options ) 
	{
		var o = options,
			tip = $(stepContainer[stepCurrent]),
			tipPos = null,
			nub = null,
			nubDim = null,
			el = null,
			elPos = null,
			elPosIndex = ['bottom', 'top', 'right', 'left', 'none'],
			me = $('#my-tour-tooltip'),
			tipOffset = null,
			centerWindow = null,
			mytop = 0,
			myleft = 0,
			overlay = $('#my-tour-overlay, #my-tour-shield');
		
		// remove any other highlight
		if ( $('.my-tour-highlight').length && $('.my-tour-highlight').data('reset-background') )
		{
			$('.my-tour-highlight').css('background-color', 'inherit');
			$('.my-tour-highlight').removeData('reset-background');
		}
		
		$('.my-tour-highlight').removeClass('my-tour-highlight');
		
		// when there is a callback
		if (o.beforePlay && 'function' == typeof(o.beforePlay)) 
		{
			o.beforePlay(stepCurrent);
		}
		
		if (o.debug) 
		{
			console.log('Current Step: '+(stepCurrent)+' Steps Defined: '+stepContainer.length);
		}
		
		if ( tip.length ) 
		{
			
			el = $(tip.data('id')); // get the element
			
			if ( el.length ) 
			{
				overlay.fadeIn('fast');
				
				me.fadeOut('fast', function(){
				
					// reload the tip content
					me.find('#my-tour-content').empty().append(tip.html());
					
					// reload the button bar
					me.find('#my-tour-button-bar').remove();
					me.append(_button(o));
					
					// define the tooltip postition
					tipPos = (tip.data('position') || 'bottom');
					elPos  = el.offset();
					nub    = me.find('#my-tour-tooltip-nub');
					nubDim = { 
						width: nub.outerWidth() > 0 ? nub.outerWidth() : ( Math.abs( nub.width() )),
						height: nub.outerHeight() > 0 ? nub.outerHeight() : ( Math.abs( nub.height() ))
					};
					
					//
					// avoid shows the tooltip outside browser's work-area
					// if the user has set the wrong side, we fix it ...
					//
					
					//
					// positions are:
					// - none: means that tooltip's nub will be hiden
					// - top: means that tooltip will appear above the target
					// - bottom: means that tooltip will appear below the target
					// - left: means that tooltip will appear on left side of target
					// - right: of course, means that tooltip will appear on right side of target .
					//
					
					if (tipPos == 'none')
					{
						mytop  = ($(window).height() / 2) - (me.outerHeight() / 2);
						myleft = ($(window).width() / 2) - (me.outerWidth() / 2);
					}
					
					else if (tipPos == 'top' || tipPos == 'bottom') 
					{
						mytop = ( tipPos == 'top' ? 
							(elPos.top - me.outerHeight() - (nubDim.height / 3 * 2)) :
							(elPos.top + el.outerHeight() + (nubDim.height / 3 * 2) + parseInt(el.css('margin-bottom'), 10))	
						);
						
						if (tipPos == 'top' && mytop < 0) 
						{
							// if tooltip was placed before the top screen margin, then
							// change tooltip position to bottom side
							mytop  = (elPos.top + el.outerHeight() + (nubDim.height / 3 * 2) + parseInt(el.css('margin-bottom'), 10));
							tipPos = 'bottom';
							
						} 
						else if (tipPos == 'bottom' && mytop > $(window).height()) 
						{
							// if tooltip was placed before the top screen margin, then
							// change tooltip position to bottom side
							mytop  = ( elPos.top - me.outerHeight() - (nubDim.height / 3 * 2) );
							tipPos = 'top';
						}
						
					} 
					
					else if(tipPos == 'left' || tipPos == 'right') 
					{
						myleft = ( tipPos == 'left' ? 
							elPos.left - (nubDim.width / 3 * 2) - me.outerWidth() :
							elPos.left + el.outerWidth() + (nubDim.width / 3 * 2)
						);
						
						if (tipPos == 'left' && myleft < 0) 
						{
							// if tooltip was placed before the left screen margin, then
							// change tooltip position to right side
							myleft = elPos.left + el.outerWidth() + (nubDim.width / 3 * 2);
							tipPos = 'right';
						} 
						else if (tipPos == 'right' && (myleft + me.outerWidth()) > $(window).width()) 
						{
							// if tooltip was placed after the right screen margin, then
							// change tooltip position to left side
							myleft = elPos.left - (nubDim.width / 3 * 2) - me.outerWidth();
							tipPos = 'left';
						} 
						
					} // top || bottom ~ left || right
					
					nub.removeAttr('style');
					nub.removeClass('top bottom left right none');
					nub.addClass(tipPos);
					
					switch(elPosIndex.indexOf(tipPos)) 
					{
						case 1 : // top
							
							me.css({
								display: 'block',
								top: mytop - 10,
								left: elPos.left + (el.outerWidth()/2) - (me.outerWidth()/2)
							}).animate({'top': '+=10'}, 150 );
							
							nub.css({ left: Math.ceil(me.outerWidth()/2) });
	
							break;
							
						case 2 : // right

							me.css({
								display: 'block',
								top: (elPos.top - (me.outerHeight() / 2) + (el.outerHeight()/2) ),
								left: myleft + 10
							}).animate({'left': '-=10'}, 150);
							
							nub.css({ top: Math.ceil((me.outerHeight()/2) - (nub.outerHeight()/2)) });
							
							break;
							
						case 3 : // left
							
							me.css({
								display: 'block',
								top: ( elPos.top - Math.ceil(me.outerHeight() / 2) ),
								left: myleft - 10
							}).animate({'left': '+=10'}, 150);
							
							nub.css({ 
								top: Math.ceil(me.outerHeight()/2),
								left: me.outerWidth()
							});
													
							break;
							
						case 4 : // none
							
							me.css({
								display: 'block',
								top: mytop - 10,
								left: myleft
							}).animate({'top': '+=10'}, 150);
							
							nub.css('display', 'none');
													
							break;
							
						default: // bottom
						
							me.css({
								display: 'block',
								top: mytop + 10,
								left: elPos.left + (el.outerWidth()/2) - (me.outerWidth()/2)
							}).animate({'top': '-=10'}, 150);
						
						
							nub.css({ left: Math.ceil((me.outerWidth()/2) - (nub.outerWidth()/2)) });
						
							break;
					}
					
					//
					// adjust left|right position if the tooltip is placed as 'top' | 'bottom' and
					// it goes over the limits of browser's work-area
					//
					
					if (tipPos == 'top' || tipPos == 'bottom') 
					{
						var diff = Math.ceil( me.offset().left + me.outerWidth() - $(window).width() );

						if (diff > 0) 
						{
							me.css({left: me.offset().left - diff});
							nub.css({left: diff + parseInt(nub.css('left'), 10) + 20});
						}
					}
					
					if (! _isFixed(el))
					{
						// animate to scroll until the element
						centerWindow = Math.ceil($(window).height() / 2);
						tipOffset = Math.ceil(me.offset().top - centerWindow);
						
						$("html, body").animate({scrollTop: tipOffset}, 'slow');
					}
					
					if (tipPos != 'none')
					{
						el.addClass('my-tour-highlight');

						if ( el.css('background-color') == 'rgba(0, 0, 0, 0)' || el.css('background-color') == 'transparent' )
						{
							el.data('reset-background', true);
							el.css('background-color', 'rgba(255, 255, 255, 1)');
						}
					}
					
					me.fadeIn('fast');
					
				}); // me.fadeIn
			}
			else // !el.length 
			{ 
				stepCurrent += 1;
				_play(o);
			}
		}  // tip.length
			
		if (o.afterPlay && 'function' == typeof(o.afterPlay)) 
		{
			o.afterPlay(stepCurrent);
		}
	}; // _play
	
	function _button( options ) 
	{
		var o = options,
			prev   = $('<a href="#"  id="my-tour-button-prev"></a>'),
			next   = $('<a href="#"  id="my-tour-button-next"></a>'),
			start  = $('<a href="#"  id="my-tour-button-start"></a>'),
			finish = $('<a href="#"  id="my-tour-button-finish"></a>'),
			steps  = $('<select id="my-tour-dropdown-steps" ></select>'),
			div	   = $('<div id="my-tour-button-bar" ></div>');
		
		// setup the start button behavior
		if (!o.autoPlay && o.buttons.start)
		{
			if (stepCurrent > 0)
			{
				start.click(function(e){
					e.preventDefault();
					stepCurrent = 0;
					_play(o);
				});
			}
			else 
			{
				start.click(function(e){ e.preventDefault(); })
					 .addClass('disabled');
			}
			
			start.html(o.buttons.start)
				 .appendTo(div);
		}
		
		// setup the previous button behavior
		if (!o.autoPlay && o.buttons.prev)
		{
			if (stepCurrent > 0)
			{
				prev.click(function(e) {
					e.preventDefault();
					stepCurrent -= 1;
					_play( o );
				});
			}
			else
			{
				prev.click(function(e){ e.preventDefault(); })
					.addClass('disabled');
			}
			
			prev.html(o.buttons.prev)
				.appendTo(div);
		}
		
		// setup the next button behavior
		if (!o.autoPlay && o.buttons.next)
		{
			if (stepCurrent < stepContainer.length - 1)
			{
				next.click(function(e){
					e.preventDefault();
					stepCurrent += 1;
					_play( o );
				});
			}
			else
			{
				next.click(function(e){ e.preventDefault(); })
					.addClass('disabled');
			}
			
			
			next.html(o.buttons.next)
				.appendTo(div);
		}
		
		// setup the finish button behavior
		if ((!o.autoPlay && o.buttons.finish) ||
			(o.buttons.finish && stepCurrent >= stepContainer.length - 1))
		{
			finish.click(function(e){
				e.preventDefault();
				stepCurrent = 0; // reset
				_stop(o);
			});
			
			finish.html(o.buttons.finish)
				  .appendTo(div);
		}

		// steps dropdown box
		if (!o.autoPlay && o.buttons.menu)
		{
			var i = 0,
				j = i+1;
			
			for(i in stepContainer)
			{
				if ($(stepContainer[i].data('id')).length)
				{
					steps.append(
						'<option value="'+(i)+'" '
						+(stepCurrent == i ? 'selected="selected"' : '')+' >'
						+(j++)+'</option>'
					);
				}
			}
			
			steps.change(function(){
				stepCurrent = parseInt(this.value, 10);
				_play(o);
			}).appendTo(div);
		}
		
		return div;
	};
	
	$.fn.mytour = function( method ) 
	{
		if (methods[method]) 
		{
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} 
		else if ( typeof method === 'object' || ! method ) 
		{
			return methods.init.apply( this, arguments );
		} 
		else 
		{
			$.error( 'Method ' +  method + ' does not exist on jQuery.mytour()' );
		}
	};
	
})(jQuery);