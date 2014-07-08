'use strict';

document.getElementById('preloader').style.opacity = 1;

document.addEventListener('DOMContentLoaded', function () {

	var myScroll = {

		index: 0,
		
		wrapper: document.getElementById('wrapper'),

		delve: document.getElementById('delve'),

		mouseWheelLock: false,

		mouseWheelEvent: (/Firefox/i.test(navigator.userAgent)) ? 'DOMMouseScroll' : 'mousewheel',

		queue: [],

		timelinePoints: document.getElementsByClassName('point'),

		run: function(delta){

			var self = this;

			var y = parseFloat(self.wrapper.style.top) || 0;

			if (self.mouseWheelLock === false){

				self.mouseWheelLock = true;

				if (y <= 0 && !( y === 0 && delta > 0) && !( y <= -200 && delta < 0)){

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

			['transitionend', 'webkitTransitionEnd', 'mozTransitionEnd'].forEach(function(transition){

				self.wrapper.addEventListener(transition, function(event){

					if (self.wrapper !== event.target) {
						return;
					}

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

			var setMyTimelineEvent = function(){

				self.wrapper.style.top = parseFloat(this.getAttribute('data-index') * -100) + '%';

			};

			for (var i = 0; i < self.timelinePoints.length; i++){

				self.timelinePoints.item(i).addEventListener('click', setMyTimelineEvent);

			}

		}

	};

	myScroll.init();

	var videoPlayer = {

		playBtn: document.getElementById('play'),
		
		video: document.getElementById('video'),

		iframe: document.getElementById('vplayer'),

		playerApi: false,

		listenVimeoApi: function(){

			var self = this;

			self.iframe.addEventListener('load', function(){

				var $f = window.$f || undefined;

				if (typeof $f !== 'undefined') {

					self.playerApi = $f(self.iframe);

					self.playerApi.addEvent('ready', function() {

						self.video.className += 'ready';

						self.playerApi.addEvent('finish', self.reset.bind(self));

					});

				}

			});

		},

		play: function(){

			var self = this;
			
			self.removePlayBtn();

			self.showVideo(true);

			self.playerApi.api('play');

			myScroll.queue.push(self.reset.bind(self));

		},

		showVideo: function(bool){

			var self = this;

			if (bool){

				self.iframe.className += ' ' + 'show';

			}

		},

		removePlayBtn: function(){

			var self = this;
			self.playBtn.className += ' ' + 'playing';

		},

		reset: function(){

			var self = this;

			self.iframe.className = self.iframe.className.replace('show', '');

			setTimeout(function(){

				self.playBtn.className = self.playBtn.className.replace('playing', '');
				self.playerApi.api('unload');

			}, 1000);

		},

		init: function(){

			var self = this;
			
			self.listenVimeoApi();

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
		  var margin = parseFloat(styles.marginTop) +
		               parseFloat(styles.marginBottom);

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

		setVerticalPreloader: function(){

			var self = this;

			var containerHeight = self.getAbsoluteHeight(document.getElementById('preloader'));
			var el = document.querySelector('#preloader .top');
			var h = self.getAbsoluteHeight(el);

			el.style.marginTop = (containerHeight - h) / 2 + 'px';

		},

		setVerticalTeamK: function(){

			var self = this;

			var containerHeight = self.getAbsoluteHeight(document.querySelector('.panel-c'));
			var el = document.querySelector('#global-ops');
			var h = self.getAbsoluteHeight(el);

			el.style.marginTop = (containerHeight - h) / 2 + 'px';

		},

		init: function(){

			var self = this;

			self.resizeVideo();

			window.addEventListener('resize', function(){
				self.resizeVideo();
				self.setVerticalWorldKarma();
				self.setVerticalPreloader();
				self.setVerticalTeamK();
			});

			window.dispatchEvent(new Event('resize'));

		}

	};

	resizeManager.init();

	var imagePreloader = {

		preloader: document.getElementById('preloader'),
		
		container: document.querySelector('#wrapper'),

		body: document.getElementsByTagName('body')[0],

		removePreloaderAnim: function(){

			var self = this;

			var top = document.querySelectorAll('#preloader .top')[0];

			setTimeout(function(){

				top.className = top.className.replace('preloading');
				top.className += ' ' + 'zoomOut';

				setTimeout(function(){

					self.preloader.style.opacity = 0;

					setTimeout(function(){
						self.preloader.style.display = 'none';
					}, 800);

					self.showContent();

				}, 1000);

			}, 3000);

		},

		showContent: function(){

			var self = this;

			self.body.className += ' loaded';
			self.setDefaultActivePanel();

		},

		setDefaultActivePanel: function(){

			document.getElementsByClassName('panel')[0].className += ' ' + 'active';

		},

		run: function(){

			var self = this;
			var imagesLoaded = window.imagesLoaded || false;

			imagesLoaded(self.container, function() {

				self.removePreloaderAnim();

			});

		}

	};

	imagePreloader.run();


}, false);