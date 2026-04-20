"use client";

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  ContactShadows, 
  PerspectiveCamera,
} from '@react-three/drei';
import { motion } from 'framer-motion';
import { 
  Command, ArrowRight
} from 'lucide-react';
import * as THREE from 'three';

// --- BALANCED STRUCTURAL LOGO ---
function StructuralLogo() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Stable, elegant spin
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  // Original logo palette - saturated but natural
  const logoColors = ["#BFFF00", "#4CAF50", "#0070FF", "#0000FF", "#0052CC", "#00D4FF"];
  const radialCoords = [[0, 1.5], [1.3, 0.75], [1.3, -0.75], [0, -1.5], [-1.3, -0.75], [-1.3, 0.75]];

  return (
    <group ref={groupRef} rotation={[0.1, 0, 0]}>
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.3}>
        {radialCoords.map((coord, i) => {
          const nextCoord = radialCoords[(i + 1) % 6];
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.lineTo(coord[0], coord[1]);
          shape.lineTo(nextCoord[0], nextCoord[1]);
          shape.closePath();

          return (
            <mesh key={i} position={[0, 0, -0.2]}>
              <extrudeGeometry args={[shape, { steps: 1, depth: 0.35, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.04 }]} />
              <meshStandardMaterial 
                color={logoColors[i]} 
                metalness={0.7} 
                roughness={0.3} // Increased roughness to reduce "blinding" reflections
                emissive={logoColors[i]}
                emissiveIntensity={0.15} // Dialed down significantly for a subtle "smart" glow
              />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

export default function AmwinBalancedPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#020617] text-white selection:bg-[#BFFF00]/20 antialiased font-sans overflow-x-hidden">
      
      {/* 1. STABLE BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
        {/* Softened background glow */}
        <div className="absolute top-[-5%] left-[-5%] w-[35%] h-[35%] bg-[#BFFF00]/5 blur-[120px] rounded-full opacity-30" />
        
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 7.5]} fov={35} />
          <ambientLight intensity={0.6} />
          <pointLight position={[5, 5, 5]} color="#BFFF00" intensity={1} />
          
          <Suspense fallback={null}>
            <group position={[2.2, 0, 0]}>
              <StructuralLogo />
            </group>
            <Environment preset="night" />
            <ContactShadows position={[2.2, -2.5, 0]} opacity={0.3} scale={8} blur={3} far={4} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* 2. HEADER */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
        scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="p-2 bg-gradient-to-br from-[#BFFF00] to-[#0070FF] rounded-xl text-black shadow-md shadow-[#BFFF00]/10 group-hover:scale-105 transition-transform">
              <Command size={22} />
            </div>
            <span className="font-black text-xl tracking-tighter italic uppercase">AMWIN SYSTEMS</span>
          </div>
          
          <div className="flex items-center gap-8">
            <button onClick={() => router.push('/login')} className="text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Login</button>
            <button 
              onClick={() => router.push('/signup')}
              className="px-6 py-3 bg-white text-black rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-[#BFFF00] transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative min-h-screen flex items-center px-10 max-w-7xl mx-auto z-10">
        <div className="max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400 text-[10px] font-black tracking-[0.3em] mb-8 uppercase"
          >
            Nexus Node V4.0
          </motion.div>
          <h1 className="text-8xl font-black tracking-tighter leading-[0.85] mb-10 text-white italic uppercase">
            System <br /> <span className="text-gray-600">Integrity.</span>
          </h1>
          <p className="text-gray-400 text-lg font-light leading-relaxed mb-12">
            The next generation of CRM infrastructure. Clean, structural, and synchronized at 0.04ms.
          </p>
          <button 
            onClick={() => router.push('/signup')}
            className="group px-10 py-5 bg-gradient-to-r from-[#BFFF00] to-[#0070FF] text-black font-black rounded-2xl flex items-center gap-4 hover:brightness-110 transition-all"
          >
            INITIALIZE CORE <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-10 px-10 text-center opacity-30 text-[10px] font-black tracking-[0.4em] uppercase">
        © 2026 AMWIN // ALL SYSTEMS OPERATIONAL
      </footer>
    </div>
  );
}
