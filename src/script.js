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


//set-up circle
const pivot = new THREE.Object3D()
scene.add(pivot);

const imageNum=8;
const imageArr=[];
const circleRadius=0.6;
const imageRadius = 0.2
const imageSegments = 64  //3-64
const geometry = new THREE.CircleBufferGeometry(imageRadius, imageSegments);     //const geometry = new THREE.PlaneBufferGeometry(0.5, 0.5);
const spiralType=0;


for (let i = 0; i < imageNum; i++) {
    const material = new THREE.MeshBasicMaterial({ 
        map: textureLoader.load(`/photographs/image${i}.jpg`) 
    })
    const img = new THREE.Mesh(geometry,material);
    imageArr.push(img);
    switch(spiralType){
        case 0: {
            imageArr[i].position.y=circleRadius*Math.cos(i/4*Math.PI);
            imageArr[i].position.x=circleRadius*Math.sin(i/4*Math.PI);
        }
        break;
        case 1:{
            imageArr[i].position.x=circleRadius*Math.cos(i/4*Math.PI);
            imageArr[i].position.z=circleRadius*Math.sin(i/4*Math.PI);
        }
        break;
        default:{
            imageArr[i].position.y=circleRadius*Math.cos(i/4*Math.PI);
            imageArr[i].position.x=circleRadius*Math.sin(i/4*Math.PI);
        }
        break;
    }
    
    scene.add(img);
    pivot.add(img);

}




// Lights

const pointLight = new THREE.PointLight(0xffffff, 1)
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
gui.add(camera.position,'z').min(-5).max(5).step(0.1)

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
let rotation_speed=0;
let vertical_speed=0;
let displacement = 0.05;
let directionChanged=false;
let lead = 0;
let static_lead = false;
let autospeed = 0.003;


function onMouseWheel(event){
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
    rotation_speed=8;
    vertical_speed=0.25;
    //console.log(direction)
}


/**
 * Animate
 */


const HorizontalSpin = () =>{
    if(Math.abs(imageArr[0].position.z-imageArr[1].position.z) > 0.3){
        static_lead=true;
    }

    if(directionChanged){
        static_lead=false;
    }

    lead=10;

    if(scrolled){
        pivot.rotation.z+=direction*rotation_speed*0.01;

        for(let i=0;i<imageArr.length;i++){
            imageArr[i].rotation.z-=direction*rotation_speed*0.01;
            if(direction<0 && (imageArr[i].position.z.toPrecision(2)==="0.001" || imageArr[i].position.z<0 )){
                //console.log("reset to circle")
                static_lead=false;
            }else{
                imageArr[i].position.z+=direction*(lead*displacement*vertical_speed); 
                //console.log(imageArr[i].position.z)
            }
            if(!static_lead){
                if(direction>0)
                    lead--;
                else
                    lead++;
            }
        } 

        if(!(direction<0 && (imageArr[0].position.z.toPrecision(2)==="0.001" || imageArr[0].position.z<0 ))){
            pivot.position.z-=direction*((8*displacement)*vertical_speed);
        }else{
            pivot.position.z=0;
            for(let i=0;i<imageArr.length;i++){
                imageArr[i].position.z=0;
            }
        }
        
        //console.log(pivot.position.z)

        rotation_speed*=.95;
        vertical_speed*=0.90;
        if(rotation_speed<0.1){
            scrolled=false;
            vertical_speed=0;
        }
    }
    else{
        pivot.rotation.z+=direction*autospeed;
        for(let i=0;i<imageArr.length;i++){
            imageArr[i].rotation.z-=direction*autospeed;
        }

    }
}

const VerticalSpin = () => {
    if(Math.abs(imageArr[0].position.y - imageArr[7].position.y) > 2){
        static_lead=true;
        console.log(imageArr[0].position.y - imageArr[7].position.y)
    }

    if(directionChanged){
        //static_lead=false;
    }

    lead=10;

    if(scrolled){
        pivot.rotation.y+=direction*rotation_speed*0.01;

        for(let i=0;i<imageArr.length;i++){
            imageArr[i].rotation.y-=direction*rotation_speed*0.01;
            if(direction<0 && (imageArr[i].position.y.toPrecision(2)==="0.001" || imageArr[i].position.y<0 )){
                console.log(imageArr[i].position.y)
                static_lead=false;
            }else{
                imageArr[i].position.y+=direction*(lead*displacement*vertical_speed); 
                //console.log(imageArr[i].position.y)
            }
            if(!static_lead){
                if(direction>0)
                    lead--;
                else
                    lead++;
            }
        } 

        if(!(direction<0 && (imageArr[0].position.y.toPrecision(2)==="0.001" || imageArr[0].position.y<0 ))){
            pivot.position.y-=direction*((8*displacement)*vertical_speed);
        }else{
            pivot.position.y=0;
            for(let i=0;i<imageArr.length;i++){
                imageArr[i].position.y=0;
            }
        }
        
        //console.log(pivot.position.z)

        rotation_speed*=.95;
        vertical_speed*=0.90;
        if(rotation_speed<0.1){
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
}


const clock = new THREE.Clock()

function setSpinFun(){
    switch(spiralType){
        case 0: return HorizontalSpin
        case 1: return VerticalSpin;
        default: return HorizontalSpin;
    }
}
var spinFunction = setSpinFun()

const tick = () => {

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    spinFunction();

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()