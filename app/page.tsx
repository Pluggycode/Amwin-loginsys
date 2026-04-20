"use client";

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  ContactShadows, 
  PerspectiveCamera,
  MeshDistortMaterial,
  Text
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Shield, Command, ArrowRight, X, Zap, Activity
} from 'lucide-react';
import * as THREE from 'three';

// --- STRUCTURAL LOGO OBJECT (REBUILT FOR DEPTH) ---
function StructuralLogo() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  const logoColors = [
    "#BFFF00", "#4CAF50", "#0070FF", 
    "#0000FF", "#0052CC", "#00D4FF"
  ];

  // Vertices for the hexagonal structure
  const radialCoords = [
    [0, 1.5], [1.3, 0.75], [1.3, -0.75], 
    [0, -1.5], [-1.3, -0.75], [-1.3, 0.75]
  ];

  return (
    <group ref={groupRef}>
      <Float speed={4} rotationIntensity={1} floatIntensity={1.5}>
        {radialCoords.map((coord, i) => {
          const nextCoord = radialCoords[(i + 1) % 6];
          
          // Create a 3D Shape for extrusion (Depth)
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.lineTo(coord[0], coord[1]);
          shape.lineTo(nextCoord[0], nextCoord[1]);
          shape.closePath();

          const extrudeSettings = {
            steps: 1,
            depth: 0.4, // This gives it the "Structural Object" feel
            beveledEnabled: true,
            bevelThickness: 0.1,
            bevelSize: 0.05,
          };

          return (
            <mesh key={i} position={[0, 0, -0.2]}>
              <extrudeGeometry args={[shape, extrudeSettings]} />
              <meshStandardMaterial 
                color={logoColors[i]} 
                metalness={0.9} 
                roughness={0.1} 
                emissive={logoColors[i]}
                emissiveIntensity={0.2}
              />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

// --- AUTH MODAL SYSTEM ---
const AuthSystem = ({ type, onClose }: { type: 'login' | 'signup' | null, onClose: () => void }) => {
  if (!type) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-3xl flex items-center justify-center"
    >
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 40 }} animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-lg p-12 bg-[#0B0E14] border border-white/10 rounded-[40px] shadow-2xl relative"
      >
        <button onClick={onClose} className="absolute top-10 right-10 text-gray-500 hover:text-white"><X size={24}/></button>
        <div className="flex flex-col gap-8">
          <div className="inline-flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-[#BFFF00] to-[#0070FF] rounded-md" />
            <span className="font-black text-sm uppercase tracking-widest">Amwin Cluster</span>
          </div>
          <h2 className="text-5xl font-black italic uppercase tracking-tighter">
            {type === 'login' ? 'Access Portal' : 'New Node'}
          </h2>
          <div className="space-y-4">
            <input type="email" placeholder="Nexus ID (Email)" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#BFFF00]/50 transition-all" />
            <input type="password" placeholder="Encryption Key" className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-[#BFFF00]/50 transition-all" />
          </div>
          <button className="w-full py-6 bg-gradient-to-r from-[#BFFF00] to-[#0070FF] text-black font-black rounded-2xl uppercase tracking-widest shadow-lg shadow-[#BFFF00]/20">
            {type === 'login' ? 'Authenticate' : 'Register Instance'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AmwinStructuralCRM() {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null);

  return (
    <div className="bg-[#020617] text-white selection:bg-[#BFFF00] selection:text-black">
      
      <AnimatePresence>
        {authMode && <AuthSystem type={authMode} onClose={() => setAuthMode(null)} />}
      </AnimatePresence>

      {/* BACKGROUND 3D ENVIRONMENT */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={35} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#BFFF00" />
          <Suspense fallback={null}>
            <group position={[2, 0, 0]}>
              <StructuralLogo />
            </group>
            <Environment preset="night" />
            <ContactShadows position={[2, -2.5, 0]} opacity={0.4} scale={10} blur={2} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      {/* NAV BAR */}
      <nav className="fixed top-0 w-full z-50 p-10 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="p-2 bg-white/5 rounded-xl border border-white/10 group-hover:border-[#BFFF00]/50 transition-all">
            <Command size={22} className="text-[#BFFF00]" />
          </div>
          <span className="font-black text-2xl tracking-tighter italic uppercase">Amwin</span>
        </div>
        <div className="flex items-center gap-10">
          <button onClick={() => setAuthMode('login')} className="text-xs font-bold tracking-[0.2em] text-gray-500 hover:text-white uppercase transition-colors">Client Login</button>
          <button 
            onClick={() => setAuthMode('signup')}
            className="px-8 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-[#BFFF00] transition-colors shadow-xl"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center px-10 max-w-7xl mx-auto z-10">
        <div className="max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Activity size={16} className="text-[#BFFF00] animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.4em] text-gray-500 uppercase">System Status: Optimal</span>
          </motion.div>
          
          <h1 className="text-[10rem] font-black italic leading-[0.75] uppercase tracking-tighter mb-12">
            Power <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/20">Unified.</span>
          </h1>
          
          <p className="text-gray-400 text-xl font-light leading-relaxed max-w-lg mb-12 italic">
            Experience the structural evolution of CRM. Amwin's hexagonal matrix synchronizes your global sales data with absolute structural integrity.
          </p>

          <div className="flex gap-6">
            <button 
               onClick={() => setAuthMode('signup')}
               className="group flex items-center gap-4 px-10 py-6 bg-gradient-to-r from-[#BFFF00] to-[#0070FF] text-black font-black rounded-[20px] shadow-2xl shadow-[#BFFF00]/20 hover:scale-105 transition-all"
            >
              DEPLOY CORE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER STRIP */}
      <footer className="fixed bottom-0 w-full p-10 z-10 flex justify-between items-center text-[10px] font-black tracking-[0.5em] text-gray-700 uppercase">
        <div className="flex gap-10">
          <span className="hover:text-white cursor-pointer transition-colors">Privacy.sys</span>
          <span className="hover:text-white cursor-pointer transition-colors">Protocol.04</span>
        </div>
        <span>© 2026 Amwin Systems</span>
      </footer>
    </div>
  );
}
