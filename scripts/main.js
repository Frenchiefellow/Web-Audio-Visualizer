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
	var startTime;
	var paused;
	var sampleSize = 2048;
	var X = 60,
	    spacing = Math.floor(window.innerWidth / X),
	    Y = 1;
	var song = false;
	var container, stats;
	var camera, scene, renderer;

	var particles, particle, count = 0;

	var mouseX = 0,
	    mouseY = 0;

	var windowHalfX = window.innerWidth / 2;
	var windowHalfY = window.innerHeight / 2;


	$(document).ready(function() {
		mode = $('#mode :selected').val();
		$( 'body' ).css("background-color", "black" );
	    initialize();
	});

	function initialize() {
	    supported();
	    init3D();


	    $('body').on('click', '#playArea .btn-danger', function() {
	        stopSong();
	    });

	    $('body').on('click', '#playArea .btn-success', function() {
	        if ($('#playArea').hasClass('original')) {
	            $('#playArea').addClass('slideDown', 1000, slide);
	            if (evented === undefined) {
	                mode = $('#mode :selected').val();
	                songName = $('#songs :selected').val();
	                url = './samples/' + songName;
	                loadSong(url);
	            } else {
	                //alert( evented );
	                reloadDropSong(evented);
	            }
	            song = true;
	            $('#hideDisplay').removeClass('hideMe');

	        } else {
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
	        } else {
	            //alert( evented );
	            reloadDropSong(evented);
	        }

	    });

	    $('#hideDisplay').click(function() {
	        if (!$('#playArea').hasClass('hideMe')) {
	            setTimeout(function() {
	                $("#playArea").addClass("hideMe");
	            }, 1000);
	        } else {
	            setTimeout(function() {
	                $("#playArea").removeClass("hideMe");
	            }, 1000);
	        }
	    });

	    if (song === false) {
	        document.addEventListener('drop', dropSong, false);
	        document.addEventListener('drag', drag, false);
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
	    } catch (e) {
	        alert("GET WEBAUDIO");
	        return;
	    }
	}

	function dropSong(event) {
	    event.stopPropagation();
	    event.preventDefault();


	    $('#playArea').text("loading... (Large Songs May Take a Few Minutes to Load)");

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
	        $('#playArea').text("Cannot Read File...");
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
	    } else {
	        startTime = Date.now();
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
	    document.removeEventListener('drag', drag);
	    animate();


	}

	function drag(evt) {
	    $('#playArea').text("Drop Music here");
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

	function init3D() {
	   
	        container = document.createElement('div');
	        document.body.appendChild(container);

	        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	        camera.position.z = 1000;

	        scene = new THREE.Scene();

	        particles = new Array();

	        var PI2 = Math.PI * 2;

	        var i = 0;
	        var colored = Math.ceil(Math.random() * (255 - X) + 1);

	        for (var ix = 0; ix < X; ix++) {
	            for (var iy = 0; iy < Y; iy++) {
	                recolor = rainbowColors(colored, (X));
	                var material = new THREE.SpriteCanvasMaterial({
	                    color: recolor.toString(),
	                    program: function( context ) {
	                        context.beginPath();
	                        context.arc(0, 0, 0.5, 0, PI2, true);
	                        context.fill();

	                    }

	                });
	                colored++;

	                particle = particles[i++] = new THREE.Sprite(material);
	                particle.position.x = ix * spacing - ((X * spacing) / 2);
	                particle.position.z = iy - ((Y) / 2);
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

	        /*document.addEventListener( 'mousemove', onDocumentMouseMove, false );
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
	            //console.log( data[ix + sampleRate] );
	            if (data[ix + sampleRate] >= 1700)
	                xX = -(100 + 256 - data[ix + sampleRate] * 4 + 800);
	            else if (data[ix + sampleRate] <= 300) {
	                xX = -(+256 - data[ix + sampleRate] * 4 + 250);
	            } else {
	                xX = -(100 + 256 - data[ix + sampleRate] * 4);
	            }

	            particle = particles[i++];
	            particle.position.y = xX;
	            particle.scale.x = particle.scale.y = Math.floor(window.innerWidth / X);

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