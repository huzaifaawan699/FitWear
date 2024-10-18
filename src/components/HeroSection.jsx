import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroSection = () => {
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    sceneRef.current.appendChild(renderer.domElement);

    // Create particle system
    const particlesCount = 5000;
    const positions = new Float32Array(particlesCount * 3);
    
    for (let i = 0; i < particlesCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10; // x
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xFBBF24, // Particle color
      size: 0.05,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.7
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 5;

    const animate = () => {
      requestAnimationFrame(animate);
      particles.rotation.y += 0.001;
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      sceneRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden bg-gradient-to-r from-gray-900 to-gray-800"> {/* Gradient background */}
      <div ref={sceneRef} className="absolute top-0 left-0 w-full h-full"></div>
      <div className="absolute inset-0 z-10 flex flex-col justify-center items-center text-center text-white">
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4">Welcome to FitWear</h1>
        <p className="text-lg md:text-xl mb-8 px-4 max-w-lg">Your all-in-one health tracker and fitness companion, designed to elevate your wellness journey.</p>
        <a 
          href="#health" 
          className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold shadow-md hover:from-yellow-500 hover:to-orange-600 transition-all duration-300"
        >
          Get Started
        </a>
      </div>
    </section>
  );
};

export default HeroSection;
