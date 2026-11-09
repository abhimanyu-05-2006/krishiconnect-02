import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Farm3DVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check WebGL availability
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      container.appendChild(renderer.domElement);
    } catch (e) {
      // Graceful fallback if WebGL fails
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);
    camera.lookAt(0, 0, 0);

    // Ambient and Directional Warm Sunrise Light
    const ambientLight = new THREE.AmbientLight(0xfffbe6, 0.9);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xb7d96b, 1.8);
    sunLight.position.set(4, 5, 3);
    scene.add(sunLight);

    const warmFill = new THREE.PointLight(0xe6a23c, 1.2, 10);
    warmFill.position.set(-3, -1, 2);
    scene.add(warmFill);

    // Group for farm elements
    const group = new THREE.Group();
    scene.add(group);

    // Central stylized terra disc / harvest sphere
    const terraGeo = new THREE.DodecahedronGeometry(1.2, 1);
    const terraMat = new THREE.MeshStandardMaterial({
      color: 0x174d35,
      roughness: 0.35,
      metalness: 0.1,
      flatShading: true,
    });
    const terraMesh = new THREE.Mesh(terraGeo, terraMat);
    group.add(terraMesh);

    // Orbiting Golden Seed / Wheat / Leaf Particles
    const particlesCount = 18;
    const particleGroup = new THREE.Group();
    const leafGeo = new THREE.TetrahedronGeometry(0.18, 0);
    const leafMat = new THREE.MeshStandardMaterial({
      color: 0xb7d96b,
      roughness: 0.3,
      metalness: 0.2,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xe6a23c,
      roughness: 0.2,
      metalness: 0.6,
    });

    const particles: THREE.Mesh[] = [];
    for (let i = 0; i < particlesCount; i++) {
      const mesh = new THREE.Mesh(leafGeo, i % 2 === 0 ? leafMat : goldMat);
      const angle = (i / particlesCount) * Math.PI * 2;
      const radius = 1.7 + Math.sin(i * 1.5) * 0.3;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 1.2,
        Math.sin(angle) * radius
      );
      mesh.scale.setScalar(0.7 + Math.random() * 0.6);
      particleGroup.add(mesh);
      particles.push(mesh);
    }
    group.add(particleGroup);

    // Mouse movement interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetX = x * 0.4;
      targetY = y * 0.3;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 320;
      const h = container.clientHeight || 320;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    let reqId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      group.rotation.y = elapsedTime * 0.25 + mouseX;
      group.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1 + mouseY;

      particleGroup.rotation.y = -elapsedTime * 0.4;

      particles.forEach((p, idx) => {
        p.rotation.x += 0.02;
        p.rotation.y += 0.03;
        p.position.y += Math.sin(elapsedTime * 2 + idx) * 0.002;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      terraGeo.dispose();
      terraMat.dispose();
      leafGeo.dispose();
      leafMat.dispose();
      goldMat.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px] flex items-center justify-center relative pointer-events-auto"
      aria-label="3D Interactive Organic Produce Visualization"
    >
      <div className="sr-only">Interactive 3D model of sustainable organic agricultural produce</div>
    </div>
  );
};
