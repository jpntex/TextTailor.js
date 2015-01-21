/*!
 * TextTailor - v0.1.0
 * https://github.com/jpntex
 *
 * http://jpntex.com
 *
 * Copyright (c) 2014 João Teixeira; Licensed MIT
 *
 */

(function($, window) {
	'use strict';

	var settings = {
		minFont: 1,
		maxFont: 9999,
		preWrapText: false,
		lineHeight: 1.45,
		resizable: true,
		debounce: false,
		fit: true,
		ellipsis: true,
		center: false,
		justify: false
	};

	function Tailor(el, options) {
		this.el = el;
		this.options = $.extend({}, settings, options);
		this.init();
	}

	Tailor.prototype = {
		init: function() {
			var error = (this.options.minFont > this.options.maxFont),
				el = $(this.el);

			if (error && window.console) {
				console.log('TextTailor error: minFont needs to be smaller than maxFont!');
			}

			// store original html source from element
			this.HTML = this.el.innerHTML;

			// TODO: check here for height and width errors

			if (!error) {
				var resize,
					_self = this;

				if (this.options.resizable) {
					$(window).on('resize', function() {
						if (_self.options.debounce) {
							clearTimeout(resize);
							resize = setTimeout(function() {
								_self.start();
							}, 200);
						} else {
							_self.start();
						}
					});
				}

				this.start();
			}
		},
		start: function() {
			var el = $(this.el);

			// reset element
			this.el.innerHTML = this.HTML;
			el.wrapInner('<div/>');
			this.wraped = $(this.el.firstChild);
			this.wraped.css({
				'line-height': this.options.lineHeight,
				'tranform': 'translateZ(0)',
				'height': 'auto'
			});


			if (this.options.preWrapText) this.wraped.css('white-space', 'pre-line');

			this.maxHeight = el.height();
			this.maxWidth = el.width();

			this.fit().ellipsis().center().justify();
		},
		fit: function() {
			if (this.options.fit) {
				var _self = this,
					el = this.wraped,
					maxIter = 30,
					iterCount = 0,
					fitCalc = function calcMe(size, min, max) {
						if (++iterCount === maxIter) return size;
						if (size <= _self.options.minFont) return _self.options.minFont;
						if (size >= _self.options.maxFont) return _self.options.maxFont;
						if (min === max) return min;

						// force DOM height update
						el.css('fontSize', (size));

						if (el[0].scrollHeight < _self.maxHeight) {
							el.css('fontSize', (size + 1));
							if (el[0].scrollHeight >= _self.maxHeight) return size;
							return calcMe(Math.round((max + size) / 2), size, max);
						} else {
							el.css('fontSize', (size - 1));
							return calcMe(Math.round((min + size) / 2), min, size);
						}
					};

				var m = Math.round((this.options.maxFont + this.options.minFont) / 2);
				el.css('fontSize', m);

				var measure = fitCalc(m, this.options.minFont, this.options.maxFont);
				el.css('fontSize', measure);
			}

			return this;

		},
		ellipsis: function() {
			if (this.options.ellipsis) {
				var el = this.wraped;

				el.css({
					'overflow': 'hidden',
					'text-overflow': 'ellipsis'
				});

				if (el.height() > this.maxHeight) {
					var tmpText = el.html();
					el.html('O');

					var rowHeight = el.height(),
						start = 1,
						end = tmpText.length;

					while (start < end) {
						var length = Math.ceil((start + end) / 2);
						el.html(tmpText.slice(0, length) + '...');

						if (el.height() <= this.maxHeight) {
							start = length;
						} else {
							end = length - 1;
						}
					}

					el.html(tmpText.slice(0, start) + '...');
				}
			}

			return this;
		},
		center: function() {
			if (this.options.center) {
				var pos = $(this.el).css('position');

				if (pos !== 'relative' && pos !== 'absolute') {
					$(this.el).css("position", "relative");
				}

				this.wraped.css({
					"position": "absolute",
					"width": this.wraped.width() + "px",
					"left": "0",
					"right": "0",
					"top": "0",
					"bottom": "0",
					"height": this.wraped.height() + "px",
					"margin": "auto"
				});
			}
			return this;
		},
		justify: function() {
			if (this.options.justify) {
				this.wraped.css({
					"text-align": "justify"
				});
			}
			return this;
		}
	};

	$.fn.textTailor = function(options) {
		return this.each(function() {
			// prevent multiple instantiations
			if (!$.data(this, 'TextTailor')) {
				$.data(this, 'TextTailor',
					new Tailor(this, options));
			}
		});
	};

})(jQuery, window);