"use client";

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { 
  OrbitControls, 
  Environment, 
  Float, 
  ContactShadows, 
  PerspectiveCamera,
} from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Shield, Command, ArrowRight, ExternalLink, 
  BarChart3, X, Zap
} from 'lucide-react';
import * as THREE from 'three';

// --- PIXEL-PERFECT HEXAGONAL LOGO (REBUILT) ---
function FacetedLogo() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Smooth floating rotation
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });

  // Colors extracted directly from your logo image
  const colors = [
    "#BFFF00", // Lime Green (Top Left)
    "#4CAF50", // Emerald Green (Top Right)
    "#0070FF", // Bright Blue (Middle Right)
    "#0000FF", // Deep Blue (Bottom Right)
    "#0052CC", // Cobalt Blue (Bottom Left)
    "#00D4FF", // Cyan/Light Blue (Middle Left)
  ];

  // Vertices for a flat hexagon divided into 6 triangles
  // Using an isometric-style tilt as seen in the logo
  const vertices = [
    [0, 1.5, 0],    // 1: Top
    [1.3, 0.75, 0], // 2: Top Right
    [1.3, -0.75, 0],// 3: Bottom Right
    [0, -1.5, 0],   // 4: Bottom
    [-1.3, -0.75, 0],// 5: Bottom Left
    [-1.3, 0.75, 0], // 6: Top Left
  ];

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.7}>
        {vertices.map((v, i) => {
          const nextV = vertices[(i + 1) % 6];
          const geometry = new THREE.BufferGeometry();
          const points = new Float32Array([
            0, 0, 0,      // Center point
            v[0], v[1], v[2],
            nextV[0], nextV[1], nextV[2]
          ]);
          geometry.setAttribute('position', new THREE.BufferAttribute(points, 3));
          
          return (
            <mesh key={i} geometry={geometry}>
              <meshStandardMaterial 
                color={colors[i]} 
                emissive={colors[i]} 
                emissiveIntensity={0.2}
                side={THREE.DoubleSide}
                metalness={0.8}
                roughness={0.2}
              />
            </mesh>
          );
        })}
      </Float>
    </group>
  );
}

// --- AUTH OVERLAY COMPONENT ---
const AuthOverlay = ({ type, onClose }: { type: 'login' | 'signup' | null, onClose: () => void }) => {
  if (!type) return null;
  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-6"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md p-10 rounded-[32px] bg-[#0F172A] border border-white/10 relative"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-500 hover:text-white"><X size={20}/></button>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-4">
             <div className="w-8 h-8 bg-gradient-to-tr from-[#BFFF00] to-[#0070FF] rounded-lg" />
             <span className="font-bold tracking-tighter uppercase">Amwin Cloud</span>
          </div>
          <h2 className="text-3xl font-black italic uppercase">{type === 'login' ? 'Welcome Back' : 'Get Started'}</h2>
          <input type="email" placeholder="Email Address" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[#BFFF00]/50" />
          <input type="password" placeholder="Access Token" className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 outline-none focus:border-[#BFFF00]/50" />
          <button className="py-5 bg-gradient-to-r from-[#BFFF00] to-[#0070FF] text-black font-black rounded-2xl uppercase tracking-widest hover:brightness-110 transition-all">
            {type === 'login' ? 'Authorize' : 'Initialize'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function AmwinPremiumCRM() {
  const [authType, setAuthType] = useState<'login' | 'signup' | null>(null);

  return (
    <div className="bg-[#020617] text-white min-h-screen relative overflow-x-hidden font-sans">
      
      <AnimatePresence>
        {authType && <AuthOverlay type={authType} onClose={() => setAuthType(null)} />}
      </AnimatePresence>

      {/* 3D SCENE */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas>
          <PerspectiveCamera makeDefault position={[0, 0, 6]} fov={40} />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#BFFF00" />
          <Suspense fallback={null}>
             <group position={[1.5, 0, 0]}>
                <FacetedLogo />
             </group>
            <Environment preset="city" />
            <ContactShadows position={[1.5, -2, 0]} opacity={0.3} scale={10} blur={2} />
          </Suspense>
        </Canvas>
      </div>

      {/* NAVIGATION */}
      <nav className="fixed top-0 w-full z-50 p-8 flex justify-between items-center max-w-7xl mx-auto left-0 right-0">
        <div className="flex items-center gap-3 font-black text-xl italic tracking-tighter">
          <div className="p-2 bg-white/10 rounded-xl"><Command size={22} /></div>
          AMWIN CRM
        </div>
        <div className="flex items-center gap-8">
          <button onClick={() => setAuthType('login')} className="text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-white">Login</button>
          <button 
            onClick={() => setAuthType('signup')}
            className="px-6 py-3 bg-gradient-to-r from-[#BFFF00] to-[#0070FF] text-black rounded-full font-black text-[10px] uppercase tracking-widest"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO CONTENT */}
      <section className="relative pt-60 px-10 max-w-7xl mx-auto flex items-center min-h-screen">
        <div className="max-w-2xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1 rounded-full bg-[#BFFF00]/10 border border-[#BFFF00]/20 text-[#BFFF00] text-[10px] font-bold tracking-[0.3em] uppercase mb-6"
          >
            v4.0 Enterprise Neural CRM
          </motion.div>
          <h1 className="text-8xl font-black italic leading-[0.8] mb-8 uppercase tracking-tighter">
            Digital <br /> <span className="text-gray-500">Relationships.</span>
          </h1>
          <p className="text-gray-400 text-xl font-light max-w-lg mb-10">
            Harness the power of the AMWIN hexagonal matrix. predictive lead scoring and global sync in 0.04ms.
          </p>
          <button onClick={() => setAuthType('signup')} className="flex items-center gap-4 px-10 py-5 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all">
            ACTIVATE SYSTEM <ArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative z-10 py-20 bg-black/50 backdrop-blur-md border-y border-white/5">
        <div className="max-w-7xl mx-auto px-10 grid grid-cols-2 md:grid-cols-4 gap-10">
          {[
            { label: "Lead Precision", val: "99.2%" },
            { label: "Sync Latency", val: "0.04ms" },
            { label: "Secure Nodes", val: "14k+" },
            { label: "Data Uptime", val: "99.99%" }
          ].map((s, i) => (
            <div key={i}>
              <p className="text-[10px] font-black tracking-widest text-gray-600 uppercase">{s.label}</p>
              <h3 className="text-3xl font-bold italic">{s.val}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 py-20 px-10 text-center border-t border-white/5">
        <p className="text-[10px] font-bold tracking-[0.5em] text-gray-700 uppercase">
          © 2026 AMWIN SYSTEMS // BUILT FOR THE NEXT GENERATION
        </p>
      </footer>
    </div>
  );
}
