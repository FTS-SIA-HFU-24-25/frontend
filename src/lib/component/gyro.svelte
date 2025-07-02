<script lang="ts">
  // All imports at the top level
  import { onMount } from 'svelte';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { gyroState, accelState } from '$lib/websocket/index';
  import type { Vector } from '$lib/types/websocket';

  let container: HTMLDivElement | null = null;
  let tooltip: HTMLDivElement | null = null;
  let capsule: THREE.Mesh;
  let accelArrow: THREE.Group;
  let shaft: THREE.Mesh;
  let head: THREE.Mesh;
  let gForce = 0; // Store current G-force

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
    
    // Set initial rotation to stand straight with z:90
    capsule.rotation.set(
      THREE.MathUtils.degToRad(0),    // x: 0
      THREE.MathUtils.degToRad(0),    // y: 0
      THREE.MathUtils.degToRad(90)    // z: 90
    );
    scene.add(capsule);

    // Custom accelerometer arrow (thicker)
    accelArrow = new THREE.Group();
    const shaftMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const shaftGeometry = new THREE.CylinderGeometry(0.05, 0.05, 0.8, 8); // Thicker shaft
    shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.position.y = 0.4; // Center of cylinder (length 0.8)
    const headGeometry = new THREE.ConeGeometry(0.1, 0.2, 8); // Thicker head
    head = new THREE.Mesh(headGeometry, shaftMaterial);
    head.position.y = 0.8; // Position at top of shaft (0.4 + 0.4)
    accelArrow.add(shaft, head);
    accelArrow.position.set(0, 0, 0); // Origin
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

    // Gyro state → capsule rotation
    gyroState.subscribe((gyro: Vector) => {
      if (!gyro || !capsule) return;
      capsule.rotation.set(
        THREE.MathUtils.degToRad(gyro.x),
        THREE.MathUtils.degToRad(gyro.y),
        THREE.MathUtils.degToRad(gyro.z + 90) // Adjust z to maintain upright orientation
      );
    });

    // Accel state → arrow direction + length + G-force
    accelState.subscribe((acc: Vector) => {
      if (!acc || !accelArrow || !shaft || !head) return;
      const vec = new THREE.Vector3(acc.x, acc.y, acc.z);
      const length = vec.length();
      // Calculate G-force: sqrt(x*x + y*y + z*z)
      gForce = Math.sqrt(acc.x * acc.x + acc.y * acc.y + acc.z * acc.z);
      if (length > 0.001) {
        // Update direction
        const direction = vec.clone().normalize();
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0), // Default up direction
          direction
        );
        accelArrow.setRotationFromQuaternion(quaternion);
        // Update shaft length and position
        const scale = length / 1; // Normalize to initial length of 1
        shaft.scale.set(1, scale, 1); // Scale only shaft length
        shaft.position.y = (0.4 * scale); // Center of scaled shaft
        head.position.y = (0.8 * scale); // Head at top of scaled shaft
        head.scale.set(1, 1, 1); // Keep head size constant
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

    // Tooltip hover
    const onMouseMove = (event: MouseEvent) => {
      if (!tooltip) return;
      tooltip.style.left = `${event.clientX + 10}px`;
      tooltip.style.top = `${event.clientY + 10}px`;
      tooltip.textContent = `G-force: ${gForce.toFixed(2)}`;
    };

    const onMouseEnter = () => {
      if (tooltip) tooltip.style.display = 'block';
    };

    const onMouseLeave = () => {
      if (tooltip) tooltip.style.display = 'none';
    };

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseenter', onMouseEnter);
    container.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      container?.removeChild(renderer.domElement);
      container?.removeEventListener('mousemove', onMouseMove);
      container?.removeEventListener('mouseenter', onMouseEnter);
      container?.removeEventListener('mouseleave', onMouseLeave);
    };
  });
</script>

<style>
  .three-container {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    position: relative;
  }
  .tooltip {
    position: fixed;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
    display: none;
    z-index: 1000;
  }
</style>

<div bind:this={container} class="three-container">
  <div bind:this={tooltip} class="tooltip"></div>
</div>
