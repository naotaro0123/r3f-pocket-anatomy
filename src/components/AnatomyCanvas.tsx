import { Html, OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { MUSCLES, type MuscleId } from '../data/muscles'
import { MuscleModel } from './MuscleModel'

type AnatomyCanvasProps = {
  selectedMuscleId: MuscleId | null
  onSelectMuscle: (muscleId: MuscleId | null) => void
}

const MARKER_Y_OFFSET = 0.18

function AnatomyModel({
  selectedMuscleId,
  onSelectMuscle,
}: {
  selectedMuscleId: MuscleId | null
  onSelectMuscle: (muscleId: MuscleId) => void
}) {
  return (
    <group position={[0, -1.15, 0]}>
      <MuscleModel position={[0, 0.8, 0]} scale={2} />

      {MUSCLES.map((muscle, index) => (
        <Html
          key={muscle.id}
          position={[
            muscle.labelPosition[0],
            muscle.labelPosition[1] + MARKER_Y_OFFSET,
            muscle.labelPosition[2],
          ]}
          center
          occlude
        >
          <button
            type="button"
            className={`muscle-marker${muscle.id === selectedMuscleId ? ' is-active' : ''}`}
            onPointerDown={(event) => event.stopPropagation()}
            onPointerUp={(event) => event.stopPropagation()}
            onClick={(event) => {
              event.stopPropagation()
              onSelectMuscle(muscle.id)
            }}
            aria-label={`${index + 1}: ${muscle.name}`}
          >
            <span className="muscle-marker__index">{index + 1}</span>
            {muscle.id === selectedMuscleId ? (
              <span className="muscle-marker__callout">{muscle.name}</span>
            ) : null}
          </button>
        </Html>
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
        <color attach="background" args={['#87ceeb']} />
        <fog attach="fog" args={['#87ceeb', 8, 14]} />
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

        <Suspense fallback={null}>
          <AnatomyModel
            selectedMuscleId={selectedMuscleId}
            onSelectMuscle={onSelectMuscle}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          minDistance={4.8}
          maxDistance={8}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.85}
          target={[0, 1.6, 0]}
        />
      </Canvas>
    </div>
  )
}
