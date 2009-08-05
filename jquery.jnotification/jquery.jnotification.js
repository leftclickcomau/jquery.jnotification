/*
 * jnotification.js
 * 
 * Display a message once, using a cookie to remember that it has been 
 * acknowledged by the user.  Optionally it may be replaced by a link to make
 * the message appear again, which in turn may optionally persist for a 
 * configurable amount of time.
 * 
 * Copyright (c) 2009 Leftclick.com.au, Ben New
 * 
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 */

;(function($) {
	/**
	 * Convert an element into a closeable notification, which optionally may
	 * be restored.
	 * 
	 * @param $$ Element to modify
	 * @param options Array of key-value pairs.
	 * 
	 * @param cookiesEnabled Whether to use cookies to maintain the state of
	 *   the notification between visits by the same browser (default true)
	 * @param closedCookie Name of the cookie that stores the closed status 
	 *   (default 'jnotification.closed')
	 * @param closedCookieExpires Expiry time (in days) of the cookie that 
	 *   stores the closed status (default 1000)
	 * @param openLink Whether to display an 'open' link when the notification
	 *   is closed (default false)
	 * @param openLinkClass CSS class name to apply to the 'open' link 
	 *   (default 'open')
	 * @param openLinkTitle HTML title attribute to apply to the 'open' link
	 *   (default 'Open')
	 * @param openLinkText Content of the 'open' link (default '+')
	 * @param closeLink Whether to display a 'close' link in the notification
	 *   element (default true)
	 * @param closeLinkClass CSS class name to apply to the 'close' link 
	 *   (default 'close')
	 * @param closeLinkTitle HTML title attribute to apply to the 'close' link
	 *   (default 'Close')
	 * @param closeLinkText Content of the 'close' link (default 'X')
	 * 
	 * @return The passed-in element ($$)
	 */
	$.jnotification = function($$, options) {
		var options = $.extend({}, $.jnotification.defaultOptions, options);
		if (options.closeLink) {
			$$.prepend($('<a href="#" title="' + options.closeLinkTitle + '" class="' + options.closeLinkClass + '">' + options.closeLinkText + '</a>'));
		}
		var $$closed;
		if (options.openLink) {
			$$closed = $.jnotification._createOpenLink($$, options);
		}
		if (options.cookiesEnabled && ($.cookie(options.closedCookie) == 'closed')) {
			$$.hide();
			if (options.openLink) {
				$$closed.show();
			}
		}
		$$.find('a.' + options.closeLinkClass).click(function(event) {
			$$.slideUp(function() {
				if (options.openLink) {
					$$closed.show();
				}
			});
			if (options.cookiesEnabled) {
				$.cookie(options.closedCookie, 'closed', { 
					'expires' : options.closedCookieExpires 
				});
			}
		});
		return $$;
	};
	
	/**
	 * Default options for jnotification.
	 */
	$.jnotification.defaultOptions = {
		'cookiesEnabled' : true,
		'closedCookie' : 'jnotification.closed',
		'closedCookieExpires' : 1000,
		'openLink' : false,
		'openLinkClass' : 'open',
		'openLinkTitle' : 'Open',
		'openLinkText' : '+',
		'closeLink' : true,
		'closeLinkClass' : 'close',
		'closeLinkTitle' : 'Close',
		'closeLinkText' : 'X'
	};
	
	/**
	 * Helper method for jnotification.
	 * 
	 * @param $$ Element to modify
	 * @param options Array of key-value pairs.
	 * 
	 * @return Newly created 'open' link.
	 */
	$.jnotification._createOpenLink = function($$, options) {
		var closed_id = options['closed_id'] ? options['closed_id'] : $$.attr('id') + '_closed';
		var $$closed = $('<div id="' + closed_id + '" style="display:none;"></div>');
		$$closed.html('<a class="' + options.openLinkClass + '" title="' + options.openLinkTitle + '">' + options.openLinkText + '</a>');
		$$.after($$closed);
		$$closed.find('a.' + options.openLinkClass).click(function(event) {
			$$closed.hide();
			$$.slideDown();
			if (options.cookiesEnabled) {
				$.cookie(options.closedCookie, null);
			}
		});
		return $$closed;
	};
})(jQuery);
