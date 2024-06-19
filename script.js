console.clear();

let camera, scene, renderer, clock;
let uniforms;
	
function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function init() {
	const container = document.getElementById("shadercollab");

	clock = new THREE.Clock();
	camera = new THREE.Camera();
	camera.position.z = 1;

	scene = new THREE.Scene();

	const geometry = new THREE.PlaneBufferGeometry(2, 2);
	const codeArea = document.getElementById("code")
		
	let fullCode = codeArea.value
	
	uniforms = {
		u_time: { type: "f", value: 1.0 },
		u_resolution: { type: "v2", value: new THREE.Vector2() },
		u_mouse: { type: "v2", value: new THREE.Vector2() },
	};

	const material = new THREE.ShaderMaterial({
		uniforms,
		vertexShader: document.getElementById("vertex").textContent,
		fragmentShader: fullCode
	});

	String.prototype.replaceAt = function(startIndex, endIndex, replacement) {
    	return this.substring(0, startIndex) + replacement + this.substring(endIndex + replacement.length - 3);
}
	
	/*let resultingCode;
	codeArea.addEventListener('click', (e) => {
		const clickedCharacter = codeArea.selectionStart - 2
		const codeAfterClick = codeArea.value.slice(clickedCharacter, clickedCharacter + 4)
		const dotOffset = codeAfterClick.indexOf('.')
		if (dotOffset == -1) {
			return
		}
		const beginningOfFloat = clickedCharacter + dotOffset - 1
		const endOfFloat = beginningOfFloat + 3
		const floatString = codeArea.value.slice(beginningOfFloat, endOfFloat)
		// console.log('string', floatString)
		if (!floatString.match(/\d\.\d/)) {
			return
		}
		const randomFloat = getRandomArbitrary(0, 1).toFixed(1);

		resultingCode = codeArea.value.replaceAt(beginningOfFloat, endOfFloat, randomFloat)
		codeArea.value = resultingCode
		
		const newCode = resultingCode
		
		material.fragmentShader = newCode;
		material.needsUpdate = true;
		// console.log(floatString)
		// console.log('string', codeAfterClick.indexOf('.'));
	});*/
	
	codeArea.addEventListener('input', (e) => {
		fullCode = codeArea.value
		
		material.fragmentShader = fullCode;
		material.needsUpdate = true;
	});
	
	document.getElementById("dice").onclick = () => {
		randomizeAllNumbers(material)
	}

	const mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);

	container.appendChild(renderer.domElement);
	
	onWindowResize();
	window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	renderer.setSize(window.innerWidth, window.innerHeight);
	uniforms.u_resolution.value.x = renderer.domElement.width;
	uniforms.u_resolution.value.y = renderer.domElement.height;
}

function render() {
	uniforms.u_time.value = clock.getElapsedTime();
	renderer.render(scene, camera);
}

function animate() {
	render();
	requestAnimationFrame(animate);
}

function randomizeAllNumbers(material) {
	const codeArea = document.getElementById("code")
	codeArea.value = codeArea.value.replaceAll(/\d+\.\d/g, function(match, contents, offsets, is) {
		let numberOfDigits = match.length - 2
		
		let lowerBound = 0
		let upperBound = 1
		
		let number = parseFloat(match)
		
		if (number <= 1.0) {
			lowerBound = 0.1
			upperBound = 1.0
		} else {
			lowerBound = Math.pow(10, numberOfDigits-1)
			upperBound = Math.pow(10, numberOfDigits) - 1
		}
		
		return getRandomArbitrary(lowerBound, upperBound).toFixed(1)		
	})
	const code = codeArea.value
	const newCode = code
	material.fragmentShader = newCode;
	material.needsUpdate = true;
}

init();
animate();