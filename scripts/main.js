	var songName;
	var url;
	var mode;
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
	var X = 60,
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

	$(document).ready(function() {
		mode = $('#mode :selected').val();
		$('body').css("background-color", "black");
		initialize();
	});

	function initialize() {
		supported();
		init3D(X);

		$('body').on('click', '#playArea .btn-danger', function() {
			stopSong();
		});

		$('body').on('click', '#playArea .btn-success', function() {
			if ($('#playArea').hasClass('original')) {
				$('#playArea').addClass('slideDown', 1000, slide);
				$('.banner').css( "display", "none");
				$('.bottomBanner').css( "display", "none");
				if (evented === undefined) {

					mode = $('#mode :selected').val();
					songName = $('#songs :selected').val();
					url = './samples/' + songName;
					loadSong(url);
				}
				else {
					//alert( evented );
					reloadDropSong(evented);
				}
				song = true;
				$('#hideDisplay').removeClass('hideMe');
				$('.banner').css( "display", "none");
				$('.bottomBanner').css( "display", "none");

			}
			else {
				$('.banner').css( "display", "none");
				$('.bottomBanner').css( "display", "none");
				mode = $('#mode :selected').val();
				songName = $('#songs :selected').val();
				url = './samples/' + songName;
				loadSong(url);
				song = true;
			}

		});

		$('body').on('click', '#playArea .btn-info', function() {
			if (evented === undefined) {
				//alert( evented );

				url = './samples/' + songName;
				loadSong(url);
			}
			else {
				//alert( evented );
				reloadDropSong(evented);
			}

		});

		$('#hideDisplay').click(function() {
			if (!$('#playArea').hasClass('hideMe')) {
				setTimeout(function() {
					$("#playArea").addClass("hideMe");
					$('#timer').addClass("hideMe");
				}, 500);
			}
			else {
				setTimeout(function() {
					$("#playArea").removeClass("hideMe");
					$("#timer").removeClass("hideMe");
				}, 500);
			}
		});

		if (song === false) {
			document.addEventListener('drop', dropSong, false);
			document.addEventListener('dragover', drag, false);
		}


		
	}

	function slide() {
		setTimeout(function() {
			$("#playArea").removeClass("original");
		}, 1500);
	}

	function supported() {
		if (!window.WebGLRenderingContext) {
			alert("GET WEBGL FOOL");
			return;
		}

		try {
			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			audioContext = new window.AudioContext();
		}
		catch (e) {
			alert("GET WEBAUDIO");
			return;
		}
	}

	function dropSong(event) {
		event.stopPropagation();
		event.preventDefault();

		$('#playArea').css({
			'border': "",
			'border-radius': ""
		});
		$('.banner').css( "display", "none");
		$('.bottomBanner').css( "display", "none");
		$('#playArea').html("<strong style='font-size: 300%;'>loading...</strong><br>(Large Songs May Take a Few Minutes to Load)<br>");
		var dropped = event.dataTransfer.files;
		evented = dropped;
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			droppedLoader(data);
		};
		reader.readAsArrayBuffer(dropped[0]);
		songName = dropped[0]["name"];
	}

	function reloadDropSong(event) {
		var dropped = event
		var reader = new FileReader();
		reader.onload = function(e) {
			var data = e.target.result;
			droppedLoader(data);
		};
		reader.readAsArrayBuffer(dropped[0]);
		songName = dropped[0]["name"];
	}

	function loadSong(url) {
		var request = new XMLHttpRequest();
		request.open("GET", url, true);
		request.responseType = 'arraybuffer';

		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
				buf = buffer;
				play();
			});
		}
		request.send();
	}

	function droppedLoader(data) {
		context.decodeAudioData(data, function(buffer) {
			buf = buffer;
			play();
			
		}, function(e) {
			$('#playArea').html("<strong style='font-size: 300%;'>Cannot Read File...</strong><br>Reloading in 3 seconds...");
			setTimeout(function() {
				window.location.reload();
			}, 3000);
			console.log(e);
		});
	}

	function play() {
		song = true;
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
		}
		else {
			started = Date.now();
			startTime = Date.now();
			

			var timer = document.createElement('div');
			timer.id = 'timer';
			timer.style.cssText = "color: white; position: absolute; top: 5%; width: 100%; text-align: center;";
			timer.innerHTML = "00:00";
			document.body.appendChild(timer);



			src.start(0);
		}

		$('#playArea').html('');
		var stopButton = document.createElement('p');
		stopButton.id = "stop";
		stopButton.className = "btn btn-danger";
		stopButton.innerHTML = "Stop Playing: " + songName;
		document.getElementById('playArea').appendChild(stopButton);
		if ($('#playArea').hasClass('original')) {
			$('#playArea').addClass('slideDown', 1000, slide);
			$('#hideDisplay').removeClass('hideMe');
		}
		paused = false;
		document.removeEventListener('drop', dropSong);
		document.removeEventListener('dragover', drag);

		var colorLabel = document.createElement('label');
		colorLabel.id = 'colorLabel';
		colorLabel.innerHTML = " Background Color: 0";
		colorLabel.style.cssText = "text-shadow: 2px 2px 0px #000000;";
		document.getElementById('playArea').appendChild(colorLabel);

		var colorSlider = document.createElement('div');
		colorSlider.id = 'slider';
		colorSlider.style.cssText = "text-shadow: 2px 2px 0px #000000;";
		document.getElementById('playArea').appendChild(colorSlider);

		var ballLabel = document.createElement('label');
		ballLabel.id = 'ballLabel';
		ballLabel.innerHTML = " Balls: " + X;
		ballLabel.style.cssText = "text-shadow: 2px 2px 0px #000000;";
		document.getElementById('playArea').appendChild(ballLabel);

		var ballSlider = document.createElement('div');
		ballSlider.id = 'slider2';
		ballSlider.style.cssText = "text-shadow: 2px 2px 0px #000000;";
		document.getElementById('playArea').appendChild(ballSlider);

		

		animate();

	}

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

	function stopSong() {
		src.stop(0);
		pauseTime = Date.now() - startTime;
		paused = true;

		$('#playArea').html('');
		var goButton = document.createElement('p');
		goButton.id = "go";
		goButton.className = "btn btn-info";
		goButton.innerHTML = "Continue Playing?";
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

	function init3D(balls) {

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

	}

	function onWindowResize() {

		windowHalfX = window.innerWidth / 2;
		windowHalfY = window.innerHeight / 2;

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize(window.innerWidth, window.innerHeight);

	}

	//

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

	//

	function animate() {

		requestAnimationFrame(animate);

		render();
		stats.update();

	}

	function render() {
		
		updateTimer( );

		/*if( pauseTime === undefined )
			setTimeout( function( ){
				updateTimer( false );
			}, 1000 );	
		else
			setTimeout( function( ){
				updateTimer( true );
			}, 1000 );	*/


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
				if (balls < X) {
					var count = 0;
					spacing = Math.floor(window.innerWidth /  balls * 1.25);
					for (var i = 0; i < X; i++) {
						scene.remove(particles[i]);
					}

					for (var i = 0; i < balls; i++) {
						initial++;
						finaled = particles[i];;
						finaled.position.x = (i+.5) * spacing - ((balls * spacing) / (2));

						finaled.position.z = 1 - ((Y) / 2);
						finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / (balls));
						scene.add(finaled);

					}

					X = balls;
				}
				else {
					var PI2 = Math.PI * 2;
					spacing = Math.floor(window.innerWidth / balls * 1.25);

					for (var i = 0; i < X; i++) {
						scene.remove(particles[i]);
					}
					if( $( '#slider').slider("value") == 0 ){
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

							finaled.position.x = (i+.5) * spacing - ((( balls) *  spacing) / 2 );

							finaled.position.z = 1 - ((Y) / 2);
							finaled.scale.x = finaled.scale.y = Math.floor(window.innerWidth / balls);
							scene.add(finaled);
						}
					}else{
						for (var i = 0; i < balls; i++) {
							initial++;

							finaled = particles[i];
							finaled.position.x = (i+.5) * spacing - (((balls) * spacing) / 2 );

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
				//alert( ui.value);
				if (ui.value <= 50 && ui.value > 0) {
					r = 255;
					g = Math.round(255 * ui.value / 50);
					b = 0;
				}
				else if (ui.value > 51) {
					r = Math.round(255 * (100 - ui.value) / 50);
					g = r;
					b = Math.round(255 * (ui.value - 50) / 50);
				}
				else {
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
				}
				else {
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
		var data = new Uint8Array(sampleSize);
		analysizer.getByteFrequencyData(data);

		var sampleRate = Math.floor(sampleSize / Math.max(X, Y));

		camera.position.x += (mouseX - camera.position.x) * .05;
		camera.position.y += (-mouseY - camera.position.y) * .05;
		camera.lookAt(scene.position);

		var i = 0;

		for (var ix = 0; ix < X; ix++) {

			for (var iy = 0; iy < Y; iy++) {
				var xX = -(100 + 256 - data[ix + sampleRate] * 4);

				particle = particles[i++];

				particle.position.y = xX;

			}

		}

		renderer.render(scene, camera);

		count += 0.1;

	}

	function rainbowColors(n, step) {
		var i = (n * 255 / step);
		var r = Math.round(Math.sin(0.024 * i + 0) * 127 + 128);
		var g = Math.round(Math.sin(0.024 * i + 2) * 127 + 128);
		var b = Math.round(Math.sin(0.024 * i + 4) * 127 + 128);

		return 'rgb(' + r + ',' + g + ',' + b + ')';

	};

	function invertRGB(color) {
		var v1 = color.split("rgb(");
		var v2 = v1[1].split(")");
		var finalV = v2[0].split(",");
		var r = 255 - finalV[0];
		var g = 255 - finalV[1];
		var b = 255 - finalV[2];
		return "rgb(" + r + ',' + g + ',' + b + ')';

	}

	function updateTimer( ){
		
			setInterval(function() {
			if( paused === false ){
				var totalSec = (new Date - started) / 1000;
				var min = Math.floor( totalSec / 60 );
				var sec =  totalSec % 60;
	    		$('#timer').text(("0" + min).slice(-2) + ":" + ("0" + sec.toFixed( 0 )).slice( -2 ) );
    		}
    		else{
    			started = new Date - pauseTime;
    		}

			}, 1000);
	}


