/**
 * koglossarylinks - KOglossaryLinks is a jQuery plugin that shows glossary-style tooltips when hovered (or tapped on touchscreen devices)
 * @version v0.4.0
 * @link https://github.com/mrmartineau/KOglossaryLinks
 * @license MIT
 */
;(function ($, f) {
	var KOglossaryLinks = function () {

		var _ = this;
		_.tooltipClass = 'KOglossaryLinkTooltip';
		_.element      = '[data-koglossarylink]';

		// Set some default options
		_.options = {
			sourceURL: '',
			tooltipwidth: 260,
			debug: false
		};

		_.init = function (el, options) {
			_.options = $.extend(_.options, options);
			_.el = el;
			_.overEvent = _.supportsTouch() ? "click" : "mouseover";
			_.terms = {};

			if (_.options.debug) { console.log('_.options', _.options); }

			$.getJSON(_.options.sourceURL).then(function (data) {
				var jsonData = data;

				for (var i = 0; i < jsonData.length; i++) {
					_.terms[jsonData[i].term.toLowerCase()] = jsonData[i];
				}
				if (_.options.debug) { console.log('All the terms:', _.terms); }
			});

			_.el.on(_.overEvent, _.element, function (event) {
				event.preventDefault();
				event.stopPropagation();

				// Close all other tooltips before opening this one
				_.el.find(_.element).children('.' + _.tooltipClass).removeClass('is-visible');

				var tooltipState       = $(this).parent('.tooltipWrapper').length ? true : false; // Check if the toolip has been created already
				var data               = $(this).data('koglossarylink') !== undefined ? $(this).data('koglossarylink').toLowerCase() : '';
				var tooltipCloseMarkup = _.supportsTouch() ? '<div class="' + _.tooltipClass + '-close icon-close"></div>' : '';
				var toolTipTitleClass  = _.supportsTouch() ? _.tooltipClass + '-title ' + _.tooltipClass + '-title--touch' : _.tooltipClass + '-title';

				if ( $(this).parent('.' + _.tooltipClass).hasClass('is-visible') ) {
					$(this).parent('.' + _.tooltipClass).removeClass('is-visible');
				} else {
					// Only create markup if the tooltip hasn't been created
					if (tooltipState) {
						$(this).find('.' + _.tooltipClass).addClass('is-visible');
						_.positionTooltip($(this));
						return;
					} else {
						if (_.terms[data] !== undefined) {
							var tooltip = '<div class="' + _.tooltipClass + '"><h3 class="' + toolTipTitleClass + '">' + _.terms[data].term + '</h3><div class="' + _.tooltipClass + '-description">' + _.terms[data].description + '</div>' + tooltipCloseMarkup + '<span class="' + _.tooltipClass + '-triangle"></span></div>';
							$(this).wrap("<span class='tooltipWrapper'></span>").append(tooltip);
							$(this).find('.' + _.tooltipClass).addClass('is-visible');
							_.positionTooltip($(this));
						} else {
							if (_.options.debug) { console.log('No term found'); }
						}
					}
				}
			});

			_.el.on('mouseout', _.element, function () {
				$(this).find('.' + _.tooltipClass).removeClass('is-visible');
			});

			_.el.on('click', _.element + ' .' + _.tooltipClass + '-close', function (event) {
				event.preventDefault();
				event.stopPropagation();
				$(this).parent('.' + _.tooltipClass).removeClass('is-visible');
			});

			$(window).resize(_.positionTooltip(_.el.find(_.element)));

			return _;
		};

		_.positionTooltip = function ($el) {
			if ($el.offset() === undefined) { return; }

			var $pos = parseInt($el.offset().left, 10);
			var $elWidth = $el.width();
			var $elCenterPoint = parseInt($pos + ($elWidth / 2), 10);
			var $windowWidth = $(window).width();
			var halfTooltipWidth = _.options.tooltipwidth / 2;
			var $tooltip = $el.find('.' + _.tooltipClass);
			var $tooltipTriangle = $el.find('.' + _.tooltipClass + '-triangle');
			var difference;
			var newTooltipCentre;
			var newArrowCentre;

			if ($elCenterPoint + halfTooltipWidth > $windowWidth) {
				// El is floating off right side
				difference       = parseInt( (($elCenterPoint + halfTooltipWidth) - $windowWidth) + 20 , 10);
				newTooltipCentre = parseInt(halfTooltipWidth + (difference / 2) + 20, 10);
				newArrowCentre   = parseInt(10 + (difference / 2), 10);

				if (_.options.debug) {
					console.log('El is floating off right side:', '\nwindow width', $windowWidth, '\nelcentrepoint', $elCenterPoint, '\ndifference', difference, '\nnewtooltipcentre', newTooltipCentre, '\nnewarrowcentre', newArrowCentre);
				}

				$tooltip.css({
					marginLeft: '-' + newTooltipCentre + 'px'
				});
				$tooltipTriangle.css({
					marginLeft: newArrowCentre + 'px'
				});

			} else if ($elCenterPoint - halfTooltipWidth < 0) {
				// El is floating off left side
				difference       = parseInt($elCenterPoint, 10);
				newTooltipCentre = difference - 20;
				newArrowCentre   = (halfTooltipWidth - 10) - (difference - 40);

				if (_.options.debug) {
					console.log('El is floating off left side:', '\nwindow width', $windowWidth, '\nelcentrepoint', $elCenterPoint, '\ndifference', difference, '\nnewtooltipcentre', newTooltipCentre, '\nnewarrowcentre', newArrowCentre);
				}

				$tooltip.css({
					marginLeft: '-' + newTooltipCentre + 'px'
				});
				$tooltipTriangle.css({
					marginLeft: '-' + newArrowCentre + 'px'
				});

			} else {
				// Reset position back to normal
				$tooltip.css({
					marginLeft: '-' + halfTooltipWidth + 'px'
				});
				$tooltipTriangle.css({
					marginLeft: '-10px'
				});
			}
		};

		_.supportsTouch = function() {
			return ('ontouchstart' in document.documentElement) || (window.DocumentTouch && document instanceof DocumentTouch || navigator.msMaxTouchPoints ? true : false);
		};

	};


	//  Create a jQuery plugin
	$.fn.KOglossaryLinks = function (options) {
		var len = this.length;

		return this.each(function (index) {
			var me = $(this),
				key = 'KOglossaryLinks' + (len > 1 ? '-' + ++index : ''),
				instance = (new KOglossaryLinks).init(me, options)
			;

			//  Invoke an KOglossaryLinks instance
			me.data(key, instance).data('key', key);
		});
	};

	KOglossaryLinks.version = "0.4.0";
})(jQuery, false);

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS1LT2dsb3NzYXJ5TGlua3MuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoianF1ZXJ5LUtPZ2xvc3NhcnlMaW5rcy5qcyIsInNvdXJjZXNDb250ZW50IjpbIjsoZnVuY3Rpb24gKCQsIGYpIHtcblx0dmFyIEtPZ2xvc3NhcnlMaW5rcyA9IGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBfID0gdGhpcztcblx0XHRfLnRvb2x0aXBDbGFzcyA9ICdLT2dsb3NzYXJ5TGlua1Rvb2x0aXAnO1xuXHRcdF8uZWxlbWVudCAgICAgID0gJ1tkYXRhLWtvZ2xvc3NhcnlsaW5rXSc7XG5cblx0XHQvLyBTZXQgc29tZSBkZWZhdWx0IG9wdGlvbnNcblx0XHRfLm9wdGlvbnMgPSB7XG5cdFx0XHRzb3VyY2VVUkw6ICcnLFxuXHRcdFx0dG9vbHRpcHdpZHRoOiAyNjAsXG5cdFx0XHRkZWJ1ZzogZmFsc2Vcblx0XHR9O1xuXG5cdFx0Xy5pbml0ID0gZnVuY3Rpb24gKGVsLCBvcHRpb25zKSB7XG5cdFx0XHRfLm9wdGlvbnMgPSAkLmV4dGVuZChfLm9wdGlvbnMsIG9wdGlvbnMpO1xuXHRcdFx0Xy5lbCA9IGVsO1xuXHRcdFx0Xy5vdmVyRXZlbnQgPSBfLnN1cHBvcnRzVG91Y2goKSA/IFwiY2xpY2tcIiA6IFwibW91c2VvdmVyXCI7XG5cdFx0XHRfLnRlcm1zID0ge307XG5cblx0XHRcdGlmIChfLm9wdGlvbnMuZGVidWcpIHsgY29uc29sZS5sb2coJ18ub3B0aW9ucycsIF8ub3B0aW9ucyk7IH1cblxuXHRcdFx0JC5nZXRKU09OKF8ub3B0aW9ucy5zb3VyY2VVUkwpLnRoZW4oZnVuY3Rpb24gKGRhdGEpIHtcblx0XHRcdFx0dmFyIGpzb25EYXRhID0gZGF0YTtcblxuXHRcdFx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGpzb25EYXRhLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHRcdFx0Xy50ZXJtc1tqc29uRGF0YVtpXS50ZXJtLnRvTG93ZXJDYXNlKCldID0ganNvbkRhdGFbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKF8ub3B0aW9ucy5kZWJ1ZykgeyBjb25zb2xlLmxvZygnQWxsIHRoZSB0ZXJtczonLCBfLnRlcm1zKTsgfVxuXHRcdFx0fSk7XG5cblx0XHRcdF8uZWwub24oXy5vdmVyRXZlbnQsIF8uZWxlbWVudCwgZnVuY3Rpb24gKGV2ZW50KSB7XG5cdFx0XHRcdGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cdFx0XHRcdGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuXG5cdFx0XHRcdC8vIENsb3NlIGFsbCBvdGhlciB0b29sdGlwcyBiZWZvcmUgb3BlbmluZyB0aGlzIG9uZVxuXHRcdFx0XHRfLmVsLmZpbmQoXy5lbGVtZW50KS5jaGlsZHJlbignLicgKyBfLnRvb2x0aXBDbGFzcykucmVtb3ZlQ2xhc3MoJ2lzLXZpc2libGUnKTtcblxuXHRcdFx0XHR2YXIgdG9vbHRpcFN0YXRlICAgICAgID0gJCh0aGlzKS5wYXJlbnQoJy50b29sdGlwV3JhcHBlcicpLmxlbmd0aCA/IHRydWUgOiBmYWxzZTsgLy8gQ2hlY2sgaWYgdGhlIHRvb2xpcCBoYXMgYmVlbiBjcmVhdGVkIGFscmVhZHlcblx0XHRcdFx0dmFyIGRhdGEgICAgICAgICAgICAgICA9ICQodGhpcykuZGF0YSgna29nbG9zc2FyeWxpbmsnKSAhPT0gdW5kZWZpbmVkID8gJCh0aGlzKS5kYXRhKCdrb2dsb3NzYXJ5bGluaycpLnRvTG93ZXJDYXNlKCkgOiAnJztcblx0XHRcdFx0dmFyIHRvb2x0aXBDbG9zZU1hcmt1cCA9IF8uc3VwcG9ydHNUb3VjaCgpID8gJzxkaXYgY2xhc3M9XCInICsgXy50b29sdGlwQ2xhc3MgKyAnLWNsb3NlIGljb24tY2xvc2VcIj48L2Rpdj4nIDogJyc7XG5cdFx0XHRcdHZhciB0b29sVGlwVGl0bGVDbGFzcyAgPSBfLnN1cHBvcnRzVG91Y2goKSA/IF8udG9vbHRpcENsYXNzICsgJy10aXRsZSAnICsgXy50b29sdGlwQ2xhc3MgKyAnLXRpdGxlLS10b3VjaCcgOiBfLnRvb2x0aXBDbGFzcyArICctdGl0bGUnO1xuXG5cdFx0XHRcdGlmICggJCh0aGlzKS5wYXJlbnQoJy4nICsgXy50b29sdGlwQ2xhc3MpLmhhc0NsYXNzKCdpcy12aXNpYmxlJykgKSB7XG5cdFx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoJy4nICsgXy50b29sdGlwQ2xhc3MpLnJlbW92ZUNsYXNzKCdpcy12aXNpYmxlJyk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0Ly8gT25seSBjcmVhdGUgbWFya3VwIGlmIHRoZSB0b29sdGlwIGhhc24ndCBiZWVuIGNyZWF0ZWRcblx0XHRcdFx0XHRpZiAodG9vbHRpcFN0YXRlKSB7XG5cdFx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoJy4nICsgXy50b29sdGlwQ2xhc3MpLmFkZENsYXNzKCdpcy12aXNpYmxlJyk7XG5cdFx0XHRcdFx0XHRfLnBvc2l0aW9uVG9vbHRpcCgkKHRoaXMpKTtcblx0XHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRcdFx0aWYgKF8udGVybXNbZGF0YV0gIT09IHVuZGVmaW5lZCkge1xuXHRcdFx0XHRcdFx0XHR2YXIgdG9vbHRpcCA9ICc8ZGl2IGNsYXNzPVwiJyArIF8udG9vbHRpcENsYXNzICsgJ1wiPjxoMyBjbGFzcz1cIicgKyB0b29sVGlwVGl0bGVDbGFzcyArICdcIj4nICsgXy50ZXJtc1tkYXRhXS50ZXJtICsgJzwvaDM+PGRpdiBjbGFzcz1cIicgKyBfLnRvb2x0aXBDbGFzcyArICctZGVzY3JpcHRpb25cIj4nICsgXy50ZXJtc1tkYXRhXS5kZXNjcmlwdGlvbiArICc8L2Rpdj4nICsgdG9vbHRpcENsb3NlTWFya3VwICsgJzxzcGFuIGNsYXNzPVwiJyArIF8udG9vbHRpcENsYXNzICsgJy10cmlhbmdsZVwiPjwvc3Bhbj48L2Rpdj4nO1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLndyYXAoXCI8c3BhbiBjbGFzcz0ndG9vbHRpcFdyYXBwZXInPjwvc3Bhbj5cIikuYXBwZW5kKHRvb2x0aXApO1xuXHRcdFx0XHRcdFx0XHQkKHRoaXMpLmZpbmQoJy4nICsgXy50b29sdGlwQ2xhc3MpLmFkZENsYXNzKCdpcy12aXNpYmxlJyk7XG5cdFx0XHRcdFx0XHRcdF8ucG9zaXRpb25Ub29sdGlwKCQodGhpcykpO1xuXHRcdFx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRcdFx0aWYgKF8ub3B0aW9ucy5kZWJ1ZykgeyBjb25zb2xlLmxvZygnTm8gdGVybSBmb3VuZCcpOyB9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9KTtcblxuXHRcdFx0Xy5lbC5vbignbW91c2VvdXQnLCBfLmVsZW1lbnQsIGZ1bmN0aW9uICgpIHtcblx0XHRcdFx0JCh0aGlzKS5maW5kKCcuJyArIF8udG9vbHRpcENsYXNzKS5yZW1vdmVDbGFzcygnaXMtdmlzaWJsZScpO1xuXHRcdFx0fSk7XG5cblx0XHRcdF8uZWwub24oJ2NsaWNrJywgXy5lbGVtZW50ICsgJyAuJyArIF8udG9vbHRpcENsYXNzICsgJy1jbG9zZScsIGZ1bmN0aW9uIChldmVudCkge1xuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblx0XHRcdFx0JCh0aGlzKS5wYXJlbnQoJy4nICsgXy50b29sdGlwQ2xhc3MpLnJlbW92ZUNsYXNzKCdpcy12aXNpYmxlJyk7XG5cdFx0XHR9KTtcblxuXHRcdFx0JCh3aW5kb3cpLnJlc2l6ZShfLnBvc2l0aW9uVG9vbHRpcChfLmVsLmZpbmQoXy5lbGVtZW50KSkpO1xuXG5cdFx0XHRyZXR1cm4gXztcblx0XHR9O1xuXG5cdFx0Xy5wb3NpdGlvblRvb2x0aXAgPSBmdW5jdGlvbiAoJGVsKSB7XG5cdFx0XHRpZiAoJGVsLm9mZnNldCgpID09PSB1bmRlZmluZWQpIHsgcmV0dXJuOyB9XG5cblx0XHRcdHZhciAkcG9zID0gcGFyc2VJbnQoJGVsLm9mZnNldCgpLmxlZnQsIDEwKTtcblx0XHRcdHZhciAkZWxXaWR0aCA9ICRlbC53aWR0aCgpO1xuXHRcdFx0dmFyICRlbENlbnRlclBvaW50ID0gcGFyc2VJbnQoJHBvcyArICgkZWxXaWR0aCAvIDIpLCAxMCk7XG5cdFx0XHR2YXIgJHdpbmRvd1dpZHRoID0gJCh3aW5kb3cpLndpZHRoKCk7XG5cdFx0XHR2YXIgaGFsZlRvb2x0aXBXaWR0aCA9IF8ub3B0aW9ucy50b29sdGlwd2lkdGggLyAyO1xuXHRcdFx0dmFyICR0b29sdGlwID0gJGVsLmZpbmQoJy4nICsgXy50b29sdGlwQ2xhc3MpO1xuXHRcdFx0dmFyICR0b29sdGlwVHJpYW5nbGUgPSAkZWwuZmluZCgnLicgKyBfLnRvb2x0aXBDbGFzcyArICctdHJpYW5nbGUnKTtcblx0XHRcdHZhciBkaWZmZXJlbmNlO1xuXHRcdFx0dmFyIG5ld1Rvb2x0aXBDZW50cmU7XG5cdFx0XHR2YXIgbmV3QXJyb3dDZW50cmU7XG5cblx0XHRcdGlmICgkZWxDZW50ZXJQb2ludCArIGhhbGZUb29sdGlwV2lkdGggPiAkd2luZG93V2lkdGgpIHtcblx0XHRcdFx0Ly8gRWwgaXMgZmxvYXRpbmcgb2ZmIHJpZ2h0IHNpZGVcblx0XHRcdFx0ZGlmZmVyZW5jZSAgICAgICA9IHBhcnNlSW50KCAoKCRlbENlbnRlclBvaW50ICsgaGFsZlRvb2x0aXBXaWR0aCkgLSAkd2luZG93V2lkdGgpICsgMjAgLCAxMCk7XG5cdFx0XHRcdG5ld1Rvb2x0aXBDZW50cmUgPSBwYXJzZUludChoYWxmVG9vbHRpcFdpZHRoICsgKGRpZmZlcmVuY2UgLyAyKSArIDIwLCAxMCk7XG5cdFx0XHRcdG5ld0Fycm93Q2VudHJlICAgPSBwYXJzZUludCgxMCArIChkaWZmZXJlbmNlIC8gMiksIDEwKTtcblxuXHRcdFx0XHRpZiAoXy5vcHRpb25zLmRlYnVnKSB7XG5cdFx0XHRcdFx0Y29uc29sZS5sb2coJ0VsIGlzIGZsb2F0aW5nIG9mZiByaWdodCBzaWRlOicsICdcXG53aW5kb3cgd2lkdGgnLCAkd2luZG93V2lkdGgsICdcXG5lbGNlbnRyZXBvaW50JywgJGVsQ2VudGVyUG9pbnQsICdcXG5kaWZmZXJlbmNlJywgZGlmZmVyZW5jZSwgJ1xcbm5ld3Rvb2x0aXBjZW50cmUnLCBuZXdUb29sdGlwQ2VudHJlLCAnXFxubmV3YXJyb3djZW50cmUnLCBuZXdBcnJvd0NlbnRyZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdG9vbHRpcC5jc3Moe1xuXHRcdFx0XHRcdG1hcmdpbkxlZnQ6ICctJyArIG5ld1Rvb2x0aXBDZW50cmUgKyAncHgnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkdG9vbHRpcFRyaWFuZ2xlLmNzcyh7XG5cdFx0XHRcdFx0bWFyZ2luTGVmdDogbmV3QXJyb3dDZW50cmUgKyAncHgnXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9IGVsc2UgaWYgKCRlbENlbnRlclBvaW50IC0gaGFsZlRvb2x0aXBXaWR0aCA8IDApIHtcblx0XHRcdFx0Ly8gRWwgaXMgZmxvYXRpbmcgb2ZmIGxlZnQgc2lkZVxuXHRcdFx0XHRkaWZmZXJlbmNlICAgICAgID0gcGFyc2VJbnQoJGVsQ2VudGVyUG9pbnQsIDEwKTtcblx0XHRcdFx0bmV3VG9vbHRpcENlbnRyZSA9IGRpZmZlcmVuY2UgLSAyMDtcblx0XHRcdFx0bmV3QXJyb3dDZW50cmUgICA9IChoYWxmVG9vbHRpcFdpZHRoIC0gMTApIC0gKGRpZmZlcmVuY2UgLSA0MCk7XG5cblx0XHRcdFx0aWYgKF8ub3B0aW9ucy5kZWJ1Zykge1xuXHRcdFx0XHRcdGNvbnNvbGUubG9nKCdFbCBpcyBmbG9hdGluZyBvZmYgbGVmdCBzaWRlOicsICdcXG53aW5kb3cgd2lkdGgnLCAkd2luZG93V2lkdGgsICdcXG5lbGNlbnRyZXBvaW50JywgJGVsQ2VudGVyUG9pbnQsICdcXG5kaWZmZXJlbmNlJywgZGlmZmVyZW5jZSwgJ1xcbm5ld3Rvb2x0aXBjZW50cmUnLCBuZXdUb29sdGlwQ2VudHJlLCAnXFxubmV3YXJyb3djZW50cmUnLCBuZXdBcnJvd0NlbnRyZSk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHQkdG9vbHRpcC5jc3Moe1xuXHRcdFx0XHRcdG1hcmdpbkxlZnQ6ICctJyArIG5ld1Rvb2x0aXBDZW50cmUgKyAncHgnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkdG9vbHRpcFRyaWFuZ2xlLmNzcyh7XG5cdFx0XHRcdFx0bWFyZ2luTGVmdDogJy0nICsgbmV3QXJyb3dDZW50cmUgKyAncHgnXG5cdFx0XHRcdH0pO1xuXG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHQvLyBSZXNldCBwb3NpdGlvbiBiYWNrIHRvIG5vcm1hbFxuXHRcdFx0XHQkdG9vbHRpcC5jc3Moe1xuXHRcdFx0XHRcdG1hcmdpbkxlZnQ6ICctJyArIGhhbGZUb29sdGlwV2lkdGggKyAncHgnXG5cdFx0XHRcdH0pO1xuXHRcdFx0XHQkdG9vbHRpcFRyaWFuZ2xlLmNzcyh7XG5cdFx0XHRcdFx0bWFyZ2luTGVmdDogJy0xMHB4J1xuXHRcdFx0XHR9KTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0Xy5zdXBwb3J0c1RvdWNoID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZXR1cm4gKCdvbnRvdWNoc3RhcnQnIGluIGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCkgfHwgKHdpbmRvdy5Eb2N1bWVudFRvdWNoICYmIGRvY3VtZW50IGluc3RhbmNlb2YgRG9jdW1lbnRUb3VjaCB8fCBuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA/IHRydWUgOiBmYWxzZSk7XG5cdFx0fTtcblxuXHR9O1xuXG5cblx0Ly8gIENyZWF0ZSBhIGpRdWVyeSBwbHVnaW5cblx0JC5mbi5LT2dsb3NzYXJ5TGlua3MgPSBmdW5jdGlvbiAob3B0aW9ucykge1xuXHRcdHZhciBsZW4gPSB0aGlzLmxlbmd0aDtcblxuXHRcdHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24gKGluZGV4KSB7XG5cdFx0XHR2YXIgbWUgPSAkKHRoaXMpLFxuXHRcdFx0XHRrZXkgPSAnS09nbG9zc2FyeUxpbmtzJyArIChsZW4gPiAxID8gJy0nICsgKytpbmRleCA6ICcnKSxcblx0XHRcdFx0aW5zdGFuY2UgPSAobmV3IEtPZ2xvc3NhcnlMaW5rcykuaW5pdChtZSwgb3B0aW9ucylcblx0XHRcdDtcblxuXHRcdFx0Ly8gIEludm9rZSBhbiBLT2dsb3NzYXJ5TGlua3MgaW5zdGFuY2Vcblx0XHRcdG1lLmRhdGEoa2V5LCBpbnN0YW5jZSkuZGF0YSgna2V5Jywga2V5KTtcblx0XHR9KTtcblx0fTtcblxuXHRLT2dsb3NzYXJ5TGlua3MudmVyc2lvbiA9IFwiMC40LjBcIjtcbn0pKGpRdWVyeSwgZmFsc2UpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
