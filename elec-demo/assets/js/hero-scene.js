/**
 * ============================================================================
 * THREE.JS 3D HERO VISUALIZATION: ELECTRICAL POWER CORE & TRANSFORMER
 * ============================================================================
 * Features:
 * - Subtle, elegant engineering visual (power core, concentric rings, circuit nodes)
 * - Restrained amber/cyan electrical lighting
 * - Mouse cursor tracking with smooth lerp dampening
 * - Performance optimized: pauses when offscreen via IntersectionObserver
 * - Mobile responsive & respects prefers-reduced-motion
 * ============================================================================
 */

(function initHeroScene() {
  if (typeof window === 'undefined') return;

  function run() {
    const container = document.getElementById('hero-3d-canvas');
    if (!container) return;

    if (typeof THREE === 'undefined') {
      console.warn('Three.js not yet loaded. Retrying in 100ms...');
      setTimeout(run, 100);
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Dimensions
    let width = container.clientWidth || 460;
    let height = container.clientHeight || 460;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobile,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.8));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0D1726, 1.2);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0xF5B91C, 3.5, 18);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    const cyanRim = new THREE.DirectionalLight(0x00C2FF, 1.6);
    cyanRim.position.set(5, 6, 8);
    scene.add(cyanRim);

    const softFill = new THREE.DirectionalLight(0x94A3B8, 0.8);
    softFill.position.set(-6, -4, 4);
    scene.add(softFill);

    // Master Group
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central Transformer Core
    // Layered cylinder coil
    const coilGeo = new THREE.CylinderGeometry(1.2, 1.2, 2.2, 24, 6, true);
    const coilMat = new THREE.MeshStandardMaterial({
      color: 0x142033,
      metalness: 0.8,
      roughness: 0.3,
      wireframe: true
    });
    const coilMesh = new THREE.Mesh(coilGeo, coilMat);
    coreGroup.add(coilMesh);

    // Inner glowing power nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(0.85, 2);
    const nucleusMat = new THREE.MeshStandardMaterial({
      color: 0xF5B91C,
      emissive: 0xF5B91C,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.1
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleusMesh);

    // Protective outer geodesic circuit cage
    const cageGeo = new THREE.IcosahedronGeometry(1.9, 1);
    const cageMat = new THREE.MeshStandardMaterial({
      color: 0x00C2FF,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });
    const cageMesh = new THREE.Mesh(cageGeo, cageMat);
    coreGroup.add(cageMesh);

    // 2. Concentric Electrical Induction Rings
    // Ring 1 (Gold, horizontal tilt)
    const ring1Geo = new THREE.TorusGeometry(2.7, 0.035, 12, 64);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xF5B91C,
      emissive: 0xF5B91C,
      emissiveIntensity: 0.25,
      metalness: 0.8,
      roughness: 0.2
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    // Ring 2 (Electric Cyan, vertical tilt)
    const ring2Geo = new THREE.TorusGeometry(3.4, 0.03, 12, 64);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x00C2FF,
      emissive: 0x00C2FF,
      emissiveIntensity: 0.2,
      metalness: 0.8,
      roughness: 0.2
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.y = Math.PI / 4;
    ring2.rotation.x = -Math.PI / 6;
    coreGroup.add(ring2);

    // Ring 3 (Outer Deep Steel / Guide Ring)
    const ring3Geo = new THREE.TorusGeometry(4.1, 0.025, 8, 48);
    const ring3Mat = new THREE.MeshBasicMaterial({
      color: 0x475569,
      transparent: true,
      opacity: 0.6
    });
    const ring3 = new THREE.Mesh(ring3Geo, ring3Mat);
    ring3.rotation.z = Math.PI / 5;
    coreGroup.add(ring3);

    // 3. Electrical Micro-Particles
    const particleCount = isMobile ? 40 : 90;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color(0xF5B91C);
    const cyanColor = new THREE.Color(0x00C2FF);

    for (let i = 0; i < particleCount; i++) {
      const radius = 2.2 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const color = Math.random() > 0.4 ? goldColor : cyanColor;
      particleColors[i * 3] = color.r;
      particleColors[i * 3 + 1] = color.g;
      particleColors[i * 3 + 2] = color.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.08 : 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    coreGroup.add(particles);

    // Cursor tracking state
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const heroSection = document.getElementById('hero') || document.body;

    function onMouseMove(e) {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x * 0.4;
      targetMouseY = y * 0.35;
    }

    if (!isMobile && !prefersReduced) {
      window.addEventListener('mousemove', onMouseMove, { passive: true });
    }

    // Window resize handler
    function onResize() {
      if (!container) return;
      width = container.clientWidth || 460;
      height = container.clientHeight || 460;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize, { passive: true });

    // IntersectionObserver to pause rendering when offscreen
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();
    let animId = null;

    function animate() {
      animId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      if (!prefersReduced) {
        // Smooth cursor lerping
        currentMouseX += (targetMouseX - currentMouseX) * 0.05;
        currentMouseY += (targetMouseY - currentMouseY) * 0.05;

        coreGroup.rotation.y = currentMouseX + (time * 0.15);
        coreGroup.rotation.x = -currentMouseY + (Math.sin(time * 0.4) * 0.08);

        // Independent rotating ring components
        ring1.rotation.z = time * 0.35;
        ring2.rotation.z = -time * 0.28;
        ring3.rotation.x = time * 0.18;
        cageMesh.rotation.y = -time * 0.2;
        particles.rotation.y = -time * 0.08;

        // Subtle core breathing pulsation
        const pulse = 1 + Math.sin(time * 2.5) * 0.04;
        nucleusMesh.scale.set(pulse, pulse, pulse);
        coreLight.intensity = 3.2 + Math.sin(time * 3) * 0.8;
      }

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run);
  } else {
    run();
  }
})();
