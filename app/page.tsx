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
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cpu, Globe, Shield, Command, ArrowRight, ExternalLink, Rss, X
} from 'lucide-react';
import * as THREE from 'three';

// --- STRUCTURAL HEXAGONAL LOGO (Based on shared image) ---
function StructuralLogo() {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      groupRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.1;
    }
  });

  // Colors extracted directly from your logo's facets
  const logoColors = [
    "#BFFF00", // Lime
    "#4CAF50", // Emerald
    "#0070FF", // Blue
    "#0000FF", // Deep Blue
    "#0052CC", // Cobalt
    "#00D4FF"  // Cyan
  ];

  // Hexagonal coordinates for 6 triangles
  const radialCoords = [
    [0, 1.5], [1.3, 0.75], [1.3, -0.75], 
    [0, -1.5], [-1.3, -0.75], [-1.3, 0.75]
  ];

  return (
    <group ref={groupRef} rotation={[0.4, 0, 0]}>
      <Float speed={3} rotationIntensity={1} floatIntensity={1.2}>
        {radialCoords.map((coord, i) => {
          const nextCoord = radialCoords[(i + 1) % 6];
          
          const shape = new THREE.Shape();
          shape.moveTo(0, 0);
          shape.lineTo(coord[0], coord[1]);
          shape.lineTo(nextCoord[0], nextCoord[1]);
          shape.closePath();

          const extrudeSettings = {
            steps: 1,
            depth: 0.4, // Provides the structural depth
            bevelEnabled: true,
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

// --- REUSABLE COMPONENTS ---
const NavLink = ({ children, href }: { children: React.ReactNode, href: string }) => (
  <a href={href} className="text-[10px] font-bold tracking-[0.2em] text-gray-500 hover:text-[#BFFF00] transition-colors uppercase">
    {children}
  </a>
);

export default function AmwinPremiumPage() {
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
      
      {/* 1. BACKGROUND ENGINE */}
      <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#BFFF00]/5 blur-[120px] rounded-full" />
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[-2, 0, 7]} fov={35} />
          <ambientLight intensity={0.5} />
          <pointLight position={[5, 5, 5]} color="#BFFF00" intensity={1.5} />
          <Suspense fallback={null}>
            <group position={[1.8, 0.2, 0]}>
              <StructuralLogo />
            </group>
            <Environment preset="night" />
            <ContactShadows position={[1.8, -2.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
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
            <span className="font-black text-xl tracking-tighter italic">AMWIN SYSTEMS</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <NavLink href="#infra">Infrastructure</NavLink>
            <NavLink href="#nodes">Nodes</NavLink>
            <NavLink href="#security">Security</NavLink>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
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
              Structural Cluster V4.0
            </div>
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-[0.8] mb-10 text-white italic">
              AMWIN <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">HEX.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
              Experience the power of structural adaptation. Our matrix handles enterprise-scale neural systems with zero-latency synchronization.
            </p>
            <div className="flex flex-wrap gap-5">
              <button 
                onClick={() => router.push('/signup')}
                className="group px-10 py-5 bg-gradient-to-r from-[#BFFF00] to-[#00D4FF] text-black font-black rounded-2xl flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[#BFFF00]/30"
              >
                DEPLOY CORE <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
          <div className="hidden lg:block h-[600px]" />
        </div>
      </section>

      {/* 4. DATA STRIP */}
      <section className="py-10 border-y border-white/5 bg-black/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-10 flex flex-wrap justify-between items-center gap-10">
          {[
            { label: "Active Nodes", value: "14,200+" },
            { label: "Throughput", value: "120 Tbps" },
            { label: "Latency", value: "0.04ms" },
            { label: "Security", value: "L-Grade" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase mb-1">{stat.label}</span>
              <span className="text-2xl font-bold tracking-tighter text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURES GRID */}
      <section id="infra" className="py-32 px-10 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-24">
            <h2 className="text-5xl font-black tracking-tighter italic mb-6">STRUCTURAL INTEGRITY.</h2>
            <p className="text-gray-500 leading-relaxed font-light italic">Every facet is an adaptation of high-performance computing logic designed for absolute stability.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <Cpu />, title: "Neural Processing", desc: "Optimized for massive parallel computation workloads and AI training." },
              { icon: <Globe />, title: "Mesh Fabric", desc: "Global state synchronization across every edge node in the matrix." },
              { icon: <Shield />, title: "Fortified Kernel", desc: "Military-grade encryption integrated directly into the hardware layer." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-12 rounded-[40px] bg-[#0B0E14] border border-white/5 hover:border-[#BFFF00]/50 transition-all duration-500 group"
              >
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#BFFF00] mb-10 group-hover:bg-[#BFFF00] group-hover:text-black transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION FOOTER */}
      <footer className="py-32 px-10 border-t border-white/5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#BFFF00] to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white/5 rounded-lg text-[#BFFF00]">
                <Command size={20} />
              </div>
              <span className="font-black text-xl tracking-tighter italic uppercase">Amwin Systems</span>
            </div>
            <p className="text-gray-500 text-xs tracking-widest leading-loose uppercase mb-10">
              Building the future of distributed adaptation. Scalable, secure, and ultra-realistic systems for the 2026 digital landscape.
            </p>
            <div className="flex gap-6">
              <ExternalLink size={18} className="text-gray-700 hover:text-white cursor-pointer transition-colors" />
              <Rss size={18} className="text-gray-700 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div className="text-right">
             <h4 className="text-[10px] font-black tracking-[0.4em] text-gray-700 uppercase mb-8">Integrations</h4>
             <div className="flex flex-col gap-4 text-xs font-bold text-gray-500 italic">
               <span className="hover:text-[#BFFF00] cursor-pointer transition-colors">Python SDK V4</span>
               <span className="hover:text-[#BFFF00] cursor-pointer transition-colors">Neural Mesh Client</span>
               <span className="hover:text-[#BFFF00] cursor-pointer transition-colors">Next.js Edge Runtime</span>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-32 flex justify-between items-center text-[10px] font-black tracking-widest text-gray-800 uppercase">
          <span>© 2026 AMWIN // ALL RIGHTS RESERVED</span>
          <div className="flex gap-10">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
