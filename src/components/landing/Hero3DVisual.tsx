import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Float } from '@react-three/drei';
import * as THREE from 'three';

// Individual floating task card component
interface TaskCardProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
  delay: number;
}

const TaskCard: React.FC<TaskCardProps> = ({ position, rotation, color, delay }) => {
  const meshRef = useRef<THREE.Mesh>(null);

  // Gentle rotation animation
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.rotation.y = rotation[1] + Math.sin(time * 0.3 + delay) * 0.1;
      meshRef.current.rotation.x = rotation[0] + Math.cos(time * 0.2 + delay) * 0.05;
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.2}
      floatIntensity={0.5}
      floatingRange={[-0.1, 0.1]}
    >
      <RoundedBox
        ref={meshRef}
        args={[1.2, 0.8, 0.1]}
        position={position}
        rotation={rotation}
        radius={0.05}
        smoothness={4}
      >
        <meshStandardMaterial
          color={color}
          metalness={0.1}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
        />
      </RoundedBox>
    </Float>
  );
};

// Mouse parallax effect component
const MouseParallax: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const { mouse } = state;
      groupRef.current.rotation.y = mouse.x * 0.1;
      groupRef.current.rotation.x = -mouse.y * 0.1;
    }
  });

  return <group ref={groupRef}>{children}</group>;
};

// 3D Scene component
const Scene: React.FC = () => {
  // Define task card positions and colors
  const cards = useMemo(
    () => [
      {
        position: [-1.5, 0.5, 0] as [number, number, number],
        rotation: [0.1, -0.3, 0.1] as [number, number, number],
        color: '#6366f1', // Indigo
        delay: 0,
      },
      {
        position: [0, 0, 0.5] as [number, number, number],
        rotation: [-0.1, 0.2, -0.05] as [number, number, number],
        color: '#8b5cf6', // Purple
        delay: 1,
      },
      {
        position: [1.5, -0.5, -0.2] as [number, number, number],
        rotation: [0.05, 0.4, -0.1] as [number, number, number],
        color: '#a855f7', // Light purple
        delay: 2,
      },
      {
        position: [-0.8, -1, 0.3] as [number, number, number],
        rotation: [-0.15, -0.1, 0.05] as [number, number, number],
        color: '#4f46e5', // Dark indigo
        delay: 3,
      },
      {
        position: [1, 1, -0.5] as [number, number, number],
        rotation: [0.2, -0.2, 0.1] as [number, number, number],
        color: '#7c3aed', // Medium purple
        delay: 4,
      },
    ],
    []
  );

  return (
    <MouseParallax>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8b5cf6" />
      
      {cards.map((card, index) => (
        <TaskCard key={index} {...card} />
      ))}
    </MouseParallax>
  );
};

// 2D Fallback component
const Fallback2D: React.FC = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-64 h-64">
        {/* Floating card illustrations */}
        <div className="absolute top-0 left-0 w-32 h-24 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg shadow-xl transform -rotate-6 animate-float" />
        <div className="absolute top-12 right-0 w-32 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-xl transform rotate-6 animate-float-delayed" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow-xl transform rotate-3 animate-float-slow" />
      </div>
    </div>
  );
};

// WebGL detection utility
const detectWebGL = (): boolean => {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!gl;
  } catch (e) {
    return false;
  }
};

// Main Hero3DVisual component
export const Hero3DVisual: React.FC = () => {
  const supportsWebGL = useMemo(() => detectWebGL(), []);
  const isMobile = useMemo(() => window.innerWidth < 768, []);

  // Use 2D fallback on mobile or if WebGL is not supported
  if (!supportsWebGL || isMobile) {
    return <Fallback2D />;
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          // Optimize renderer settings
          gl.setClearColor('#00000000', 0);
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        }}
      >
        <Scene />
      </Canvas>
    </div>
  );
};
