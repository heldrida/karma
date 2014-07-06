"use strict";

document.addEventListener('DOMContentLoaded', function () {

	var wrapper = document.getElementById('wrapper');
	var delve = document.getElementById('delve');

	delve.addEventListener('click', function(){
		wrapper.style.top = '-100%';
	});

	var mw_lock = false;

	["transitionend", "webkitTransitionEnd", "mozTransitionEnd"].forEach(function(transition) {

		wrapper.addEventListener(transition, function(e){
			mw_lock = false;
		}, false);

	});

	var mousewheelevt = (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel";

	window.addEventListener(mousewheelevt, function(e) {

		var evt = window.event || e;
		var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta;

		(function(){

			var y = parseFloat(wrapper.style.top) || 0;

			if (mw_lock === false){

				mw_lock = true;

				if (y <= 0 && !( y == 0 && delta > 0) && !( y <= -200 && delta < 0)){

					wrapper.style.top = delta > 0 ? (y + 100) + '%' : (y - 100) + '%';

				} else {

					mw_lock = false;

				}

			}

		}());


	});

}, false);