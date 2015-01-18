function partyInit(){
			
			X = 25, Y = 25;
			spacing = Math.floor(window.innerWidth / X * 1.25);
			container = document.createElement('div');
			document.body.appendChild(container);

			camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
			camera.position.z = 1000;

			scene = new THREE.Scene();


			for (var ix = 0; ix < X; ix++) {
				for (var iy = 0; iy < Y; iy++) {
					
					var material = new THREE.SpriteCanvasMaterial({
						color: "rgb(250, 0, 0)",
						program: function(context) {
							context.beginPath();
							context.rect(0, 0 , (window.innerWidth / X), window.innerHeight / (Y*2));
							context.fill();
							


						}

					});
				

					particle = particles[ix][iy] = new THREE.Sprite(material);
					particle.position.x = ix * spacing - ((X * spacing) / 2);
					particle.position.y = -600 + (50*iy);
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

			/* document.addEventListener( 'mousemove', onDocumentMouseMove, false );
				document.addEventListener( 'touchstart', onDocumentTouchStart, false );
				document.addEventListener( 'touchmove', onDocumentTouchMove, false );*/

			window.addEventListener('resize', onWindowResize, false);
}

function partyRender(){
		var data = new Uint8Array(sampleSize);
		analysizer.getByteFrequencyData(data);

		var sampleRate = Math.floor(sampleSize / X);

		camera.position.x += (mouseX - camera.position.x) * .05;
		camera.position.y += (-mouseY - camera.position.y) * .05;
		camera.lookAt(scene.position);

		renderer.render(scene, camera);
}