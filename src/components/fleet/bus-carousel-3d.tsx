"use client";

import { useRef, useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BUS_MODELS } from "@/constants/bus-models";
import { AnimatePresence, motion } from "framer-motion";

interface BusModel3DProps {
  busColor: string;
}

function BusModel3D({ busColor }: BusModel3DProps) {
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (groupRef.current) {
      gsap.fromTo(
        groupRef.current.rotation,
        { y: -Math.PI / 4 },
        {
          y: Math.PI / 4,
          duration: 8,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        }
      );
    }
  }, []);

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 2, 8]} />
        <meshStandardMaterial color={busColor} metalness={0.3} roughness={0.4} />
      </mesh>

      <mesh position={[0, -0.5, 3]}>
        <boxGeometry args={[3.8, 1, 1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      <mesh position={[-1.5, -1.2, 1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.5, -1.2, 1]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[-1.5, -1.2, -2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
      <mesh position={[1.5, -1.2, -2]}>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 16]} />
        <meshStandardMaterial color="#333" />
      </mesh>
    </group>
  );
}

interface CarouselSceneProps {
  busColor: string;
}

function CarouselScene({ busColor }: CarouselSceneProps) {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);

  useEffect(() => {
    if (cameraRef.current) {
      cameraRef.current.lookAt(0, 0, 0);
    }
  }, []);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault position={[12, 5, 12]} fov={50} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, 5, -5]} intensity={0.5} />
      <spotLight position={[0, 15, 0]} angle={0.3} intensity={0.8} />

      <BusModel3D busColor={busColor} />

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.5, 0]} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>
    </>
  );
}

const busColors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#8B5CF6",
  "#EF4444",
  "#06B6D4",
];

export function BusCarousel3D() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const totalItems = BUS_MODELS.length;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalItems - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === totalItems - 1 ? 0 : prev + 1));
  };

  const currentBus = BUS_MODELS[currentIndex];
  const currentColor = busColors[currentIndex % busColors.length];

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card className="relative h-[600px] overflow-hidden bg-background-dark">
        <Canvas>
          <CarouselScene busColor={currentColor} />
        </Canvas>

        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm hover:bg-surface transition-colors disabled:opacity-50"
        >
          <ChevronLeft className="h-6 w-6 text-foreground" />
        </button>

        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-surface/80 backdrop-blur-sm hover:bg-surface transition-colors disabled:opacity-50"
        >
          <ChevronRight className="h-6 w-6 text-foreground" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {BUS_MODELS.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentIndex ? "w-8 bg-primary-light" : "w-2 bg-surface-light"
              }`}
            />
          ))}
        </div>
      </Card>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="h-[600px]"
        >
          <Card className="p-6 h-full flex flex-col">
            <div className="space-y-4 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">
                    {currentBus.manufacturer} {currentBus.modelName}
                  </h3>
                  <p className="text-sm text-text-secondary">
                    Modelo {currentIndex + 1} de {totalItems}
                  </p>
                </div>
                <div
                  className="h-16 w-16 rounded-full"
                  style={{ backgroundColor: currentColor }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <p className="text-xs text-text-secondary">Rango</p>
                  <p className="text-lg font-semibold">{currentBus.rangeKm} km</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Batería</p>
                  <p className="text-lg font-semibold">{currentBus.batteryCapacityKwh} kWh</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Capacidad</p>
                  <p className="text-lg font-semibold">{currentBus.passengerCapacity} pas.</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Consumo</p>
                  <p className="text-lg font-semibold">{currentBus.energyConsumptionKwhPerKm} kWh/km</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <p className="text-xs text-text-secondary">Tiempo de Carga</p>
                  <p className="text-sm font-medium">{currentBus.chargingTimeHours} horas</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Costo</p>
                  <p className="text-sm font-medium">${(currentBus.unitCostUsd / 1000).toFixed(0)}K USD</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Garantía</p>
                  <p className="text-sm font-medium">{currentBus.warrantyYears} años</p>
                </div>
                <div>
                  <p className="text-xs text-text-secondary">Dimensiones</p>
                  <p className="text-sm font-medium">
                    {currentBus.lengthMeters}m × {currentBus.widthMeters}m
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
