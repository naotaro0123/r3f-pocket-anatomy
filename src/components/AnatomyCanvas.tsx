import { Html, OrbitControls, Stats } from '@react-three/drei'
import { Canvas, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { MUSCLES, type MuscleId } from '../data/muscles'
import { MuscleModel } from './MuscleModel'

type AnatomyCanvasProps = {
  selectedMuscleId: MuscleId | null
  onSelectMuscle: (muscleId: MuscleId | null) => void
}

const MARKER_Y_OFFSET = 0.18
const CAMERA_TARGET: [number, number, number] = [0, 1.55, 0]

const CAMERA_PRESETS = {
  front: {
    label: 'フロントビュー',
    position: [0, 1.9, 7.9] as [number, number, number],
  },
  side: {
    label: 'サイドビュー',
    position: [7.9, 1.9, 0] as [number, number, number],
  },
  topRight: {
    label: 'クォータービュー',
    position: [6.1, 3.05, 6.1] as [number, number, number],
  },
} as const

type CameraPresetKey = keyof typeof CAMERA_PRESETS

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

function CameraPresetController({
  controlsRef,
  preset,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>
  preset: CameraPresetKey
}) {
  const { camera } = useThree()

  useEffect(() => {
    const controls = controlsRef.current
    const { position } = CAMERA_PRESETS[preset]

    camera.position.set(...position)
    camera.lookAt(...CAMERA_TARGET)

    if (controls) {
      controls.target.set(...CAMERA_TARGET)
      controls.update()
    }
  }, [camera, controlsRef, preset])

  return null
}

export function AnatomyCanvas({ selectedMuscleId, onSelectMuscle }: AnatomyCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null)
  const [cameraPreset, setCameraPreset] = useState<CameraPresetKey>('front')
  const [statsParent, setStatsParent] = useState<HTMLDivElement | null>(null)
  const statsParentRef = useMemo(
    () => (statsParent ? { current: statsParent } : undefined),
    [statsParent],
  )

  return (
    <div ref={setStatsParent} className="canvas-stage">
      <div className="camera-debug-panel" aria-label="camera presets">
        {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            className={`camera-debug-button${cameraPreset === key ? ' is-active' : ''}`}
            onClick={() => setCameraPreset(key as CameraPresetKey)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        shadows
        camera={{ position: CAMERA_PRESETS.front.position, fov: 32 }}
        onPointerMissed={() => onSelectMuscle(null)}
      >
        {statsParentRef ? <Stats parent={statsParentRef} className="canvas-stats" /> : null}
        <color attach="background" args={['#87ceeb']} />
        <fog attach="fog" args={['#87ceeb', 8, 14]} />
        <ambientLight intensity={0.9} />
        <directionalLight
          castShadow
          intensity={2.8}
          position={[4, 7, 4]}
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight intensity={18} position={[-4, 2, 2]} color="#60a5fa" />
        <pointLight intensity={10} position={[4, 1, -2]} color="#f472b6" />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.2, 0]} receiveShadow>
          <circleGeometry args={[8, 64]} />
          <shadowMaterial opacity={0.24} />
        </mesh>

        <Suspense fallback={null}>
          <CameraPresetController controlsRef={controlsRef} preset={cameraPreset} />
          <AnatomyModel selectedMuscleId={selectedMuscleId} onSelectMuscle={onSelectMuscle} />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={4.8}
          maxDistance={10}
          minPolarAngle={Math.PI / 3.2}
          maxPolarAngle={Math.PI / 1.85}
          target={CAMERA_TARGET}
        />
      </Canvas>
    </div>
  )
}
