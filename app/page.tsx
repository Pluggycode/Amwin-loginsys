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

// --- STABLE STRUCTURAL LOGO ---
function StructuralLogo() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Precise Y-axis spin at a stable location
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.6;
    }
  });

  const logoColors = ["#BFFF00", "#4CAF50", "#0070FF", "#0000FF", "#0052CC", "#00D4FF"];
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
              <meshStandardMaterial color={logoColors[i]} metalness={0.9} roughness={0.1} emissive={logoColors[i]} emissiveIntensity={0.2} />
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
    <div className="bg-[#020617] text-white selection:bg-[#BFFF00]/30 antialiased font-sans overflow-x-hidden">
      
      {/* 1. STABILIZED BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#BFFF00]/5 blur-[120px] rounded-full" />
        <Canvas shadows>
          {/* Centered the camera and removed the X-axis offset */}
          <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={35} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} color="#BFFF00" intensity={1.5} />
          <Suspense fallback={null}>
            {/* Positioned the model on the right but kept it static */}
            <group position={[2.2, 0, 0]}>
              <StructuralLogo />
            </group>
            <Environment preset="night" />
            <ContactShadows position={[2.2, -2.5, 0]} opacity={0.4} scale={10} blur={2.5} far={4} />
          </Suspense>
          {/* Disabled autoRotate to prevent the "sliding" effect */}
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* 2. HEADER */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-white/5 py-4 shadow-2xl' : 'bg-transparent border-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => router.push('/')}>
            <div className="p-2 bg-gradient-to-br from-[#BFFF00] to-[#00D4FF] rounded-xl text-black shadow-lg shadow-[#BFFF00]/20 group-hover:scale-110 transition-transform">
              <Command size={22} />
            </div>
            <span className="font-black text-xl tracking-tighter italic uppercase">AMWIN SYSTEMS</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <button onClick={() => router.push('/login')} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">Login</button>
            <button 
              onClick={() => router.push('/signup')}
              className="px-6 py-3 bg-gradient-to-r from-[#BFFF00] to-[#00D4FF] text-black rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:brightness-110 transition-all shadow-xl shadow-[#BFFF00]/20"
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
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BFFF00]/5 border border-[#BFFF00]/20 text-[#BFFF00] text-[10px] font-black tracking-[0.3em] mb-8 uppercase">
              <div className="w-2 h-2 bg-[#BFFF00] rounded-full animate-pulse" />
              Structural Core V4.0
            </div>
            <h1 className="text-7xl md:text-[9rem] font-black tracking-tighter leading-[0.8] mb-10 text-white italic">
              AMWIN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">CLOUD.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
              Predictive intelligence through structural integrity. Manage enterprise relationships at 0.04ms sync speeds.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => router.push('/signup')}
                className="group px-10 py-5 bg-gradient-to-r from-[#BFFF00] to-[#00D4FF] text-black font-black rounded-2xl flex items-center gap-4 hover:scale-[1.02] transition-all shadow-2xl shadow-[#BFFF00]/30"
              >
                INITIALIZE SYNC <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
          <div className="hidden lg:block h-[600px]" />
        </div>
      </section>

      {/* 4. DATA STRIP */}
      <section className="py-10 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-10 flex flex-wrap justify-between items-center gap-10">
          {[
            { label: "Lead Scoring", value: "Neural" },
            { label: "Throughput", value: "120 Tbps" },
            { label: "Sync Speed", value: "0.04ms" },
            { label: "Security", value: "L-Grade" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase mb-1">{stat.label}</span>
              <span className="text-2xl font-bold tracking-tighter text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="py-20 px-10 border-t border-white/5 bg-[#020617] relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/5 rounded-lg text-[#BFFF00]"><Command size={20} /></div>
             <span className="font-black text-xl italic uppercase">Amwin Systems</span>
          </div>
          <div className="text-[10px] font-black tracking-widest text-gray-800 uppercase">
            © 2026 AMWIN // ALL RIGHTS RESERVED
          </div>
        </div>
      </footer>
    </div>
  );
}
