"use strict";

document.addEventListener('DOMContentLoaded', function () {

	var myScroll = {

		index: 0,
		
		wrapper: document.getElementById('wrapper'),

		delve: document.getElementById('delve'),

		mouseWheelLock: false,

		mouseWheelEvent: (/Firefox/i.test(navigator.userAgent)) ? "DOMMouseScroll" : "mousewheel",

		queue: [],

		timelinePoints: document.getElementsByClassName('point'),

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

		setTimeline: function(){

			var self = this;

			var timeline = document.getElementById('timeline');

			timeline.className = '';
			timeline.className += 'index' + self.index;

			var elements = document.getElementsByClassName('point');

			for (var i = 0; i < elements.length; i++){

				elements.item(i).className = elements.item(i).className.replace('active', '');

				if (self.index === i){

					elements.item(i).className += ' ' + 'active';

				}

			}

		},

		setIndex: function(){

			var self = this;
			self.index = Math.abs(parseFloat(self.wrapper.style.top || 0)) / 100;

		},

		activeClassPanelSetter: function(){
			
			var self = this;

			var setter = function(){
				
				console.log('setter');

				var elements = document.getElementsByClassName('panel');

				for (var i = 0; i < elements.length; i++){

					elements.item(i).className = elements.item(i).className.replace('active', '');

					if (self.index === i){

						elements.item(i).className += ' ' + 'active';

					}

				}


			};

			setter();

		},

		resetQueue: function(){
			
			var self = this;

			for (var i = 0; i < self.queue.length; i++){

				self.queue[i]();

			}

			self.queue = []; // reset list

		},

		init: function(){

			var self = this;

			self.delve.addEventListener('click', function(){
				self.wrapper.style.top = '-100%';
			});

			["transitionend", "webkitTransitionEnd", "mozTransitionEnd"].forEach(function(transition){

				self.wrapper.addEventListener(transition, function(e){
					self.mouseWheelLock = false;
					self.setIndex();
					self.setTimeline();
					self.activeClassPanelSetter();
					self.resetQueue();
				}, false);

			});

			window.addEventListener(self.mouseWheelEvent, function(e) {

				var delta = self.normaliseMouseWheel(e);

				self.run(delta);

			});

			for (var i = 0; i < self.timelinePoints.length; i++){

				self.timelinePoints.item(i).addEventListener('click', function(e){

					self.wrapper.style.top = parseFloat(this.getAttribute('data-index') * -100) + '%';

				});

			}

		}

	};

	myScroll.init();

	var videoPlayer = {

		playBtn: document.getElementById('play'),
		
		video: document.getElementById('video'),

		iframe: document.querySelector('#videoWrapper iframe'),

		listenVimeoApi: function(){

			var self = this;

			var player = $f(self.iframe);

			player.addEvent('ready', function() {
			   player.addEvent('finish', self.reset.bind(self));
			});

		},

		setSrc: function(){

			var self = this;

			self.iframe.src = self.iframe.getAttribute('data-src');

			self.listenVimeoApi();

		},

		play: function(){

			var self = this;

			self.removePlayBtn();

			setTimeout(function(){

				self.setSrc();
				
				myScroll.queue.push(self.reset.bind(self));

			}, 800);

		},

		removePlayBtn: function(){

			var self = this;

			self.playBtn.className += ' ' + 'playing';

		},

		reset: function(){

			var self = this;

			self.playBtn.className = self.playBtn.className.replace('playing', '');
			self.iframe.src = '';

		},

		init: function(){

			var self = this;

			self.playBtn.addEventListener('click', function(){

				self.play();

			});

		}

	};

	videoPlayer.init();

	var resizeManager = {

		logo: document.getElementById('logo'),

		video: document.getElementById('video'),

		delve: document.getElementById('delve'),
		
		playBtn: document.getElementById('play'),

		worldKarma: document.getElementById('world-karma'),

		getAbsoluteHeight: function(el) {

		  el = (typeof el === 'string') ? document.querySelector(el) : el;

		  var styles = window.getComputedStyle(el);
		  var margin = parseFloat(styles['marginTop']) +
		               parseFloat(styles['marginBottom']);

		  return Math.ceil(el.offsetHeight + margin);

		},

		resizeVideoIframe: function(){

			var self = this;
			var video = document.getElementById('video');
			var videoWrapper = document.getElementById('videoWrapper');
			var ratio = 9.4 / 16;
			var videoWidth = parseFloat(window.getComputedStyle(video).width);

			videoWrapper.style.height = ratio * videoWidth + 'px';
			videoWrapper.style.width = videoWidth + 'px';

			videoWrapper.style.marginTop = (parseFloat(self.video.style.height) - parseFloat(videoWrapper.style.height)) / 2 + 'px';

		},

		resizeVideo: function(){

			var self = this;

			var logoHeight = self.getAbsoluteHeight(self.logo);
			var delveHeight = self.getAbsoluteHeight(self.delve);

			var container = self.getAbsoluteHeight( document.getElementsByClassName('panel')[0] );
			container = parseFloat(container);		

			self.video.style.height = container - (logoHeight + delveHeight) + 'px';

			self.resizeVideoIframe();

		},

		setVerticalWorldKarma: function(){

			var self = this;

			var containerHeight = self.getAbsoluteHeight(document.getElementsByClassName('panel-b')[0]);
			var c = document.querySelectorAll('#world-karma > div');
			var h = 0;

			for (var i = 0; i < c.length; i++){
				
				h += self.getAbsoluteHeight(c[i]);

			}

			self.worldKarma.style.marginTop = (containerHeight - h) / 2 + 'px';

		},

		init: function(){

			var self = this;

			self.resizeVideo();

			window.addEventListener('resize', function(){
				self.resizeVideo();
				self.setVerticalWorldKarma();
			});

			window.dispatchEvent(new Event('resize'));

		}

	};

	resizeManager.init();

}, false);