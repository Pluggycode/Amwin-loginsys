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
  Cpu, Globe, Shield, Command, ArrowRight, ExternalLink, Rss
} from 'lucide-react';
import * as THREE from 'three';

// --- VIBRANT STRUCTURAL LOGO ---
function StructuralLogo() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Steady spin
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.6;
      
      // Dynamic emissive pulse for "extra brightness"
      groupRef.current.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.emissiveIntensity = 0.5 + Math.sin(state.clock.getElapsedTime() * 2) * 0.2;
        }
      });
    }
  });

  // Boosted Hex Colors for maximum vibrance
  const logoColors = [
    "#CCFF00", // Neon Lime
    "#00FF66", // Vivid Emerald
    "#0080FF", // Electric Blue
    "#0000FF", // Pure Blue
    "#4D00FF", // Electric Cobalt
    "#00FFFF"  // Bright Cyan
  ];

  const radialCoords = [[0, 1.5], [1.3, 0.75], [1.3, -0.75], [0, -1.5], [-1.3, -0.75], [-1.3, 0.75]];

  return (
    <group ref={groupRef} rotation={[0.2, 0, 0]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {radialCoords.map((coord, i) => {
          const nextCoord = radialCoords[(i + 1) % 6];
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.lineTo(coord[0], coord[1]);
          shape.lineTo(nextCoord[0], nextCoord[1]);
          shape.closePath();

          return (
            <mesh key={i} position={[0, 0, -0.2]}>
              <extrudeGeometry args={[shape, { steps: 1, depth: 0.4, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.05 }]} />
              <meshStandardMaterial 
                color={logoColors[i]} 
                metalness={0.6} // Reduced metalness slightly to let color shine through
                roughness={0.1} 
                emissive={logoColors[i]}
                emissiveIntensity={0.8} // High initial emissive brightness
              />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

export default function AmwinStablePage() {
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
    <div className="bg-[#020617] text-white selection:bg-[#CCFF00]/30 antialiased font-sans overflow-x-hidden">
      
      {/* 1. STABILIZED BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
        {/* Boosted background glow */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#CCFF00]/10 blur-[150px] rounded-full opacity-50" />
        
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={35} />
          
          {/* Brighter Lighting setup */}
          <ambientLight intensity={0.8} />
          <pointLight position={[10, 10, 10]} color="#CCFF00" intensity={2.5} />
          <pointLight position={[-10, -10, 10]} color="#00FFFF" intensity={1.5} />
          
          <Suspense fallback={null}>
            <group position={[2.2, 0, 0]}>
              <StructuralLogo />
            </group>
            <Environment preset="night" />
            <ContactShadows position={[2.2, -2.5, 0]} opacity={0.6} scale={10} blur={2.5} far={4} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* 2. HEADER */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled ? 'bg-[#020617]/90 backdrop-blur-xl border-white/5 py-4' : 'bg-transparent border-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="p-2 bg-gradient-to-br from-[#CCFF00] to-[#00FFFF] rounded-xl text-black shadow-lg shadow-[#CCFF00]/40 group-hover:scale-110 transition-transform">
              <Command size={22} />
            </div>
            <span className="font-black text-xl tracking-tighter italic uppercase">AMWIN SYSTEMS</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={() => router.push('/login')} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Login</button>
            <button 
              onClick={() => router.push('/signup')}
              className="px-6 py-3 bg-gradient-to-r from-[#CCFF00] to-[#00FFFF] text-black rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:brightness-125 transition-all shadow-xl shadow-[#CCFF00]/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION */}
      <section className="relative min-h-screen flex items-center pt-20 px-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#CCFF00]/10 border border-[#CCFF00]/30 text-[#CCFF00] text-[10px] font-black tracking-[0.3em] mb-8 uppercase">
              <div className="w-2 h-2 bg-[#CCFF00] rounded-full animate-pulse" />
              Ultra-Vibrant Core V4.0
            </div>
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] mb-10 text-white italic">
              AMWIN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#CCFF00] to-gray-600">GLOW.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
              High-fidelity intelligence with neon-grade visual clarity. Experience the brightest CRM infrastructure in the cluster.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => router.push('/signup')}
                className="group px-10 py-5 bg-gradient-to-r from-[#CCFF00] to-[#00FFFF] text-black font-black rounded-2xl flex items-center gap-4 hover:scale-[1.05] transition-all shadow-2xl shadow-[#CCFF00]/40"
              >
                ACTIVATE GLOW <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
          <div className="hidden lg:block h-[600px]" />
        </div>
      </section>

      {/* 4. FOOTER */}
      <footer className="py-20 px-10 border-t border-white/5 bg-[#020617] relative z-10 text-center">
        <div className="text-[10px] font-black tracking-[0.5em] text-gray-800 uppercase">
          © 2026 AMWIN // ILLUMINATING THE STACK
        </div>
      </footer>
    </div>
  );
}
