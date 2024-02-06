import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

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

const objLoader = new OBJLoader();
console.log('objLoader---',objLoader);
var textureLoader = new THREE.TextureLoader();
// 创建一个 Promise 用于加载模型
const loadModel = new Promise((resolve, reject) => {
  objLoader.load('./45-cottage_free_other/Cottage_FREE.obj', (object) => {
    resolve(object);
  }, (xhr) => {
    console.log((xhr.loaded / xhr.total * 100) + '% 模型已加载');
  }, (error) => {
    console.log('加载模型出错啦：' + error);
    reject(error);
  });
});

// 创建一个 Promise 数组用于加载多张图片
const imagePromises = [
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_Base_Color.png'),
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_Height.png'),
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_AO.png'),
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_Metallic.png'),
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_MetallicSmoothness.png'),
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_Normal.png'),
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_Opacity.png'),
  textureLoader.loadAsync('./92-textures_cottage_clean/Cottage_Clean/Cottage_Clean_Roughness.png'),
  // 添加更多的图片路径
];
// 在所有图片加载完毕后，将图片和模型应用到场景中
Promise.all([...imagePromises, loadModel]).then((results) => {
  const images = results.slice(0, results.length - 1); // 截取加载的图片结果
  const object = results[results.length - 1]; // 获取加载的模型对象

  // 创建一个贴图材质对象，并将纹理应用于其中
  // 遍历加载的模型，并为每个部分设置对应的材质
  object.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = new THREE.MeshBasicMaterial({ map: images[0],aoMap:images[2],lightMap:images[1] });
      child.material = material;
    }
  });

  // 将模型添加到场景中
  scene.add(object);
}).catch((error) => {
  console.error('加载图片或模型出错啦：' + error);
});
const directionalLight = new THREE.DirectionalLight(0xffffff, 6); // 设置平行光的颜色和强度
directionalLight.position.set(100, 100, 100); // 设置光源的方向
scene.add(directionalLight); // 将平行光添加到场景中

// 设置动画循环
function animate() {
  requestAnimationFrame(animate);

  // 使塔吊绕y轴旋转
  // loadModel.rotation.y += 0.01;
  controls.update(); // 每帧更新控制器状态
  renderer.render(scene, camera);
}

animate();