import { useAnimations, useGLTF } from "@react-three/drei";
import { useGraph, type ThreeElements, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import {
  FrontSide,
  type Bone,
  type Group,
  type MeshStandardMaterial,
  type SkinnedMesh,
} from "three";
import { SkeletonUtils, type GLTF } from "three-stdlib";
import {
  GLTF_HIGHLIGHTABLE_MUSCLE_IDS,
  MUSCLES,
  MUSCLE_PARTS,
  type MuscleId,
} from "../data/muscles";
import { AtlasMuscleModel } from "./AtlasMuscleModel";

type MuscleModelProps = ThreeElements["group"] & {
  onHighlightMuscle?: (muscleId: MuscleId | null) => void;
  selectedMuscleId?: MuscleId | null;
};
type RotationTuple = [number, number, number];
type GLTFResult = GLTF & {
  nodes: {
    mixamorigHips: Bone;
    Alpha_Joints: SkinnedMesh;
    Alpha_Surface: SkinnedMesh;
    // 下記のMaterialはAlpha_Body_MATを共有
  } & Record<MuscleId, SkinnedMesh>;
  materials: {
    Alpha_Joints_MAT: MeshStandardMaterial;
    Alpha_Body_MAT: MeshStandardMaterial;
  };
};
type MuscleGraph = Pick<GLTFResult, "nodes" | "materials">;

const MODEL_URL = import.meta.env.VITE_MUSCLE_MODEL_URL?.trim() || "/models/atlas.json";
const MODEL_ROTATION: RotationTuple = [
  toRadians(import.meta.env.VITE_MUSCLE_MODEL_ROTATION_X, 90),
  toRadians(import.meta.env.VITE_MUSCLE_MODEL_ROTATION_Y, 0),
  toRadians(import.meta.env.VITE_MUSCLE_MODEL_ROTATION_Z, 0),
];
const MODEL_SCALE = toNumber(import.meta.env.VITE_MUSCLE_MODEL_SCALE, 0.01);
const MUSCLE_COLOR_BY_ID = new Map(MUSCLES.map((muscle) => [muscle.id, muscle.color]));
const HIGHLIGHT_COLOR = "#fb7185";
const HIGHLIGHT_BASE_COLOR = "#fda4af";
const HIGHLIGHT_EMISSIVE_INTENSITY = 1.8;

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function toRadians(value: string | undefined, fallbackDegrees: number) {
  return (toNumber(value, fallbackDegrees) * Math.PI) / 180;
}

function createMuscleMaterial(
  baseMaterial: MeshStandardMaterial,
  muscleId: MuscleId,
  selectedMuscleId: MuscleId | null | undefined,
) {
  const material = baseMaterial.clone();
  const isSelected = muscleId === selectedMuscleId;

  material.side = FrontSide;
  material.transparent = false;
  material.opacity = 1;
  if (isSelected) {
    material.color.set(HIGHLIGHT_BASE_COLOR);
  }
  material.emissive.set(isSelected ? HIGHLIGHT_COLOR : "#000000");
  material.emissiveIntensity = isSelected ? HIGHLIGHT_EMISSIVE_INTENSITY : 0;
  material.metalness = isSelected ? 0.08 : 0.05;
  material.roughness = isSelected ? 0.28 : 0.42;

  return material;
}

function MusclePartGeometry({ geometry }: { geometry: "box" | "capsule" }) {
  return geometry === "capsule" ? (
    <capsuleGeometry args={[0.38, 1, 8, 16]} />
  ) : (
    <boxGeometry args={[1, 1, 1]} />
  );
}

function HostedMuscleModel({ onHighlightMuscle, selectedMuscleId, ...props }: MuscleModelProps) {
  const group = useRef<Group>(null);
  const { scene, animations } = useGLTF(MODEL_URL) as GLTF;
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes, materials } = useGraph(clone) as unknown as MuscleGraph;
  const optimizedMaterials = useMemo(() => {
    const jointsMaterial = materials.Alpha_Joints_MAT.clone();
    const bodyMaterial = materials.Alpha_Body_MAT.clone();

    jointsMaterial.side = FrontSide;
    bodyMaterial.side = FrontSide;
    bodyMaterial.transparent = false;
    bodyMaterial.opacity = 1;

    return {
      Alpha_Joints_MAT: jointsMaterial,
      Alpha_Body_MAT: bodyMaterial,
      muscles: Object.fromEntries(
        GLTF_HIGHLIGHTABLE_MUSCLE_IDS.map((muscleId) => [
          muscleId,
          createMuscleMaterial(materials.Alpha_Body_MAT, muscleId, selectedMuscleId),
        ]),
      ) as Record<MuscleId, MeshStandardMaterial>,
    };
  }, [materials, selectedMuscleId]);

  useEffect(() => {
    return () => {
      optimizedMaterials.Alpha_Joints_MAT.dispose();
      optimizedMaterials.Alpha_Body_MAT.dispose();
      Object.values(optimizedMaterials.muscles).forEach((material) => material.dispose());
    };
  }, [optimizedMaterials]);

  useAnimations(animations, group);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group name="Armature" rotation={MODEL_ROTATION} scale={MODEL_SCALE}>
          <primitive object={nodes.mixamorigHips} />
        </group>
        <skinnedMesh
          name="Alpha_Joints"
          geometry={nodes.Alpha_Joints.geometry}
          material={optimizedMaterials.Alpha_Joints_MAT}
          skeleton={nodes.Alpha_Joints.skeleton}
          rotation={MODEL_ROTATION}
          scale={MODEL_SCALE}
        />
        <skinnedMesh
          name="Alpha_Surface"
          geometry={nodes.Alpha_Surface.geometry}
          material={optimizedMaterials.Alpha_Body_MAT}
          skeleton={nodes.Alpha_Surface.skeleton}
          rotation={MODEL_ROTATION}
          scale={MODEL_SCALE}
        />
        {GLTF_HIGHLIGHTABLE_MUSCLE_IDS.map((muscleId) => (
          <skinnedMesh
            key={muscleId}
            name={muscleId}
            geometry={nodes[muscleId].geometry}
            material={optimizedMaterials.muscles[muscleId]}
            skeleton={nodes[muscleId].skeleton}
            rotation={MODEL_ROTATION}
            scale={MODEL_SCALE}
            onPointerOver={(event: ThreeEvent<PointerEvent>) => {
              event.stopPropagation();
              onHighlightMuscle?.(muscleId);
            }}
            onPointerOut={(event: ThreeEvent<PointerEvent>) => {
              event.stopPropagation();
              onHighlightMuscle?.(null);
            }}
          />
        ))}
      </group>
    </group>
  );
}

