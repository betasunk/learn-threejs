import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
console.log('OrbitControls---',OrbitControls);

// 创建场景
const scene = new THREE.Scene();
// 创建透视摄像机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 5, 20);
camera.lookAt(0, 0, 0);

// 创建渲染器
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 创建塔吊模型的基础
const baseGeometry = new THREE.BoxGeometry(2, 2, 2);
const baseMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const base = new THREE.Mesh(baseGeometry, baseMaterial);

// 创建塔顶
const topGeometry = new THREE.CylinderGeometry(0.5, 0.5, 5, 32);
const topMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const top = new THREE.Mesh(topGeometry, topMaterial);
top.position.y = 3; // 放置在基础的上方

// 创建吊钩
const hookGeometry = new THREE.BoxGeometry(0.2, 0.2, 1);
const hookMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const hook = new THREE.Mesh(hookGeometry, hookMaterial);
hook.position.y = 4; // 放置在塔顶的上方

// 将模型添加到场景中
scene.add(base);
scene.add(top);
scene.add(hook);

// 设置动画循环
function animate() {
  requestAnimationFrame(animate);

  // 使塔吊绕y轴旋转
  base.rotation.y += 0.01;
  controls.update(); // 每帧更新控制器状态
  renderer.render(scene, camera);
}

animate();