import { Billboard, Html, OrbitControls, Stats, Text } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { MUSCLES, type MuscleId } from "../data/muscles";
import { MuscleModel } from "./MuscleModel";

type AnatomyCanvasProps = {
  highlightedMuscleId: MuscleId | null;
  selectedMuscleId: MuscleId | null;
  onHighlightMuscle: (muscleId: MuscleId | null) => void;
  onSelectMuscle: (muscleId: MuscleId | null) => void;
};

const MARKER_Y_OFFSET = 0.18;
const MARKER_Z_OFFSET = 0.18;
const CALLOUT_X_OFFSET = 0.24;
const CALLOUT_Y_OFFSET = 0.1;
const MARKER_RADIUS = 0.115;
const MARKER_RING_RADIUS = 0.13;
const MARKER_FONT_SIZE = 0.105;
const CAMERA_TARGET: [number, number, number] = [0, 1.55, 0];

const CAMERA_PRESETS = {
  front: {
    label: "フロントビュー",
    position: [0, 1.9, 7.9] as [number, number, number],
  },
  side: {
    label: "サイドビュー",
    position: [7.9, 1.9, 0] as [number, number, number],
  },
  topRight: {
    label: "クォータービュー",
    position: [6.1, 3.05, 6.1] as [number, number, number],
  },
} as const;

type CameraPresetKey = keyof typeof CAMERA_PRESETS;

function MuscleMarker({
  index,
  isActive,
  muscleId,
  onHighlightMuscle,
  position,
  onSelectMuscle,
}: {
  index: number;
  isActive: boolean;
  muscleId: MuscleId;
  onHighlightMuscle: (muscleId: MuscleId | null) => void;
  position: [number, number, number];
  onSelectMuscle: (muscleId: MuscleId) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleSelect = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    onSelectMuscle(muscleId);
  };

  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(true);
    onHighlightMuscle(muscleId);
  };

  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsHovered(false);
    onHighlightMuscle(null);
  };

  return (
    <Billboard position={position} follow>
      <group>
        <mesh
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          position={[0, 0, -0.001]}
        >
          <ringGeometry args={[MARKER_RING_RADIUS, MARKER_RING_RADIUS + 0.015, 32]} />
          <meshBasicMaterial
            color={isActive || isHovered ? "#fb7185" : "#e2e8f0"}
            opacity={isActive ? 0.92 : isHovered ? 0.78 : 0.58}
            transparent
          />
        </mesh>
        <mesh
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <circleGeometry args={[MARKER_RADIUS, 32]} />
          <meshBasicMaterial
            color={isActive ? "#be185d" : isHovered ? "#1e293b" : "#0f172a"}
            opacity={isActive ? 0.88 : isHovered ? 0.8 : 0.62}
            transparent
          />
        </mesh>
        <Text
          position={[0, 0, 0.02]}
          fontSize={MARKER_FONT_SIZE}
          color="#f8fafc"
          anchorX="center"
          anchorY="middle"
          onClick={handleSelect}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          {index + 1}
        </Text>
      </group>
    </Billboard>
  );
}

function AnatomyModel({
  highlightedMuscleId,
  selectedMuscleId,
  onHighlightMuscle,
  onSelectMuscle,
}: {
  highlightedMuscleId: MuscleId | null;
  selectedMuscleId: MuscleId | null;
  onHighlightMuscle: (muscleId: MuscleId | null) => void;
  onSelectMuscle: (muscleId: MuscleId) => void;
}) {
  const selectedMuscle = selectedMuscleId
    ? (MUSCLES.find((muscle) => muscle.id === selectedMuscleId) ?? null)
    : null;
  const highlightedOrSelectedMuscleId = highlightedMuscleId ?? selectedMuscleId;

  return (
    <group position={[0, -1.15, 0]}>
      <MuscleModel
        position={[0, 0.8, 0]}
        scale={2}
        selectedMuscleId={highlightedOrSelectedMuscleId}
      />

      {MUSCLES.map((muscle, index) => (
        <MuscleMarker
          key={muscle.id}
          index={index}
          isActive={muscle.id === selectedMuscleId}
          muscleId={muscle.id}
          onHighlightMuscle={onHighlightMuscle}
          position={[
            muscle.labelPosition[0],
            muscle.labelPosition[1] + MARKER_Y_OFFSET,
            muscle.labelPosition[2] + MARKER_Z_OFFSET,
          ]}
          onSelectMuscle={onSelectMuscle}
        />
      ))}

      {selectedMuscle ? (
        <Html
          position={[
            selectedMuscle.labelPosition[0] + CALLOUT_X_OFFSET,
            selectedMuscle.labelPosition[1] + MARKER_Y_OFFSET + CALLOUT_Y_OFFSET,
            selectedMuscle.labelPosition[2] + MARKER_Z_OFFSET,
          ]}
          style={{ pointerEvents: "none" }}
        >
          <div className="muscle-callout">{selectedMuscle.name}</div>
        </Html>
      ) : null}
    </group>
  );
}

function CameraPresetController({
  controlsRef,
  preset,
}: {
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
  preset: CameraPresetKey;
}) {
  const { camera } = useThree();

  useEffect(() => {
    const controls = controlsRef.current;
    const { position } = CAMERA_PRESETS[preset];

    camera.position.set(...position);
    camera.lookAt(...CAMERA_TARGET);

    if (controls) {
      controls.target.set(...CAMERA_TARGET);
      controls.update();
    }
  }, [camera, controlsRef, preset]);

  return null;
}

export function AnatomyCanvas({
  highlightedMuscleId,
  selectedMuscleId,
  onHighlightMuscle,
  onSelectMuscle,
}: AnatomyCanvasProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [cameraPreset, setCameraPreset] = useState<CameraPresetKey>("front");
  const [statsParent, setStatsParent] = useState<HTMLDivElement | null>(null);
  const statsParentRef = useMemo(
    () => (statsParent ? { current: statsParent } : undefined),
    [statsParent],
  );

  return (
    <div ref={setStatsParent} className="canvas-stage">
      <div className="camera-debug-panel" aria-label="camera presets">
        {Object.entries(CAMERA_PRESETS).map(([key, preset]) => (
          <button
            key={key}
            type="button"
            className={`camera-debug-button${cameraPreset === key ? " is-active" : ""}`}
            onClick={() => setCameraPreset(key as CameraPresetKey)}
          >
            {preset.label}
          </button>
        ))}
      </div>

      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        shadows
        camera={{ position: CAMERA_PRESETS.front.position, fov: 32 }}
        onPointerMissed={() => {
          onHighlightMuscle(null);
          onSelectMuscle(null);
        }}
      >
        {statsParentRef ? <Stats parent={statsParentRef} className="canvas-stats" /> : null}
        <color attach="background" args={["#87ceeb"]} />
        <fog attach="fog" args={["#87ceeb", 8, 14]} />
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
          <AnatomyModel
            highlightedMuscleId={highlightedMuscleId}
            selectedMuscleId={selectedMuscleId}
            onHighlightMuscle={onHighlightMuscle}
            onSelectMuscle={onSelectMuscle}
          />
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
  );
}
