"use strict";

document.addEventListener('DOMContentLoaded', function () {

	var myScroll = {
		
		wrapper: document.getElementById('wrapper'),

		delve: document.getElementById('delve'),

		mouseWheelLock: false,

		mouseWheelEvent: (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel",

		run: function(delta){

			var self = this;

			var y = parseFloat(self.wrapper.style.top) || 0;

			if (self.mouseWheelLock === false){

				self.mouseWheelLock = true;

				if (y <= 0 && !( y == 0 && delta > 0) && !( y <= -200 && delta < 0)){

					self.wrapper.style.top = delta > 0 ? (y + 100) + '%' : (y - 100) + '%';

				} else {

					self.mouseWheelLock = false;

				}

			}

		},

		normaliseMouseWheel: function(event){

			var evt = window.event || event;
			var delta = evt.detail? evt.detail*(-120) : evt.wheelDelta;

			return delta;
		},

		init: function(){

			var self = this;

			self.delve.addEventListener('click', function(){
				self.wrapper.style.top = '-100%';
			});

			["transitionend", "webkitTransitionEnd", "mozTransitionEnd"].forEach(function(transition){

				self.wrapper.addEventListener(transition, function(e){
					self.mouseWheelLock = false;
				}, false);

			});

			window.addEventListener(self.mouseWheelEvent, function(e) {

				var delta = self.normaliseMouseWheel(e);

				self.run(delta);

			});

		}

	};

	myScroll.init();

	var resizeManager = {

		logo: document.getElementById('logo'),

		video: document.getElementById('video'),

		delve: document.getElementById('delve'),
		
		playBtn: document.getElementById('play'),

		getAbsoluteHeight: function(el) {

		  el = (typeof el === 'string') ? document.querySelector(el) : el;

		  var styles = window.getComputedStyle(el);
		  var margin = parseFloat(styles['marginTop']) +
		               parseFloat(styles['marginBottom']);

		  return Math.ceil(el.offsetHeight + margin);

		},

		resizeVideo: function(){

			var self = this;

			var logoHeight = self.getAbsoluteHeight(self.logo);
			var delveHeight = self.getAbsoluteHeight(self.delve);

			var container = self.getAbsoluteHeight( document.getElementsByClassName('panel')[0] );
			container = parseFloat(container);		

			self.video.style.height = container - (logoHeight + delveHeight) + 'px';

		},

		init: function(){

			var self = this;

			self.resizeVideo();

		}

	};

	resizeManager.init();

}, false);