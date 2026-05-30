export type MuscleId =
  | 'pectoralis-major'
  | 'biceps-brachii'
  | 'rectus-abdominis'
  | 'quadriceps'

type MuscleDefinition = {
  id: MuscleId
  name: string
  shortLabel: string
  latinName: string
  description: string
  color: string
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
    id: 'pectoralis-major',
    name: '大胸筋',
    shortLabel: 'Chest',
    latinName: 'Pectoralis major',
    description: '胸郭の前面に広がる筋。肩関節の内転・内旋や押す動きの基礎になります。',
    color: '#f97316',
  },
  {
    id: 'biceps-brachii',
    name: '上腕二頭筋',
    shortLabel: 'Arm',
    latinName: 'Biceps brachii',
    description: '肘関節の屈曲と前腕の回外に関わる、上腕前面の代表的な筋です。',
    color: '#fb7185',
  },
  {
    id: 'rectus-abdominis',
    name: '腹直筋',
    shortLabel: 'Core',
    latinName: 'Rectus abdominis',
    description: '体幹前面を支える筋。体幹屈曲や姿勢保持に関与します。',
    color: '#22c55e',
  },
  {
    id: 'quadriceps',
    name: '大腿四頭筋',
    shortLabel: 'Leg',
    latinName: 'Quadriceps femoris',
    description: '膝関節の伸展を担う大腿前面の大きな筋群です。',
    color: '#38bdf8',
  },
]

export const MUSCLE_PARTS: MusclePartDefinition[] = [
  {
    id: 'pectoralis-left',
    muscleId: 'pectoralis-major',
    geometry: 'capsule',
    position: [-0.42, 2.75, 0.48],
    rotation: [0.25, 0.08, -0.5],
    scale: [0.82, 0.78, 0.58],
  },
  {
    id: 'pectoralis-right',
    muscleId: 'pectoralis-major',
    geometry: 'capsule',
    position: [0.42, 2.75, 0.48],
    rotation: [0.25, -0.08, 0.5],
    scale: [0.82, 0.78, 0.58],
  },
  {
    id: 'biceps-left',
    muscleId: 'biceps-brachii',
    geometry: 'capsule',
    position: [-1.18, 2.16, 0.24],
    rotation: [0.1, 0, -0.12],
    scale: [0.48, 0.78, 0.48],
  },
  {
    id: 'biceps-right',
    muscleId: 'biceps-brachii',
    geometry: 'capsule',
    position: [1.18, 2.16, 0.24],
    rotation: [0.1, 0, 0.12],
    scale: [0.48, 0.78, 0.48],
  },
  {
    id: 'rectus-abdominis',
    muscleId: 'rectus-abdominis',
    geometry: 'box',
    position: [0, 1.58, 0.44],
    rotation: [0, 0, 0],
    scale: [0.88, 1.26, 0.36],
  },
  {
    id: 'quadriceps-left',
    muscleId: 'quadriceps',
    geometry: 'capsule',
    position: [-0.46, 0.15, 0.2],
    rotation: [0.08, 0, 0.02],
    scale: [0.62, 1.2, 0.62],
  },
  {
    id: 'quadriceps-right',
    muscleId: 'quadriceps',
    geometry: 'capsule',
    position: [0.46, 0.15, 0.2],
    rotation: [0.08, 0, -0.02],
    scale: [0.62, 1.2, 0.62],
  },
]
