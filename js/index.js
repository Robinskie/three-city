// Canvas element
const canvas = document.querySelector('.webgl');

// Resize canvas
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/* INIT */
// Scene aanmaken
const scene = new THREE.Scene();

// Renderer
const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true});
renderer.shadowMap.enabled = true;
renderer.setSize(canvas.width, canvas.height);

// Camera
const fov = 75;
const ratio =  canvas.width / canvas.height;
const camera = new THREE.PerspectiveCamera(fov, ratio, 0.1, 1000);
camera.position.set(5, 2.5, 5);
camera.lookAt(0, 0, 0)
scene.add(camera);

// Lights
const ambientLight = new THREE.AmbientLight('#FFF', 1);

const directionalLight = new THREE.DirectionalLight('#FEF7C2', 0.1);
directionalLight.position.set(25, 25, 25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.top = 50; // limieten van de lights instellen voor performance
directionalLight.shadow.camera.left = -50;
directionalLight.shadow.camera.right = 50;
directionalLight.shadow.camera.bottom = -50;
directionalLight.shadow.mapSize.set(2048, 2048);

// scene.add(new THREE.CameraHelper(directionalLight.shadow.camera)); // helper class

scene.add(ambientLight, directionalLight);

// Textures
const textureLoader = new THREE.TextureLoader();
const texBuilding = textureLoader.load('/images/building.png');

/* OBJECTEN */
// Grond
const groundGeometry = new THREE.PlaneGeometry(1000, 1000); // vorm
const groundMaterial = new THREE.MeshStandardMaterial( // materiaal
    {color: '#E88E5A'}
); 
const ground = new THREE.Mesh(groundGeometry, groundMaterial); // mesh = vorm + materiaal
ground.rotation.x = Math.PI * 1.5; // draaien om horizontaal te krijgen
ground.receiveShadow = true;

scene.add(ground);

// Controls
const controls = new THREE.OrbitControls(camera, canvas);

// Gebouwen
const buildings = [];

createBuilding(3, 8, 3, 0, 0, 0);

function createBuilding(width, height, depth, x, z, rotation) {
    // Mesh opbouwen
    let buildingGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
    let buildingMaterials = [
        new THREE.MeshStandardMaterial({map: texBuilding}),
        new THREE.MeshStandardMaterial({map: texBuilding}),
        new THREE.MeshStandardMaterial({color: '#1B262C'}),
        new THREE.MeshStandardMaterial({map: texBuilding}),
        new THREE.MeshStandardMaterial({map: texBuilding}),
        new THREE.MeshStandardMaterial({map: texBuilding}),
    ]
    let building = new THREE.Mesh(buildingGeometry, buildingMaterials);

    // Grootte
    building.scale.x = width;
    building.scale.y = height;
    building.scale.z = depth;

    // Positie
    building.position.x = x;
    building.position.y = -height / 2;
    building.position.z = z;

    // Rotatie
    building.rotation.y = rotation;

    // Schaduw
    building.castShadow = true;
    building.receiveShadow = true;

    // Aan de array toevoegen
    buildings.push(building);

    // Toevoegen aan de scène
    scene.add(building);
}

// Button click
document.querySelector('.button').addEventListener('click', () => {
    // Random waarden genereren
    let width = Math.random() * 4 + 2;
    let height = Math.random() * 10 + 5;
    let depth = Math.random() * 4 + 2;
    let x = Math.random() * 80 - 40;
    let y = Math.random() * 80 - 40;
    let rotation = Math.random() * Math.PI;

    // Toevoegen
    createBuilding(width, height, depth, x, y, rotation)
});

const clock = new THREE.Clock();

// Update functie
function animate() {
    // Delta time is de tijd sinds vorige frame
    let delta = clock.getDelta();

    // animate gebouwen
    buildings.forEach(building => {
        if(building.position.y < building.scale.y / 2)
            building.position.y += 0.25;
    });

    // Render
	renderer.render( scene, camera );
    requestAnimationFrame( animate );
}
animate();