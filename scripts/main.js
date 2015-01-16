	var songName;
	var url;
	var mode = 'balls';
	var context = new AudioContext();
	var buf;
	var src;
	var evented;
	var analysizer;
	var array;
	var pauseTime;
	var startTime, started;
	var paused;
	var sampleSize = 2048;
	var X = 128,
		spacing = Math.floor(window.innerWidth / X * 1.25),
		Y = 1;
	var song = false;
	var container, stats;
	var camera, scene, renderer;

	var particles, particle, count = 0;

	var mouseX = 0,
		mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;

	var canvasColored = "00000";
	var intial;
	var parts, finaled;
	var isColored;
	var infinityMode = false;
	var count = 0;
	var randBalls;

	$(document).ready(function() {
		$('body').css("background-color", "black");
		initialize();
	});

	function initialize() {

		colorBanner();
		supported();
		//init3D(X);

		// Pause Button Functionality
		$('body').on('click', '#playArea .stopButton', function() {
			stopSong();
			$('#infinity').addClass('hideMe');
		});

		//Play Button Functionality (From Splash Screen)
		$('body').on('click', '#playArea .btn-success', function() {
			init3D(X, mode);
			if ($('#playArea').hasClass('original')) {

				if (mode === 'balls')
					$('#playArea').addClass('slideDown', 1000, slide);
				else {
					$('#playArea').css("display", "none");

				}

				$('.banner').css("display", "none");
				$('.bottomBanner').css("display", "none");
				if (evented === undefined) {
					songName = $('#songs :selected').val();
					url = './samples/' + songName;
					loadSong(url);
				} else {
					reloadDropSong(evented);
				}
				song = true;
				$('#hideDisplay').removeClass('hideMe');
				$('.banner').css("display", "none");
				$('.bottomBanner').css("display", "none");

			} else {
				$('.banner').css("display", "none");
				$('.bottomBanner').css("display", "none");
				songName = $('#songs :selected').val();
				url = './samples/' + songName;
				loadSong(url);
				song = true;
			}

		});

		// Continue Button Functionality (Currently bugged: Seems to double animate/Increases FPS x2)
		$('body').on('click', '#playArea .btn-info', function() {
			if ($('.menuContainer').html() === "") {
				$('.menuContainer').load('./partials/sideMenuButton.html');
				$('.menuContainer2').load('./partials/sideMenu.html');
			}
			if (evented === undefined) {
				url = './samples/' + songName;
				loadSong(url);
			} else {
				reloadDropSong(evented);
			}

		});

		// Hide Display Button Functionality
		$('#hideDisplay').click(function() {
			if (!$('#playArea').hasClass('hideMe')) {
				setTimeout(function() {
					$('#hideDisplay').css('opacity', '.1');
					$("#playArea").addClass("hideMe");
					$('#timer').addClass("hideMe");
					$('#infinity').addClass("hideMe");
					$('#stats').addClass("hideMe");
					$('#show').addClass("hideMe");
					$('.menuContainer2').addClass("hideMe");
				}, 500);
			} else {
				setTimeout(function() {
					$('#hideDisplay').css('opacity', '1');
					$("#playArea").removeClass("hideMe");
					$("#timer").removeClass("hideMe");
					$("#infinity").removeClass("hideMe");
					$("#stats").removeClass("hideMe");
					$('#show').removeClass("hideMe");
					$('.menuContainer2').removeClass("hideMe");
				}, 500);
			}
		});

		// Infinity Mode Button Functionality
		$('body').on('click', '#infinity', function() {
			infinityMode = !infinityMode;
			if (!$('#playArea').hasClass('hideMe')) {
				setTimeout(function() {
					$("#playArea").addClass("hideMe");
					$('#timer').addClass("hideMe");
					$('#hideDisplay').addClass("hideMe");
					$('#stats').addClass("hideMe");
					$('#show').addClass("hideMe");
					$('.menuContainer2').addClass("hideMe");
				}, 500);
			} else {
				setTimeout(function() {
					$("#playArea").removeClass("hideMe");
					$("#timer").removeClass("hideMe");
					$('#hideDisplay').removeClass("hideMe");
					$("#stats").removeClass("hideMe");
					$('#show').removeClass("hideMe");
					$('.menuContainer2').removeClass("hideMe");
				}, 500);
				$('#ballLabel').text("Balls: " + randBalls);
			}

		});

		// Disables ability to drag new song into canvas while a song is playing/loaded
		if (song === false) {
			document.addEventListener('drop', dropSong, false);
			document.addEventListener('dragover', drag, false);
		}

	}

	// Class for animating "slide" of information on Splash to Canvas transition
	function slide() {
		setTimeout(function() {
			$("#playArea").removeClass("original");
		}, 1000);
		$("#playArea").css({
			"background-color": "rgba(119,119,119,0.15)",
			"border-top": "1px solid rgba(119,119,119,0.5)",
			"z-index": "0"
		});
		$("#currentSongName").css({
			"border": "1px solid rgba(119,119,119,0.5)",
			"background-color": "rgba(136,136,136,0.2)"
		});

	}

	// Checks for WEBGL/Web Audio API incompatibilities
	function supported() {
		if (!window.WebGLRenderingContext) {
			alert("GET WEBGL FOOL");
			return;
		}

		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			audioContext = new window.AudioContext();
		} catch (e) {
			alert("GET WEBAUDIO");
			return;
		}
	}

	// Functionality for Dropping a Song onto the page
	function dropSong(event) {
		event.stopPropagation();
		event.preventDefault();

		$('#playArea').css({
			'border': "",
			'border-radius': ""
		});
		$('.banner').css("display", "none");
		$('.bottomBanner').css("display", "none");
		init3D(X, mode);
		$('#playArea').html("<strong style='font-size: 300%;'>loading...</strong><br>(Large Songs May Take a Few Minutes to Load)<br>");
		var dropped = event.dataTransfer.files;
		evented = dropped;
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			droppedLoader(data, 0);
		};
		reader.readAsArrayBuffer(dropped[0]);
		songName = dropped[0]["name"];
	}

	// Reloads Previously "dropped" song on Resume
	function reloadDropSong(events) {
		var dropped = events;
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			droppedLoader(data, 1);
		};
		reader.readAsArrayBuffer(dropped[0]);
		songName = dropped[0]["name"];

	}

	// Loads song from Url (local location) and queues Play()
	function loadSong(url) {
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
				buf = buffer;
				play(0);
			});
		}
		request.send();
	}

	// Loads song from "drop" and queues Play()
	function droppedLoader(data, val) {
		context.decodeAudioData(data, function(buffer) {
			buf = buffer;
			play(val);

		}, function(e) {
			$('#playArea').html("<strong style='font-size: 300%;'>Cannot Read File...</strong><br>Reloading in 3 seconds...");
			setTimeout(function() {
				window.location.reload();
			}, 3000);
			console.log(e);
		});

	}

	// Functionality for Playing the song 
	function play(val) {
		song = true;
		passed = false;
		src = context.createBufferSource();
		src.buffer = buf;

		analysizer = context.createAnalyser();
		analysizer.fftSize = sampleSize;

		src.connect(analysizer);
		analysizer.connect(context.destination);
		src.loop = true;

		if (paused) {
			startTime = Date.now() - pauseTime;
			src.start(0, pauseTime / 1000);
		} else {
			started = Date.now();
			startTime = Date.now();
			src.start(0);

		}

		$('#playArea').html('');

		if ($('#playArea').hasClass('original')) {
			if (mode === 'balls') {
				$('#playArea').addClass('slideDown', 1000, slide);
			} else {
				$('#playArea').css("display", "none");

			}

			$('#hideDisplay').removeClass('hideMe');
		}

		paused = false;
		document.removeEventListener('drop', dropSong);
		document.removeEventListener('dragover', drag);

		if (mode === 'balls') {

			var stopButton = document.createElement('div');
			stopButton.id = "stopButton";
			stopButton.className = "stopButton";
			stopButton.innerHTML = "&#9616;&#9616;";
			stopButton.title = "Click to Pause Current Song!"
			document.getElementById('playArea').appendChild(stopButton);

			var nowPlaying = document.createElement("div");
			nowPlaying.id = 'nowPlaying';
			nowPlaying.innerHTML = "Now Playing:";
			$("#playArea").append(nowPlaying);

			var currentSongName = document.createElement('marquee');
			currentSongName.id = "currentSongName";
			currentSongName.className = "CurrentSongName";
			currentSongName.innerHTML = songName;
			document.getElementById('playArea').appendChild(currentSongName);

			if (val === 1) {
				$("#currentSongName").css({
					"border": "1px solid rgba(119,119,119,0.5)",
					"background-color": "rgba(136,136,136,0.2)"
				});
			}

			var colorLabel = document.createElement('label');
			colorLabel.id = 'colorLabel';
			colorLabel.innerHTML = " Background Color: 0";
			colorLabel.style.cssText = "text-shadow: 2px 2px 0px #000000; font-size: 100%;";
			$('.backColor').append(colorLabel);

			var colorSlider = document.createElement('div');
			colorSlider.id = 'slider';
			colorSlider.style.cssText = "text-shadow: 2px 2px 0px #000000;";
			$('.backColor').append(colorSlider);

			var ballLabel = document.createElement('label');
			ballLabel.id = 'ballLabel';
			ballLabel.innerHTML = " Balls: " + Math.floor(X);
			ballLabel.style.cssText = "text-shadow: 2px 2px 0px #000000; font-size: 100%;";
			$('.ballNum').append(ballLabel);

			var ballSlider = document.createElement('div');
			ballSlider.id = 'slider2';
			ballSlider.style.cssText = "text-shadow: 2px 2px 0px #000000;";
			$('.ballNum').append(ballSlider);

			var infinity = document.createElement('div');
			infinity.id = 'infinity';
			infinity.innerHTML = '&infin;'
			infinity.title = "Click to initiate Infinity Mode!";
			document.body.appendChild(infinity);

		}

		animate();

	}

	// Handles Drag over transitions on Splash
	function drag(evt) {
		$('#playArea').text("Drop Music here");
		$('#playArea').css({
			'border': "1px solid white",
			'border-radius': "5px"
		});
		evt.stopPropagation();
		evt.preventDefault();
		return false;
	}

	// Pauses the song on pause and saves state
	function stopSong() {
		src.stop(0);
		pauseTime = Date.now() - startTime;
		paused = true;

		if (mode === 'balls') {
			$('.menuContainer').empty();
			$('.menuContainer2').empty();
			$('#playArea').html('');

			var goButton = document.createElement('p');
			goButton.id = "go";
			goButton.className = "btn btn-info";
			goButton.innerHTML = "Continue?";
			document.getElementById('playArea').appendChild(goButton);

			var restartButton = document.createElement('p');
			restartButton.id = "restart";
			restartButton.onclick = function() {
				window.location.reload();
			}
			restartButton.className = "btn btn-primary";
			restartButton.innerHTML = "New Song?";
			document.getElementById('playArea').appendChild(restartButton);

		}

	}

	// Initializes Canvas of Objects
	function init3D(balls, mode) {
		$('.menuContainer').css("z-index", "0");
		$('.menuContainer').load('./partials/sideMenuButton.html');
		$('.menuContainer2').load('./partials/sideMenu.html');
		$('.sidr').css('height', '0%');
		if (mode === 'balls') {
			container = document.createElement('div');
			document.body.appendChild(container);

			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
			camera.position.z = 1000;

			scene = new THREE.Scene();

			particles = new Array();

			var PI2 = Math.PI * 2;

			var i = 0;
			var colored = Math.ceil(Math.random() * (255 - X) + 1);

			for (var ix = 0; ix < balls; ix++) {
				for (var iy = 0; iy < Y; iy++) {
					recolor = rainbowColors(colored, (balls));
					var material = new THREE.SpriteCanvasMaterial({
						color: recolor.toString(),
						program: function(context) {
							context.beginPath();
							context.arc(0, 0, 0.5, 0, PI2, true);
							context.fill();

						}

					});
					colored++;
					initial = colored;

					particle = particles[i++] = new THREE.Sprite(material);
					particle.position.x = ix * spacing - ((balls * spacing) / 2);
					particle.position.z = iy - ((Y) / 2);
					particle.scale.x = particle.scale.y = Math.floor(window.innerWidth / X);
					scene.add(particle);

				}

			}

			renderer = new THREE.CanvasRenderer();
			renderer.setSize(window.innerWidth, window.innerHeight);
			var canvasColor = '#000000';
			renderer.setClearColor(canvasColor, 1);
			container.appendChild(renderer.domElement);

			stats = new Stats();
			stats.domElement.style.position = 'absolute';
			stats.domElement.style.top = '0px';
			container.appendChild(stats.domElement);

			/* document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );*/

			window.addEventListener('resize', onWindowResize, false);
		} else if (mode === 'party') {
			partyInit();
		} else {
			particles = new Array();
			customInit();

		}

	}


	// Handles scaling on window resize
	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	// Records mouse positions on Mouse events (hover)
	function onDocumentMouseMove(event) {

		mouseX = event.clientX - windowHalfX;
		mouseY = event.clientY - windowHalfY;

	}

	function onDocumentTouchStart(event) {

		if (event.touches.length === 1) {

			event.preventDefault();

			mouseX = event.touches[0].pageX - windowHalfX;
			mouseY = event.touches[0].pageY - windowHalfY;

		}

	}

	function onDocumentTouchMove(event) {

		if (event.touches.length === 1) {

			event.preventDefault();

			mouseX = event.touches[0].pageX - windowHalfX;
			mouseY = event.touches[0].pageY - windowHalfY;

		}

	}

	// Animates the Canvas
	function animate() {
		requestAnimationFrame(animate);
		render();
		stats.update();

	}

	// Handles rendering of the objects on the Canvas
	function render() {
		if ($('#fpsCheck').prop('checked') == true) {
			$('#stats').addClass('hideMe2');
		} else
			$('#stats').removeClass('hideMe2');

		if ($('#timerCheck').prop('checked') == true) {
			$('#playArea').addClass('hideMe2');
		} else
			$('#playArea').removeClass('hideMe2');

		//updateTimer();
		if (infinityMode === false) {
			if (mode === 'balls') {
				sliders();
				updatePositions();
			} else {
				customRender();

			}
		} else {
			if (Math.floor(count % 3.25) === 0) {
				randBalls = infinityModeFunction();
				updatePositions();
			}
			count++;
		}

		/**Resets balls to "bottom". Not fluid; setTimeout/SetInterval won't work with it
		 * so this'll stay out until I figure it out or I decide to not pursue this anytmore
		 **/

		/*if( paused === true ){
			for( var i = 0; i < X; i++){
				particles[i].position.y =  -(100 + 256);
			}
			renderer.render(scene, camera);
		}*/

	}

	// Updates the position of the canvas objects with the song
	function updatePositions() {

		var data = new Uint8Array(sampleSize);
		analysizer.getByteFrequencyData(data);

		var sampleRate = Math.floor(sampleSize / Math.max(X, Y));

		camera.position.x += (mouseX - camera.position.x) * .05;
		camera.position.y += (-mouseY - camera.position.y) * .05;
		camera.lookAt(scene.position);

		var i = 0;

		for (var ix = 0; ix < X; ix++) {

			for (var iy = 0; iy < Y; iy++) {
				var xX;
				if (!$('#playArea').hasClass('hideMe') && !$('#playArea').hasClass('hideMe2'))
					xX = -(100 + 256 - data[ix + sampleRate] * 4);
				else
					xX = -(600 - data[ix + sampleRate] * 4);

				particle = particles[i++];

				particle.position.y = xX;

			}

		}

		renderer.render(scene, camera);

	}

	// Produces the next RGB color value for any given color (recursion returns a gradient)
	function rainbowColors(n, step) {
		var i = (n * 255 / step);
		var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
		var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
		var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);

		return 'rgb(' + r + ',' + g + ',' + b + ')';

	};

	// Returns inverted RGB value of input
	function invertRGB(color) {
		var v1 = color.split("rgb(");
		var v2 = v1[1].split(")");
		var finalV = v2[0].split(",");
		var r = 255 - finalV[0];
		var g = 255 - finalV[1];
		var b = 255 - finalV[2];
		return "rgb(" + r + ',' + g + ',' + b + ')';

	}

	// Updates the song time (REMOVED from current version)
	function updateTimer() {

		setInterval(function() {
			if (paused === false) {
				var totalSec = (new Date - started) / 1000;
				var min = Math.floor(totalSec / 60);
				var sec = totalSec % 60;
				$('#timer').text(("0" + min).slice(-2) + ":" + ("0" + sec.toFixed(0)).slice(-2));
			} else {
				started = new Date - pauseTime;
			}

		}, 1000);
	}

	// Handles the colorization of the title on the Splash Screen
	function colorBanner() {
		var childrens = $("ul li").size();
		var oneColor = Math.ceil(Math.random() * (255 - childrens) + 1)
		var reColorMe

		for (var i = 0; i <= childrens; i++) {
			if (i !== 4) {
				reColorMe = rainbowColors(oneColor, childrens);
				$('ul li:nth-child(' + i + ')').css("color", reColorMe);
				oneColor++;
			}
		}

	}

	// Handles functionality of the sliders on the menu
	function sliders() {
		var v = X;

		$('#slider2').slider({
			value: v
		});
		$('#slider2').slider({
			min: 4,
			max: 500,
			slide: function(event, ui) {
				$('#ballLabel').text("Balls: " + ui.value);

				var balls = ui.value;

				console.log(balls);

				if (balls < X) {
					var count = 0;
					spacing = Math.floor(window.innerWidth / balls * 1.25);
					for (var i = 0; i < X; i++) {
						scene.remove(particles[i]);
					}

					for (var i = 0; i < balls; i++) {
						initial++;
						finaled = particles[i];;
						finaled.position.x = (i + .5) * spacing - ((balls * spacing) / (2));

						finaled.position.z = 1 - ((Y) / 2);
						finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / (balls));
						scene.add(finaled);

					}

					X = balls;
				} else {
					var PI2 = Math.PI * 2;
					spacing = Math.floor(window.innerWidth / balls * 1.25);

					for (var i = 0; i < X; i++) {
						scene.remove(particles[i]);
					}
					if ($('#slider').slider("value") == 0) {
						for (var i = 0; i < balls; i++) {

							recolor = rainbowColors(initial, (X + balls));
							var material = new THREE.SpriteCanvasMaterial({
								color: recolor.toString(),
								program: function(context) {
									context.beginPath();
									context.arc(0, 0, 0.5, 0, PI2, true);
									context.fill();

								}

							});
							initial++;
							finaled = particles[i] = new THREE.Sprite(material);

							finaled.position.x = (i + .5) * spacing - (((balls) * spacing) / 2);

							finaled.position.z = 1 - ((Y) / 2);
							finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / balls);
							scene.add(finaled);
						}
					} else {
						for (var i = 0; i < balls; i++) {
							initial++;

							finaled = particles[i];
							finaled.position.x = (i + .5) * spacing - (((balls) * spacing) / 2);

							finaled.position.z = 1 - ((Y) / 2);
							finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / balls);
							scene.add(finaled);
						}
					}
					X = balls;
				}

			}

		});

		$('#slider').slider({
			change: function(event, ui) {
				var r, g, b;
				if (ui.value <= 50 && ui.value > 0) {
					r = 255;
					g = Math.round(255 * ui.value / 50);
					b = 0;
				} else if (ui.value > 51) {
					r = Math.round(255 * (100 - ui.value) / 50);
					g = r;
					b = Math.round(255 * (ui.value - 50) / 50);
				} else {
					r = 0;
					g = 0;
					b = 0;
				}
				var newColor = "rgb(" + r + ", " + g + ", " + b + ")";
				renderer.setClearColor(newColor, 1);
				$('#colorLabel').text("Background Color: " + ui.value);
				if (ui.value !== 0) {

					for (var i = 0; i < X; i++) {
						particles[i].material.color.set(invertRGB(newColor));
					}
				} else {
					var col = Math.ceil(Math.random() * (255 - X) + 1);
					var recol;
					for (var i = 0; i < X; i++) {
						recol = rainbowColors(col, (X));

						particles[i].material.color.set(recol);
						col++;
					}
				}
			}
		});
	}

	// Functionality of Infinity Mode 
	function infinityModeFunction() {
		var rand = (Math.random() * 200) + 70;
		var balls = rand;

		if (balls < X) {
			var count = 0;
			spacing = Math.floor(window.innerWidth / balls * 1.25);
			for (var i = 0; i < X; i++) {
				scene.remove(particles[i]);
			}

			for (var i = 0; i < balls; i++) {
				initial++;
				finaled = particles[i];;
				finaled.position.x = (i + .5) * spacing - ((balls * spacing) / (2));

				finaled.position.z = 1 - ((Y) / 2);
				finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / (balls));
				scene.add(finaled);

			}

			X = balls;
		} else {
			var PI2 = Math.PI * 2;
			spacing = Math.floor(window.innerWidth / balls * 1.25);

			for (var i = 0; i < X; i++) {
				scene.remove(particles[i]);
			}
			if ($('#slider').slider("value") == 0) {
				for (var i = 0; i < balls; i++) {

					recolor = rainbowColors(initial, (X + balls));
					var material = new THREE.SpriteCanvasMaterial({
						color: recolor.toString(),
						program: function(context) {
							context.beginPath();
							context.arc(0, 0, 0.5, 0, PI2, true);
							context.fill();

						}

					});
					initial++;
					finaled = particles[i] = new THREE.Sprite(material);

					finaled.position.x = (i + .5) * spacing - (((balls) * spacing) / 2);

					finaled.position.z = 1 - ((Y) / 2);
					finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / balls);
					scene.add(finaled);
				}
			} else {
				for (var i = 0; i < balls; i++) {
					initial++;

					finaled = particles[i];
					finaled.position.x = (i + .5) * spacing - (((balls) * spacing) / 2);

					finaled.position.z = 1 - ((Y) / 2);
					finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / balls);
					scene.add(finaled);
				}
			}
			X = balls;
		}
		return Math.floor(rand);

	}

	// Returns the mode to be performed.
	function modeDetect(value) {
		return mode = value;
	}