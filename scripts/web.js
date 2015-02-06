var radius;
var angle = 15 * Math.PI / 180;
var stars = new Array();
var group;

function webInit() {

	X = 500, Y = 1;

	particles = new Array(X);
	for (var i = 0; i < X; i++) {
		particles[i] = new Array();
	}

	spacing = Math.floor(window.innerWidth / X * .75);
	container = document.createElement('div');
	document.body.appendChild(container);
	radius = (spacing - ((X * spacing) / 2));
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1000;
	scene = new THREE.Scene();
	var PI2 = Math.PI * 2;
	var color = Math.ceil(Math.random() * (255 - 50) + 1);;
	var colored = rainbowColors(color, Y)
	var geometry = new THREE.Geometry();
	for (var ix = 0; ix < X; ix++) {
		for (var iy = 0; iy < Y; iy++) {
			if (ix % 25 === 0) {
				color -= 25;
				colored = rainbowColors(color, Y)
				radius = radius * 1.25;
			}
			var material = new THREE.SpriteCanvasMaterial({
				color: colored.toString(),
				program: function(context) {
					context.beginPath();
					context.arc(0, 0, 0.5, 0, PI2, true);
					context.fill();

				}

			});

			particle = particles[ix][iy] = new THREE.Sprite(material);

			particle.position.x = ix + radius * Math.cos(angle);
			particle.position.y = iy + radius * Math.sin(angle);
			particle.position.z = iy - ((Y) / 2);
			particle.scale.x = particle.scale.y = 18;

			scene.add(particle);
			geometry.vertices.push(particle.position);
			angle += 15 * Math.PI / 180;

		}

	}

	var lines = new THREE.Line(geometry, new THREE.LineBasicMaterial({
		color: 0xffffff,
		opacity: 0.5
	}));
	scene.add(lines);

	// Random "Stars" in the "sky"
	for (var i = 0; i < 1000; i++) {

		var material = new THREE.SpriteCanvasMaterial({
			color: 0xffffff,
			program: function(context) {
				context.beginPath();
				context.arc(0, 0, 0.5, 0, PI2, true);
				context.fill();
			}

		});

		particle = stars[i] = new THREE.Sprite(material);
		particle.position.x = Math.random() * 2000 - 1000;
		particle.position.y = Math.random() * 2000 - 1000;
		particle.position.z = Math.random() * 2000 - 1000;
		particle.scale.x = particle.scale.y = 1;
		scene.add(particle);
	}

	group = new THREE.Group();
	scene.add(group);

	//planetLoader();

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

function webRender() {
	var data = new Uint8Array(sampleSize);
	analysizer.getByteFrequencyData(data);
	angle = 15 * Math.PI / 180;
	var sampleRate = Math.floor(sampleSize / X);
	radius = (spacing - ((X * spacing) / 2));
	camera.position.x += (mouseX - camera.position.x) * .05;
	camera.position.y += (-mouseY - camera.position.y) * .05;
	camera.lookAt(scene.position);

	for (var ix = 0; ix < X; ix++) {
		for (var iy = 0; iy < Y; iy++) {
			val = data[ix + sampleRate] / 1000;
			if (ix % 26 === 0)
				radius = radius * 1.25;
			particles[ix][iy].position.x = (val * radius) * Math.cos(angle);
			particles[ix][iy].position.y = (val * radius) * Math.sin(angle);
			angle += 15 * Math.PI / 180;
		}
	}

	var currentSeconds = Date.now();
	camera.rotation.x = Math.sin(currentSeconds * 0.0005) * 0.2;
	camera.rotation.y = Math.sin(currentSeconds * 0.0003) * 0.2;
	camera.rotation.z = Math.sin(currentSeconds * 0.0003) * 0.8;

	renderer.render(scene, camera);
}

function planetLoader() {
	var earthLoader = new THREE.TextureLoader();
	earthLoader.load('./three/examples/textures/planets/earth_atmos_2048.jpg', function(texture) {

		var geometry = new THREE.SphereGeometry(20, 20, 20);
		var material = new THREE.MeshBasicMaterial({
			map: texture,
			overdraw: 0.5
		});
		var mesh = new THREE.Mesh(geometry, material);
		mesh.position.x = Math.random() * 2000 - 1000;
		mesh.position.y = Math.random() * 2000 - 1000;
		while (mesh.position.x < 100 || mesh.position.y < 100) {
			mesh.position.x = Math.random() * 2000 - 1000;
			mesh.position.y = Math.random() * 2000 - 1000;
		}
		group.add(mesh);

	});
}