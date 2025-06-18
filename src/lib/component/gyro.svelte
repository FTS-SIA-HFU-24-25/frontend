<script lang="ts">
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { gyroState, accelState } from '$lib/websocket/index';
  import type { Vector } from '$lib/types/websocket';

  let container: HTMLDivElement | null = null;
  let capsule: THREE.Mesh;
  let accelArrow: THREE.ArrowHelper;

  onMount(() => {
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // OrbitControls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;
    controls.enableZoom = true;
    controls.enablePan = true;

    // Capsule mesh
    const capsuleGeometry = new THREE.CapsuleGeometry(1, 2, 4, 8);
    const capsuleMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x0077ff, 
      flatShading: true, 
      transparent: true, 
      opacity: 0.8 
    });
    capsule = new THREE.Mesh(capsuleGeometry, capsuleMaterial);
    scene.add(capsule);

    // Accelerometer arrow
    accelArrow = new THREE.ArrowHelper(
      new THREE.Vector3(0, 1, 0), // initial direction
      new THREE.Vector3(0, 0, 0), // origin
      1,                         // length
      0xff0000                   // color
    );
    scene.add(accelArrow);

    // Ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x888888, 
      side: THREE.DoubleSide 
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2; // Rotate to lie on x-y plane
    ground.position.y = -2; // Position below capsule
    scene.add(ground);

    // Light
    scene.add(new THREE.HemisphereLight(0xffffff, 0x222222, 1));

    // Axes helper (optional)
    const axes = new THREE.AxesHelper(2);
    scene.add(axes);

    // Gyro state → capsule rotation
    gyroState.subscribe((gyro: Vector) => {
      if (!gyro || !capsule) return;
      capsule.rotation.set(
        THREE.MathUtils.degToRad(gyro.x),
        THREE.MathUtils.degToRad(gyro.y),
        THREE.MathUtils.degToRad(gyro.z)
      );
    });

    // Accel state → arrow direction + length
    accelState.subscribe((acc: Vector) => {
      if (!acc || !accelArrow) return;
      const vec = new THREE.Vector3(acc.x, acc.y, acc.z);
      if (vec.length() > 0.001) {
        accelArrow.setDirection(vec.clone().normalize());
        accelArrow.setLength(vec.length());
      }
    });

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const resize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      container?.removeChild(renderer.domElement);
    };
  });
</script>

<style>
  .three-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
  }
</style>

<div bind:this={container} class="three-container"></div>
