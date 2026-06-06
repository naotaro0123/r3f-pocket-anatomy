export type MuscleId =
  | 'Muscle_Chest'  // 大胸筋
  | 'Muscle_Biceps' // 上腕二頭筋
  | 'Muscle_Abs'    // 腹直筋
  | 'Muscle_Quads'  // 大腿四頭筋

type MuscleDefinition = {
  id: MuscleId
  name: string
  shortLabel: string
  latinName: string
  description: string
  color: string
  labelPosition: Vector3Tuple
}

type Vector3Tuple = [number, number, number]

type MusclePartDefinition = {
  id: string
  muscleId: MuscleId
  geometry: 'box' | 'capsule'
  position: Vector3Tuple
  rotation: Vector3Tuple
  scale: Vector3Tuple
}

export const MUSCLES: MuscleDefinition[] = [
  {
    id: 'Muscle_Chest',
    name: '大胸筋',
    shortLabel: 'Chest',
    latinName: 'Muscle_Chest',
    description: '胸郭の前面に広がる筋。肩関節の内転・内旋や押す動きの基礎になります。',
    color: '#f97316',
    labelPosition: [0, 3.3, 0.3],
  },
  {
    id: 'Muscle_Biceps',
    name: '上腕二頭筋',
    shortLabel: 'Biceps',
    latinName: 'Muscle_Biceps',
    description: '肘関節の屈曲と前腕の回外に関わる、上腕前面の代表的な筋です。',
    color: '#fb7185',
    labelPosition: [0.6, 3.5, 0.05],
  },
  {
    id: 'Muscle_Abs',
    name: '腹直筋',
    shortLabel: 'Abs',
    latinName: 'Muscle_Abs',
    description: '体幹前面を支える筋。体幹屈曲や姿勢保持に関与します。',
    color: '#22c55e',
    labelPosition: [0, 2.85, 0.3],
  },
  {
    id: 'Muscle_Quads',
    name: '大腿四頭筋',
    shortLabel: 'Quads',
    latinName: 'Muscle_Quads',
    description: '膝関節の伸展を担う大腿前面の大きな筋群です。',
    color: '#38bdf8',
    labelPosition: [0.2, 2.15, 0.2],
  },
]

export const MUSCLE_PARTS: MusclePartDefinition[] = [
  {
    id: 'Muscle_Chest-left',
    muscleId: 'Muscle_Chest',
    geometry: 'capsule',
    position: [-0.42, 2.75, 0.48],
    rotation: [0.25, 0.08, -0.5],
    scale: [0.82, 0.78, 0.58],
  },
  {
    id: 'Muscle_Chest-right',
    muscleId: 'Muscle_Chest',
    geometry: 'capsule',
    position: [0.42, 2.75, 0.48],
    rotation: [0.25, -0.08, 0.5],
    scale: [0.82, 0.78, 0.58],
  },
  {
    id: 'Muscle_Biceps-left',
    muscleId: 'Muscle_Biceps',
    geometry: 'capsule',
    position: [-1.18, 2.16, 0.24],
    rotation: [0.1, 0, -0.12],
    scale: [0.48, 0.78, 0.48],
  },
  {
    id: 'Muscle_Biceps-right',
    muscleId: 'Muscle_Biceps',
    geometry: 'capsule',
    position: [1.18, 2.16, 0.24],
    rotation: [0.1, 0, 0.12],
    scale: [0.48, 0.78, 0.48],
  },
  {
    id: 'Muscle_Abs',
    muscleId: 'Muscle_Abs',
    geometry: 'box',
    position: [0, 1.58, 0.44],
    rotation: [0, 0, 0],
    scale: [0.88, 1.26, 0.36],
  },
  {
    id: 'Muscle_Quads-left',
    muscleId: 'Muscle_Quads',
    geometry: 'capsule',
    position: [-0.46, 0.15, 0.2],
    rotation: [0.08, 0, 0.02],
    scale: [0.62, 1.2, 0.62],
  },
  {
    id: 'Muscle_Quads-right',
    muscleId: 'Muscle_Quads',
    geometry: 'capsule',
    position: [0.46, 0.15, 0.2],
    rotation: [0.08, 0, -0.02],
    scale: [0.62, 1.2, 0.62],
  },
]
