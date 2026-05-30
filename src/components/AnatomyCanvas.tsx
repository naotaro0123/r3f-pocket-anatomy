import { OrbitControls } from '@react-three/drei'
import { Canvas, type ThreeEvent } from '@react-three/fiber'
import { useMemo, useState } from 'react'
import { type MuscleId, MUSCLES, MUSCLE_PARTS } from '../data/muscles'

type AnatomyCanvasProps = {
  selectedMuscleId: MuscleId | null
  onSelectMuscle: (muscleId: MuscleId | null) => void
}

type MusclePartMeshProps = {
  part: (typeof MUSCLE_PARTS)[number]
  isActive: boolean
  onSelectMuscle: (muscleId: MuscleId) => void
}

function BodySilhouette() {
  return (
    <group>
      <mesh position={[0, 3.95, 0]} castShadow>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshStandardMaterial color="#40506e" metalness={0.15} roughness={0.45} />
      </mesh>

      <mesh position={[0, 2.35, 0]} castShadow>
        <capsuleGeometry args={[0.8, 2.4, 12, 24]} />
        <meshStandardMaterial color="#3b4965" metalness={0.1} roughness={0.55} />
      </mesh>

      <mesh position={[-1.22, 2.45, 0]} rotation={[0, 0, -0.1]} castShadow>
        <capsuleGeometry args={[0.22, 1.8, 12, 24]} />
        <meshStandardMaterial color="#32405b" metalness={0.08} roughness={0.62} />
      </mesh>
      <mesh position={[1.22, 2.45, 0]} rotation={[0, 0, 0.1]} castShadow>
        <capsuleGeometry args={[0.22, 1.8, 12, 24]} />
        <meshStandardMaterial color="#32405b" metalness={0.08} roughness={0.62} />
      </mesh>

      <mesh position={[-0.48, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.3, 2.2, 12, 24]} />
        <meshStandardMaterial color="#2f3b55" metalness={0.08} roughness={0.68} />
      </mesh>
      <mesh position={[0.48, 0.15, 0]} castShadow>
        <capsuleGeometry args={[0.3, 2.2, 12, 24]} />
        <meshStandardMaterial color="#2f3b55" metalness={0.08} roughness={0.68} />
      </mesh>
    </group>
  )
}

function MusclePartMesh({ part, isActive, onSelectMuscle }: MusclePartMeshProps) {
  const [isHovered, setIsHovered] = useState(false)

  const muscle = useMemo(
    () => MUSCLES.find((candidate) => candidate.id === part.muscleId),
    [part.muscleId],
  )

  const color = isActive ? '#fda4af' : isHovered ? '#fb7185' : muscle?.color ?? '#f97316'

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation()
    onSelectMuscle(part.muscleId)
  }

  const commonProps = {
    position: part.position,
    rotation: part.rotation,
    scale: part.scale,
    castShadow: true,
    receiveShadow: true,
    onClick: handleClick,
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation()
      setIsHovered(true)
      document.body.style.cursor = 'pointer'
    },
    onPointerOut: () => {
      setIsHovered(false)
      document.body.style.cursor = 'auto'
    },
  }

  return (
    <mesh {...commonProps}>
      {part.geometry === 'box' ? (
        <boxGeometry args={[1, 1, 1]} />
      ) : (
        <capsuleGeometry args={[0.4, 0.9, 12, 18]} />
      )}
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.14} />
    </mesh>
  )
}

function AnatomyModel({
  selectedMuscleId,
  onSelectMuscle,
}: {
  selectedMuscleId: MuscleId | null
  onSelectMuscle: (muscleId: MuscleId) => void
}) {
  return (
    <group position={[0, -1.45, 0]}>
      <BodySilhouette />

      {MUSCLE_PARTS.map((part) => (
        <MusclePartMesh
          key={part.id}
          part={part}
          isActive={part.muscleId === selectedMuscleId}
          onSelectMuscle={onSelectMuscle}
        />
      ))}
    </group>
  )
}

export function AnatomyCanvas({ selectedMuscleId, onSelectMuscle }: AnatomyCanvasProps) {
  return (
    <div className="canvas-stage">
      <Canvas
        shadows
        camera={{ position: [0, 1.8, 6.4], fov: 32 }}
        onPointerMissed={() => onSelectMuscle(null)}
      >
        <color attach="background" args={['#020814']} />
        <fog attach="fog" args={['#020814', 8, 14]} />
        <ambientLight intensity={0.9} />
        <directionalLight
          castShadow
          intensity={2.8}
          position={[4, 7, 4]}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight intensity={18} position={[-4, 2, 2]} color="#60a5fa" />
        <pointLight intensity={10} position={[4, 1, -2]} color="#f472b6" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
          <circleGeometry args={[8, 64]} />
          <shadowMaterial opacity={0.24} />
        </mesh>

        <AnatomyModel
          selectedMuscleId={selectedMuscleId}
          onSelectMuscle={onSelectMuscle}
        />

        <OrbitControls
          enablePan={false}
          minDistance={4.8}
          maxDistance={8}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.85}
          target={[0, 1.2, 0]}
        />
      </Canvas>
    </div>
  )
}
