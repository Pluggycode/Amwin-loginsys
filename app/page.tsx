"use client";

import { Canvas } from "@react-three/fiber";
import { Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e3a8a] to-[#4f46e5] text-white overflow-hidden">

      {/* 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <ambientLight intensity={1} />
          <directionalLight position={[2, 2, 2]} />

          <Float speed={2} rotationIntensity={2} floatIntensity={3}>
            <Sphere args={[1, 100, 200]} scale={2.5}>
              <MeshDistortMaterial
                color="#6366f1"
                attach="material"
                distort={0.4}
                speed={2}
                roughness={0}
              />
            </Sphere>
          </Float>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">

        {/* Navbar */}
        <div className="absolute top-0 w-full flex justify-between p-6">
          <h1 className="text-xl font-bold">Amwin CRM</h1>

          <div className="flex gap-4">
            <button
              onClick={() => router.push("/login")}
              className="px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md hover:bg-white/20"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600"
            >
              Get Started
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-6xl font-bold leading-tight"
        >
          Smart CRM for <br /> Modern Businesses
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 text-lg text-gray-200 max-w-xl"
        >
          Manage sales, support, and operations seamlessly with Amwin Systems CRM.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex gap-4"
        >
          <button
            onClick={() => router.push("/signup")}
            className="px-6 py-3 bg-indigo-500 rounded-xl text-lg hover:bg-indigo-600 transition"
          >
            Get Started
          </button>

          <button
            className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-xl hover:bg-white/20"
          >
            Learn More
          </button>
        </motion.div>
      </div>
    </div>
  );
}