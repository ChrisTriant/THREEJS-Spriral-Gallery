import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
import { TextureLoader } from 'three'

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

const textureLoader = new THREE.TextureLoader()

// Scene
const scene = new THREE.Scene()

const geometry = new THREE.PlaneBufferGeometry(0.5, 0.5);

const pivot = new THREE.Object3D()
scene.add(pivot);
//const sphereMat = new THREE.MeshStandardMaterial()
//const sphere = new THREE.Mesh(sphereGeo,sphereMat)

const imageNum=8

const imageArr=[]

for (let i = 0; i < imageNum; i++) {
    const material = new THREE.MeshBasicMaterial({ 
        map: textureLoader.load(`/photographs/image${i}.jpg`) 
    })

    const img = new THREE.Mesh(geometry,material);
    //img.position.set(-1.5+i*1,0);
    imageArr.push(img);
    imageArr[i].position.x=Math.cos(i/4*Math.PI);
    imageArr[i].position.z=Math.sin(i/4*Math.PI);
    scene.add(img);
    pivot.add(img);
}


// Lights

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

gui.add(camera.position,'x').min(-5).max(5).step(0.1)
gui.add(camera.position,'y').min(-5).max(5).step(0.1)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


//Mouse
window.addEventListener("wheel",onMouseWheel)

let delta=0;
let direction=1;
let scrolled=false;
let horizontal_speed=0;
let vertical_speed=0;
let displacement = 0.01;
let directionChanged=false;
let lead = 0;
let static_lead = false;
let autospeed = 0.003;
let scrolledOnce=false;


function onMouseWheel(event){
    scrolledOnce=true;
    delta=event.deltaY * 0.0007
    const old_direction=direction;
    scrolled=true;
    if(delta>0)
        direction=-1;
    else
        direction=1;
    if(old_direction!=direction){
        directionChanged=true;
    }else{
        directionChanged=false;
    }
    horizontal_speed=8;
    vertical_speed=0.25;
}


/**
 * Animate
 */


const clock = new THREE.Clock()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()



    // Update objects

    if(imageArr[0].position.y-imageArr[1].position.y > 0.3){
        static_lead=true;
    }

    lead=10;

    if(scrolled){
        pivot.rotation.y+=direction*horizontal_speed*0.01;
        
        for(let i=0;i<imageArr.length;i++){
            imageArr[i].rotation.y-=direction*horizontal_speed*0.01;
            imageArr[i].position.y+=direction*((lead*displacement)*vertical_speed); //imageArr[i].position.y+=direction*((i*displacement)*vertical_speed);
            
            if(!static_lead){
                if(direction>0)
                    lead--;
                else
                    lead++;
            }
        }
        //pivot.position.y-=direction*((8*displacement)*vertical_speed); 
        
        horizontal_speed*=.95;
        vertical_speed*=0.90;
        if(horizontal_speed<0.1){
            scrolled=false;
            vertical_speed=0;
        }
    }
    else{
        pivot.rotation.y+=direction*autospeed;
        for(let i=0;i<imageArr.length;i++){
            imageArr[i].rotation.y-=direction*autospeed;
        }

    }



    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()