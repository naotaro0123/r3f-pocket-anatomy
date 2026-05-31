import { useAnimations, useGLTF } from '@react-three/drei'
import { useGraph, type ThreeElements } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { FrontSide, type Bone, type Group, type MeshStandardMaterial, type SkinnedMesh } from 'three'
import { SkeletonUtils, type GLTF } from 'three-stdlib'
import { MUSCLES, MUSCLE_PARTS } from '../data/muscles'

type MuscleModelProps = ThreeElements['group']
type RotationTuple = [number, number, number]
type GLTFResult = GLTF & {
  nodes: {
    mixamorigHips: Bone
    Alpha_Joints: SkinnedMesh
    Alpha_Surface: SkinnedMesh
  }
  materials: {
    Alpha_Joints_MAT: MeshStandardMaterial
    Alpha_Body_MAT: MeshStandardMaterial
  }
}
type MuscleGraph = Pick<GLTFResult, 'nodes' | 'materials'>

const MODEL_URL = import.meta.env.VITE_MUSCLE_MODEL_URL?.trim() || ''
const MODEL_ROTATION: RotationTuple = [
  toRadians(import.meta.env.VITE_MUSCLE_MODEL_ROTATION_X, 90),
  toRadians(import.meta.env.VITE_MUSCLE_MODEL_ROTATION_Y, 0),
  toRadians(import.meta.env.VITE_MUSCLE_MODEL_ROTATION_Z, 0),
]
const MODEL_SCALE = toNumber(import.meta.env.VITE_MUSCLE_MODEL_SCALE, 0.01)
const MUSCLE_COLOR_BY_ID = new Map(MUSCLES.map((muscle) => [muscle.id, muscle.color]))

function toNumber(value: string | undefined, fallback: number) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function toRadians(value: string | undefined, fallbackDegrees: number) {
  return (toNumber(value, fallbackDegrees) * Math.PI) / 180
}

function HostedMuscleModel(props: MuscleModelProps) {
  const group = useRef<Group>(null)
  const { scene, animations } = useGLTF(MODEL_URL) as GLTF
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene])
  const { nodes, materials } = useGraph(clone) as unknown as MuscleGraph
  const optimizedMaterials = useMemo(() => {
    const jointsMaterial = materials.Alpha_Joints_MAT.clone()
    const bodyMaterial = materials.Alpha_Body_MAT.clone()

    jointsMaterial.side = FrontSide
    bodyMaterial.side = FrontSide

    return {
      Alpha_Joints_MAT: jointsMaterial,
      Alpha_Body_MAT: bodyMaterial,
    }
  }, [materials])

  useAnimations(animations, group)

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
      </group>
    </group>
  )
}

function ProceduralMuscleModel(props: MuscleModelProps) {
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
        >
          {part.geometry === 'capsule' ? (
            <capsuleGeometry args={[0.38, 1, 8, 16]} />
          ) : (
            <boxGeometry args={[1, 1, 1]} />
          )}
          <meshStandardMaterial
            color={MUSCLE_COLOR_BY_ID.get(part.muscleId) ?? '#f8fafc'}
            roughness={0.42}
            metalness={0.05}
          />
        </mesh>
      ))}
    </group>
  )
}

export function MuscleModel(props: MuscleModelProps) {
  return MODEL_URL ? <HostedMuscleModel {...props} /> : <ProceduralMuscleModel {...props} />
}

export { MuscleModel as Model }

if (MODEL_URL) {
  useGLTF.preload(MODEL_URL)
}