function ProceduralMuscleModel({
  onHighlightMuscle,
  selectedMuscleId,
  ...props
}: MuscleModelProps) {
  return (
    <group {...props}>
      <mesh position={[0, 3.2, 0]} castShadow receiveShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.62} metalness={0.05} />
      </mesh>

      <mesh position={[0, 2.05, 0]} castShadow receiveShadow>
        <capsuleGeometry args={[0.46, 1.55, 10, 18]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.72} metalness={0.04} />
      </mesh>

      <mesh position={[-0.92, 2.08, 0]} rotation={[0, 0, -0.18]} castShadow receiveShadow>
        <capsuleGeometry args={[0.18, 1.15, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.72} metalness={0.04} />
      </mesh>
      <mesh position={[0.92, 2.08, 0]} rotation={[0, 0, 0.18]} castShadow receiveShadow>
        <capsuleGeometry args={[0.18, 1.15, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.72} metalness={0.04} />
      </mesh>

      <mesh position={[-0.34, 0.48, 0]} rotation={[0, 0, 0.04]} castShadow receiveShadow>
        <capsuleGeometry args={[0.2, 1.65, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.72} metalness={0.04} />
      </mesh>
      <mesh position={[0.34, 0.48, 0]} rotation={[0, 0, -0.04]} castShadow receiveShadow>
        <capsuleGeometry args={[0.2, 1.65, 8, 16]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.72} metalness={0.04} />
      </mesh>

      {MUSCLE_PARTS.map((part) => (
        <mesh
          key={part.id}
          position={part.position}
          rotation={part.rotation}
          scale={part.scale}
          castShadow
          receiveShadow
          onPointerOver={(event: ThreeEvent<PointerEvent>) => {
            event.stopPropagation();
            onHighlightMuscle?.(part.muscleId);
          }}
          onPointerOut={(event: ThreeEvent<PointerEvent>) => {
            event.stopPropagation();
            onHighlightMuscle?.(null);
          }}
        >
          <MusclePartGeometry geometry={part.geometry} />
          <meshStandardMaterial
            color={
              part.muscleId === selectedMuscleId
                ? HIGHLIGHT_BASE_COLOR
                : (MUSCLE_COLOR_BY_ID.get(part.muscleId) ?? "#f8fafc")
            }
            emissive={part.muscleId === selectedMuscleId ? HIGHLIGHT_COLOR : "#000000"}
            emissiveIntensity={
              part.muscleId === selectedMuscleId ? HIGHLIGHT_EMISSIVE_INTENSITY : 0
            }
            transparent={false}
            opacity={1}
            roughness={part.muscleId === selectedMuscleId ? 0.28 : 0.42}
            metalness={part.muscleId === selectedMuscleId ? 0.08 : 0.05}
          />
        </mesh>
      ))}
    </group>
  );
}

export function MuscleModel(props: MuscleModelProps) {
  if (MODEL_URL.endsWith(".json")) {
    return <AtlasMuscleModel {...props} url={MODEL_URL} />;
  }

  return MODEL_URL ? <HostedMuscleModel {...props} /> : <ProceduralMuscleModel {...props} />;
}

export { MuscleModel as Model };

if (MODEL_URL && !MODEL_URL.endsWith(".json")) {
  useGLTF.preload(MODEL_URL);
}
