import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import * as gsap from 'gsap'

//PARTS OF AN THREE JS

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
)

const renderer = new THREE.WebGL1Renderer()

const raycaster = new THREE.Raycaster()

//DAT.GUI

const gui = new dat.GUI()
const world = {
  plane: {
    width: 400,
    height: 400,
    widthSegment: 25,
    heightSegment: 25,
  },
}

const generateplane = () => {
  planemesh.geometry.dispose()
  planemesh.geometry = new THREE.PlaneGeometry(
    world.plane.width,
    world.plane.height,
    world.plane.widthSegment,
    world.plane.heightSegment,
  )

  const { array } = planemesh.geometry.attributes.position

  for (let i = 0; i < array.length; i += 3) {
    const z = array[i + 2]
    array[i + 2] = z + Math.random()
  }

  const colors = []
  for (let i = 0; i < planemesh.geometry.attributes.position.count; i++) {
    colors.push(0, 0.19, 0.4)
  }

  planemesh.geometry.setAttribute(
    'color',
    new THREE.BufferAttribute(new Float32Array(colors), 3),
  )
}

gui.add(world.plane, 'width', 1, 500).onChange(generateplane)
gui.add(world.plane, 'height', 1, 500).onChange(generateplane)
gui.add(world.plane, 'widthSegment', 1, 40).onChange(generateplane)
gui.add(world.plane, 'heightSegment', 1, 40).onChange(generateplane)

renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)

//orbitcontrols

new OrbitControls(camera, renderer.domElement)

//CREATE THE GEOMETRY AND ADD TO CANVAS THROUGH MESS CREATE

//box geometry
const boxGeometery = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x2f7b1e })
const boxmesh = new THREE.Mesh(boxGeometery, material)
//scene.add(boxmesh)
document.body.appendChild(renderer.domElement)

//plane geometry

const planegeomerty = new THREE.PlaneGeometry(300, 300,200, 200)
const planematerial = new THREE.MeshPhongMaterial({
  flatShading: THREE.FlatShading,
  side: THREE.DoubleSide,
  vertexColors: true,
})
const planemesh = new THREE.Mesh(planegeomerty, planematerial)
scene.add(planemesh)
console.log(planemesh)

const { array } = planemesh.geometry.attributes.position
const randomvalues=[];
for (let i = 0; i < array.length; i++) {
 
 if(i%3==0){
  const z = array[i + 2]
  const x = array[i]
  const y = array[i + 1]

  array[i] = x + Math.random() - 0.5
  array[i + 1] = y + Math.random() - 0.5
  array[i + 2] = z + Math.random()
 }
randomvalues.push(Math.random())
}

planemesh.geometry.attributes.position.randomvalues=randomvalues

planemesh.geometry.attributes.position.originalPosition =
  planemesh.geometry.attributes.position.array

//LIGHT TO SEE THE PLANE
const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(0, 0, 1)
scene.add(light)

const lightback = new THREE.DirectionalLight(0xffffff, 1)
lightback.position.set(0, 0, -1)
scene.add(lightback)

//Mouse Hover Effect

const corrdinates = {
  x: undefined,
  y: undefined,
}
let frame=0;
function animate() {
  requestAnimationFrame(animate)
  renderer.render(scene, camera)
frame+=0.01
const {array,originalPosition,randomvalues}=planemesh.geometry.attributes.position;

for (let i = 0; i < array.length; i++) {
  array[i]=originalPosition[i]+Math.cos(frame+ randomvalues[i])*0.007;
  array[i]=originalPosition[i]+Math.sin(frame+ randomvalues[i])*0.007;
  
}
planemesh.geometry.attributes.position.needsUpdate=true;





  raycaster.setFromCamera(corrdinates, camera)
  const intersection = raycaster.intersectObject(planemesh)
  console.log(intersection)
  if (intersection.length > 0) {
    const { color } = intersection[0].object.geometry.attributes

    color.setX(intersection[0].face.a, 0.1)
    color.setY(intersection[0].face.a, 0.5)
    color.setZ(intersection[0].face.a, 1)

    color.setX(intersection[0].face.b, 0.1)
    color.setY(intersection[0].face.b, 0.5)
    color.setZ(intersection[0].face.b, 1)

    color.setX(intersection[0].face.c, 0.1)
    color.setY(intersection[0].face.c, 0.5)
    color.setZ(intersection[0].face.c, 1)

    color.needsUpdate = true

    const intialcolor = {
      r: 0,
      g: 0.19,
      b: 0.4,
    }

    const hovercolor = {
      r: 0.1,
      g: 0.5,
      b: 1,
    }

    gsap.to(hovercolor, {
      r: intialcolor.r,
      g: intialcolor.g,
      b: intialcolor.b,
      onUpdate: () => {
        color.setX(intersection[0].face.a, intialcolor.r)
        color.setY(intersection[0].face.a, intialcolor.g)
        color.setZ(intersection[0].face.a, intialcolor.b)

        color.setX(intersection[0].face.b, intialcolor.r)
        color.setY(intersection[0].face.b, intialcolor.g)
        color.setZ(intersection[0].face.b, intialcolor.b)

        color.setX(intersection[0].face.c, intialcolor.r)
        color.setY(intersection[0].face.c, intialcolor.g)
        color.setZ(intersection[0].face.c, intialcolor.b)

        color.needsUpdate = true
      },
    })
  }

  //planemesh.rotation.x += 0.01
  /*  planemesh.rotation.y += 0.01
  planemesh.rotation.z += 0.01
*/
}

animate()
camera.position.z = 8

//NORMALISE THE COORDINATES

addEventListener('mousemove', (event) => {
  corrdinates.x = (event.clientX / innerWidth) * 2 - 1
  corrdinates.y = -(event.clientY / innerHeight) * 2 + 1
})

//working on color hover effect
const colors = []
for (let i = 0; i < planemesh.geometry.attributes.position.count; i++) {
  colors.push(0, 0.19, 0.4)
}

planemesh.geometry.setAttribute(
  'color',
  new THREE.BufferAttribute(new Float32Array(colors), 3),
)
