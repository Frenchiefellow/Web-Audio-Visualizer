var radius;
var angle = 15 * Math.PI / 180;
var stars = new Array();
var group;
//var geometry;

function spaceInit() {

	X = 500, Y = 1;

	particles = new Array();

	spacing = Math.floor(window.innerWidth / X * .75);
	container = document.createElement('div');
	document.body.appendChild(container);
	radius = (spacing - ((X * spacing) / 2));
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1000;
	scene = new THREE.Scene();
	var sphere2 = new THREE.SphereGeometry(1, 1, 1);
	var sphere = new THREE.SphereGeometry(20, 20, 20);
	/*geometry = new THREE.Geometry();

	var PI2 = Math.PI * 2;
	var color = Math.ceil(Math.random() * (255 - 50) + 1);;
	var colored = rainbowColors(color, Y);
	for (var ix = 0; ix < X; ix++) {
		if (ix % 25 === 0) {
			color -= 25;
			colored = rainbowColors(color, Y)
			radius = radius * 1.4;
		}
		var material = new THREE.MeshBasicMaterial({
			color: colored.toString(),
			program: function(context) {
				context.beginPath();
				context.arc(0, 0, 0.5, 0, PI2, true);
				context.fill();

			}

		});

		particle = particles[ix] = new THREE.Mesh(sphere, material);
		particle.position.x = Math.random() * 2000 - 1000;
		particle.position.y = Math.random() * 2000 - 1000;
		//particle.scale.x = particle.scale.y = 1;
		//geometry.vertices.push( particle.position );
		scene.add(particle);
		angle += 15 * Math.PI / 180;

	}*/
	var material1 = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			program: function(context) {
				context.beginPath();
				context.arc(0, 0, 0.5, 0, PI2, true);
				context.fill();

			}

		});

	for( var h = 0; h < 3; h++){
		particle = particles[h] = new THREE.Mesh(sphere, material1);
		particle.position.x = Math.random() * 10000 - 7500;
		particle.position.y = Math.random() * 3000 - 1000;
		particle.position.z = Math.random() * 3000 - 2000;
		scene.add(particle);
	}


			
	// Random "Stars" in the "sky"
	for (var i = 0; i < 1000; i++) {

		var material = new THREE.MeshDepthMaterial({
			color: 0xffffff,
			program: function(context) {
				context.beginPath();
				context.arc(0, 0, 0.5, 0, PI2, true);
				context.fill();
			}

		});

		particle = stars[i] = new THREE.Mesh(sphere2, material);
		particle.position.x = Math.random() * 2000 - 1000;
		particle.position.y = Math.random() * 2000 - 1000;
		particle.position.z = Math.random() * 2000 - 1000;
		particle.scale.x = particle.scale.y = 1;
		//geometry.vertices.push( particle.position );
		scene.add(particle);
	}


	//planetLoader();
	sunLoader();

	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
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

function spaceRender() {
	var data = new Uint8Array(sampleSize);
	analysizer.getByteFrequencyData(data);
	angle = 15 * Math.PI / 180;
	var sampleRate = Math.floor(sampleSize / X);
	radius = (spacing - ((X * spacing) / 2));
	camera.position.x += (mouseX - camera.position.x) * .05;
	camera.position.y += (-mouseY - camera.position.y) * .05;
	camera.lookAt(scene.position);
	var currentSeconds = Date.now();
	/*var multiple = 0;
	for (var ix = 0; ix < X; ix++) {
		if (ix % 25 === 0)
			multiple++;
		val = data[ix + sampleRate] * multiple;
		if (ix % 26 === 0)
			radius = radius * 1.4;
		particles[ix].position.x = (val ) * Math.cos(angle);
		particles[ix].position.y = (val ) * Math.sin(angle);
		angle += 15 * Math.PI / 180;
	}*/
	camera.rotation.x = Math.sin(currentSeconds * 0.0005) * 0.2;
	camera.rotation.y = Math.sin(currentSeconds * 0.0003) * 0.2;
	camera.rotation.z = Math.sin(currentSeconds * 0.0003) * 0.8;

	renderer.render(scene, camera);
}

function sunLoader() {
	var textureFlare0 = THREE.ImageUtils.loadTexture("./three/examples/textures/lensflare/lensflare0.png");
	var textureFlare3 = THREE.ImageUtils.loadTexture("./three/examples/textures/lensflare/lensflare3.png");

	addLight(0.08, 0.8, 0.5, 0, 0, -1000, textureFlare0, textureFlare3);

}


function addLight(h, s, l, x, y, z, textureFlare0, textureFlare3) {

		var light = new THREE.PointLight(0xffffff, 1.5, 4500);
		light.color.setHSL(h, s, l);
		light.position.set(x, y, z);
		scene.add(light);

		var flareColor = new THREE.Color(0xffffff);
		flareColor.setHSL(h, s, l + 0.5);

		var lensFlare = new THREE.LensFlare(textureFlare0, 700, 0.0, THREE.AdditiveBlending, flareColor);

		lensFlare.add(textureFlare3, 60, 0.6, THREE.AdditiveBlending);
		lensFlare.add(textureFlare3, 70, 0.7, THREE.AdditiveBlending);
		lensFlare.add(textureFlare3, 120, 0.9, THREE.AdditiveBlending);
		lensFlare.add(textureFlare3, 70, 1.0, THREE.AdditiveBlending);

		lensFlare.customUpdateCallback = lensFlareUpdateCallback;
		lensFlare.position.copy(light.position);

		scene.add(lensFlare);
	}

function lensFlareUpdateCallback(object) {

	var f, fl = object.lensFlares.length;
	var flare;
	var vecX = -object.positionScreen.x * 2;
	var vecY = -object.positionScreen.y * 2;

	for (f = 0; f < fl; f++) {

		flare = object.lensFlares[f];

		flare.x = object.positionScreen.x + vecX * flare.distance;
		flare.y = object.positionScreen.y + vecY * flare.distance;

		flare.rotation = 0;

	}

	object.lensFlares[2].y += 0.025;
	object.lensFlares[3].rotation = object.positionScreen.x * 0.5 + THREE.Math.degToRad(45);

}