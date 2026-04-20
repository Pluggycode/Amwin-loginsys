"use client";

import React, { Suspense, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
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
  Users, BarChart3, X
} from 'lucide-react';
import * as THREE from 'three';

// --- CUSTOM 3D LOGO GEOMETRY (Based on image_0.png) ---
function FacetedLogo({ scrollPos }: { scrollPos: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4 + (scrollPos * 0.001);
      meshRef.current.rotation.x = 0.2 + (scrollPos * 0.0002); // Subtle tilt on scroll
    }
  });

  // 1. Generate the custom faceted hexagonal/cube shape from image_0.png
  // The structure is 6 triangles meeting at a central point, forming a hexagon
  const geometry = React.useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      // Top central point
       0.0,  0.8,  0.0, // Vertex 0
      // 6 Outer perimeter points (Hexagon)
       0.0,  1.6, -1.0, // 1 (Lime Green)
       1.38, 1.2, -0.5, // 2 (Emerald)
       1.38, 0.4, -0.5, // 3 (Cobalt)
       0.0,  0.0, -1.0, // 4 (Sapphire)
      -1.38, 0.4, -0.5, // 5 (Light Blue)
      -1.38, 1.2, -0.5, // 6 (Mint)
    ]);
    
    // We need indices to form the 6 triangles (facets) from the logo
    const indices = [
      0, 1, 2,  // Facet 1 (Lime -> Emerald)
      0, 2, 3,  // Facet 2 (Emerald -> Cobalt)
      0, 3, 4,  // Facet 3 (Cobalt -> Sapphire)
      0, 4, 5,  // Facet 4 (Sapphire -> Light Blue)
      0, 5, 6,  // Facet 5 (Light Blue -> Mint)
      0, 6, 1,  // Facet 6 (Mint -> Lime)
    ];

    geo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  // 2. Custom Shader (recreates the Green-to-Blue logo gradient from image_0.png)
  const material = React.useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        colorGreen: { value: new THREE.Color("#BFFF00") }, // Bright Lime
        colorBlue: { value: new THREE.Color("#0047AB") },  // Deep Cobalt
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
          vUv = uv;
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float time;
        uniform vec3 colorGreen;
        uniform vec3 colorBlue;

        void main() {
          // Calculate lighting (basic fake lighting for faceted look)
          float light = dot(vNormal, vec3(0.5, 0.5, 1.0));
          
          // Vertical Gradient from Green (top) to Blue (bottom), matching the logo
          float gradient = (vNormal.y + 1.0) * 0.5; // Map -1 to 1 normal range to 0 to 1
          vec3 baseColor = mix(colorBlue, colorGreen, gradient);
          
          // Add subtle pulse
          baseColor *= (1.0 + 0.1 * sin(time * 2.0));

          gl_FragColor = vec4(baseColor * light, 1.0);
        }
      `,
      wireframe: false,
    });
  }, []);

  useFrame((state) => {
    material.uniforms.time.value = state.clock.getElapsedTime();
  });

  return (
    <group scale={1.2}>
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh ref={meshRef} geometry={geometry} material={material} />
      </Float>
    </group>
  );
}

// --- AUTHENTICATION OVERLAY (Login & Get Started) ---
interface AuthOverlayProps {
  type: 'login' | 'signup' | null;
  onClose: () => void;
}

const AuthOverlay: React.FC<AuthOverlayProps> = ({ type, onClose }) => {
  if (!type) return null;

  const isLogin = type === 'login';

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-10"
    >
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 20 }}
        className="relative w-full max-w-lg p-12 rounded-3xl bg-[#0B0E14] border border-white/10 shadow-3xl"
      >
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-600 hover:text-white transition-colors"><X size={24}/></button>
        
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-gradient-to-br from-[#BFFF00] to-[#0047AB] rounded-lg text-black"><Command size={20}/></div>
          <span className="font-black text-xl tracking-tighter italic uppercase text-white">Amwin CRM</span>
        </div>

        <h3 className="text-4xl font-black tracking-tighter italic mb-4 text-white uppercase">
          {isLogin ? 'Initiate Sync.' : 'Deploy Sync Node.'}
        </h3>
        <p className="text-gray-500 mb-12 text-sm leading-relaxed font-light">
          {isLogin ? 'Establish connection to your neural pipeline.' : 'Configure your global instance for immediate throughput.'}
        </p>

        <form className="flex flex-col gap-6">
          {!isLogin && (
            <input type="text" placeholder="Global Instance Name" className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-gray-600 focus:border-[#BFFF00]/50 transition-colors" />
          )}
          <input type="email" placeholder="Authorized Email Address" className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-gray-600 focus:border-[#BFFF00]/50 transition-colors" />
          <input type="password" placeholder="L-Grade Security Key" className="w-full px-6 py-4 rounded-xl bg-white/5 border border-white/5 text-sm text-white placeholder:text-gray-600 focus:border-[#BFFF00]/50 transition-colors" />
          
          <button className="group mt-6 px-10 py-5 bg-gradient-to-r from-[#BFFF00] to-[#0047AB] text-black font-black rounded-2xl flex items-center justify-center gap-4 hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-[#BFFF00]/10">
            {isLogin ? 'VALIDATE KEY' : 'INITIATE DEPLOYMENT'} <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
};

// --- REUSABLE COMPONENTS ---
const NavLink = ({ children, href }: { children: React.ReactNode, href: string }) => (
  <a href={href} className="text-[10px] font-bold tracking-[0.2em] text-gray-500 hover:text-[#BFFF00] transition-colors uppercase">
    {children}
  </a>
);

// --- MAIN CRM PAGE ---
export default function AmwinPremiumCRM() {
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollPos, setScrollPos] = useState(0);
  const [authType, setAuthType] = useState<'login' | 'signup' | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      setScrollPos(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <div className="bg-[#020617] text-white selection:bg-[#BFFF00]/30 antialiased font-sans overflow-x-hidden relative">
      
      {/* 0. AUTH OVERLAY */}
      <AnimatePresence>
        {authType && <AuthOverlay type={authType} onClose={() => setAuthType(null)} />}
      </AnimatePresence>

      {/* 1. BACKGROUND ENGINE (3D Model based on image_0.png logo) */}
      <div className="fixed inset-0 z-0 h-screen w-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#BFFF00]/5 blur-[120px] rounded-full" />
        <Canvas shadows>
          <PerspectiveCamera makeDefault position={[-2, 0, 7]} fov={35} />
          <ambientLight intensity={0.4} />
          <Suspense fallback={null}>
            <group position={[1.8, 0.2, 0]} rotation={[0.4, 0, 0]}>
              <FacetedLogo scrollPos={scrollPos} />
            </group>
            <Environment preset="night" />
            <ContactShadows position={[1.8, -2.5, 0]} opacity={0.4} scale={15} blur={2.5} far={4} />
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
        </Canvas>
      </div>

      {/* 2. HEADER (Uses the custom Green-to-Blue Palette) */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 border-b ${
        scrolled ? 'bg-[#020617]/80 backdrop-blur-xl border-white/5 py-4 shadow-2xl' : 'bg-transparent border-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto px-10 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group">
            {/* The Gradient Box uses the exact logo palette */}
            <div className="p-2 bg-gradient-to-br from-[#BFFF00] to-[#0047AB] rounded-xl text-black shadow-lg shadow-[#BFFF00]/10 group-hover:scale-110 transition-transform">
              <Command size={22} />
            </div>
            <span className="font-black text-xl tracking-tighter italic">AMWIN CRM</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10">
            <NavLink href="#features">Platform</NavLink>
            <NavLink href="#intelligence">Neural AI</NavLink>
            <NavLink href="#enterprise">Enterprise</NavLink>
            <div className="h-4 w-[1px] bg-white/10 mx-2" />
            
            {/* 3. LOGIN FUNCTIONALITY */}
            <button onClick={() => setAuthType('login')} className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white transition-colors">LOGIN</button>
            
            {/* 4. GET STARTED FUNCTIONALITY (Updated styling to match logo palette) */}
            <button 
              onClick={() => setAuthType('signup')}
              className="px-6 py-3 bg-gradient-to-r from-[#BFFF00] to-[#0047AB] text-black rounded-full font-black text-[10px] uppercase tracking-[0.15em] hover:brightness-110 transition-all shadow-xl shadow-[#BFFF00]/10"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* 3. HERO SECTION (Updated palette to Green/Blue) */}
      <section className="relative min-h-screen flex items-center pt-20 px-10 z-10">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#BFFF00]/5 border border-[#BFFF00]/20 text-[#BFFF00] text-[10px] font-black tracking-[0.3em] mb-8 uppercase">
              <div className="w-2 h-2 bg-[#BFFF00] rounded-full animate-pulse" />
              Intelligence Layer V4.0
            </div>
            <h1 className="text-7xl md:text-[8rem] font-black tracking-tighter leading-[0.8] mb-10 text-white italic uppercase">
              Client <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-600">Synapse.</span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-12 leading-relaxed font-light">
              The world's first CRM powered by distributed neural adaptation. Transform raw data into predictive relationship intelligence with zero latency.
            </p>
            <div className="flex flex-wrap gap-5">
              <button onClick={() => setAuthType('signup')} className="group px-10 py-5 bg-gradient-to-r from-[#BFFF00] to-[#0047AB] text-black font-black rounded-2xl flex items-center gap-4 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-[#BFFF00]/20">
                INITIATE SYNC <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
          <div className="hidden lg:block h-[600px]" />
        </div>
      </section>

      {/* 4. CRM KPI STRIP */}
      <section className="py-10 border-y border-white/5 bg-black/40 backdrop-blur-sm relative z-20">
        <div className="max-w-7xl mx-auto px-10 flex flex-wrap justify-between items-center gap-10">
          {[
            { label: "Sync Velocity", value: "0.04ms" },
            { label: "Security", value: "L-Grade" },
            { label: "Lead Scoring", value: "Neural" },
            { label: "Uptime", value: "99.999%" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-[10px] font-black tracking-widest text-gray-600 uppercase mb-1">{stat.label}</span>
              <span className="text-2xl font-bold tracking-tighter text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 5. CRM FEATURES GRID */}
      <section id="features" className="py-32 px-10 bg-black relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-24">
            <h2 className="text-5xl font-black tracking-tighter italic mb-6 uppercase text-white">Predictive Intelligence.</h2>
            <p className="text-gray-500 leading-relaxed font-light italic">AMWIN CRM doesn't just store data; it anticipates the needs of your next major acquisition.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: <Cpu />, title: "Neural Lead Scoring", desc: "AI-driven probability matrices that identify high-value targets before they even enter your funnel." },
              { icon: <Shield />, title: "Fortified Pipeline", desc: "Military-grade encryption integrated directly into the hardware layer. L-Grade data protection." },
              { icon: <BarChart3 />, title: "Autonomous Analytics", desc: "Automated forecasting models that adapt to global market fluctuations in real-time." }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-12 rounded-[40px] bg-[#0B0E14] border border-white/5 hover:border-[#BFFF00]/50 transition-all duration-500 group"
              >
                {/* Updated Feature Icons to use the Green palette */}
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-[#BFFF00] mb-10 group-hover:bg-[#BFFF00] group-hover:text-black transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. ECOSYSTEM / FOOTER */}
      <footer id="enterprise" className="py-32 px-10 border-t border-white/5 relative overflow-hidden bg-[#020617] z-10">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0047AB] to-transparent opacity-50" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-20">
          <div className="max-w-md">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-white/5 rounded-lg text-white"><Command size={20} /></div>
              <span className="font-black text-xl tracking-tighter italic uppercase text-white">Amwin Systems</span>
            </div>
            <p className="text-gray-500 text-xs tracking-widest leading-loose uppercase mb-10">
              The infrastructure for 2026's elite sales teams. Global synchronization for a decentralized world.
            </p>
          </div>

          <div className="text-right">
             <h4 className="text-[10px] font-black tracking-[0.4em] text-gray-700 uppercase mb-8">Ecosystem</h4>
             <div className="flex flex-col gap-4 text-xs font-bold text-gray-500 italic">
               <span className="hover:text-[#BFFF00] cursor-pointer transition-colors flex items-center justify-end gap-2">Salesforce Bridge <ExternalLink size={12}/></span>
               <span className="hover:text-[#BFFF00] cursor-pointer transition-colors flex items-center justify-end gap-2">Neural API <Cpu size={12}/></span>
               <span className="hover:text-[#BFFF00] cursor-pointer transition-colors flex items-center justify-end gap-2">Edge CRM Runtime <BarChart3 size={12}/></span>
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
