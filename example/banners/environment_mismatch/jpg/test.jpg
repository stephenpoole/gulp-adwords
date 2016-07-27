var diva = (function() {
	var evts = [];
	var self = this;
	window.onscroll = onScroll;

	function onScroll(e) {
		for (var i in evts) {
			var evt = evts[i];
			if ((evt.total == -1 || evt.count < evt.total)) {
				if (elementIsInView(evt.element)) {
					if (!evt.triggered) {
						evt.callback.call(self);
						evt.triggered = true;
						evt.count++;
					}
				} else {
					if (evt.triggered) {
						evt.triggered = false;
					}
				}
			} else {
				removeEvent(i);
			}
		}
	}

	function elementIsInView(element) {
		var elementCoords = getAbsolutePosition(element);
		var windowHeight = window.screen.height;
		var windowWidth = window.screen.width;
		return elementCoords.top >= window.scrollY && elementCoords.top <= window.scrollY + windowHeight
			&& elementCoords.left >= window.scrollX && elementCoords.left <= window.scrollX + windowWidth;
	}

	function getAbsolutePosition(el) {
	    var el2 = el;
	    var curtop = 0;
	    var curleft = 0;
	    if (document.getElementById || document.all) {
	        do  {
	            curleft += el.offsetLeft-el.scrollLeft;
	            curtop += el.offsetTop-el.scrollTop;
	            el = el.offsetParent;
	            el2 = el2.parentNode;
	            while (el2 != el) {
	                curleft -= el2.scrollLeft;
	                curtop -= el2.scrollTop;
	                el2 = el2.parentNode;
	            }
	        } while (el.offsetParent);

	    } else if (document.layers) {
	        curtop += el.y;
	        curleft += el.x;
	    }
	    return {top:curtop, left:curleft};
	}

	function addEvent(element, count, callback) {
		if (typeof element === 'string') {
			if (element.indexOf('#') > -1 || element.indexOf('.') == -1) {
				element = element.replace(/\.|#/g, '');
				element = document.getElementById(element);
			} else if (element.indexOf('.') > -1) {
				element = element.replace(/\.|#/g, '');
				element = document.getElementsByClassName(element)[0];
			}
		}
		if (!element || element == null || typeof callback !== 'function') return;
		evts.push({
			element: element,
			count: 0,
			total: count,
			callback: callback,
			triggered: false
		});
		onScroll();
	}

	function removeEvent(at) {
		if (typeof at === 'number') {
			evts.splice(index, 1);
		} else if (typeof at === 'object') {
			for (var i in evts) {
				if (evts[i].element === at) {
					evts.splice(i, 1);
				}
			}
		}
	}

	return {
		events: evts,
		once: function(element, callback) {
			addEvent(element, 1, callback);
		},
		always: function(element, callback) {
			addEvent(element, -1, callback);
		},
		sometimes: function(element, num, callback) {
			addEvent(element, num, callback);
		},
		destroy: function(element, callback) {
			removeEvent(element);
		}
	}
})();