

function customInit() {
	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
	camera.position.z = 1000;

	scene = new THREE.Scene();

	var PI2 = Math.PI * 2;
	var colored = Math.ceil(Math.random() * (255 - X) + 1);

	// New stuff here.


	renderer = new THREE.CanvasRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	var canvasColor = '#000000';
	renderer.setClearColor(canvasColor, 1);
	container.appendChild(renderer.domElement);

	stats = new Stats();
	stats.domElement.style.position = 'absolute';
	stats.domElement.style.top = '0px';
	container.appendChild(stats.domElement);

	/*document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);*/

	window.addEventListener('resize', onWindowResize, false);
}

function customRender( ) {
		var data = new Uint8Array(sampleSize);
		analysizer.getByteFrequencyData(data);

		var sampleRate = Math.floor(sampleSize / Math.max(X, Y));

	

		renderer.render(scene, camera);


}

