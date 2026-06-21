export type MuscleId =
  | "Muscle_Chest" // 大胸筋
  | "Muscle_Deltoid" // 三角筋
  | "Muscle_Biceps" // 上腕二頭筋
  | "Muscle_ForearmFlexors" // 前腕屈筋群
  | "Muscle_Abs" // 腹直筋
  | "Muscle_Obliques" // 腹斜筋
  | "Muscle_Quads" // 大腿四頭筋
  | "Muscle_TibialisAnterior"; // 前脛骨筋

type MuscleDefinition = {
  id: MuscleId;
  name: string;
  reading: string;
  description: string;
  color: string;
  labelPosition: Vector3Tuple;
};

type Vector3Tuple = [number, number, number];

type MusclePartDefinition = {
  id: string;
  muscleId: MuscleId;
  geometry: "box" | "capsule";
  position: Vector3Tuple;
  rotation: Vector3Tuple;
  scale: Vector3Tuple;
};

export const MUSCLES: MuscleDefinition[] = [
  {
    id: "Muscle_Chest",
    name: "大胸筋",
    reading: "だいきょうきん",
    description: "胸郭の前面に広がる筋。肩関節の内転・内旋や押す動きの基礎になります。",
    color: "#f97316",
    labelPosition: [0, 3.18, 0.3],
  },
  {
    id: "Muscle_Deltoid",
    name: "三角筋",
    reading: "さんかくきん",
    description: "肩を包み込む大きな筋で、腕を上げる動きや肩関節の安定化に関わります。",
    color: "#a855f7",
    labelPosition: [0.4, 3.72, 0.1],
  },
  {
    id: "Muscle_Biceps",
    name: "上腕二頭筋",
    reading: "じょうわんにとうきん",
    description: "肘関節の屈曲と前腕の回外に関わる、上腕前面の代表的な筋です。",
    color: "#fb7185",
    labelPosition: [0.7, 3.38, 0.05],
  },
  {
    id: "Muscle_Abs",
    name: "腹直筋",
    reading: "ふくちょくきん",
    description: "体幹前面を支える筋。体幹屈曲や姿勢保持に関与します。",
    color: "#22c55e",
    labelPosition: [0, 2.62, 0.3],
  },
  {
    id: "Muscle_Obliques",
    name: "腹斜筋",
    reading: "ふくしゃきん",
    description: "体幹の回旋や側屈を助け、腹部の安定性を高める側腹部の筋群です。",
    color: "#eab308",
    labelPosition: [0.3, 2.88, 0.2],
  },
  {
    id: "Muscle_Quads",
    name: "大腿四頭筋",
    reading: "だいたいしとうきん",
    description: "膝関節の伸展を担う大腿前面の大きな筋群です。",
    color: "#38bdf8",
    labelPosition: [0.34, 2.26, 0.2],
  },
  {
    id: "Muscle_TibialisAnterior",
    name: "前脛骨筋",
    reading: "ぜんけいこつきん",
    description: "足首を持ち上げる背屈に関わり、歩行時につま先をクリアに保つ下腿前面の筋です。",
    color: "#f43f5e",
    labelPosition: [0.44, 0.98, -0.18],
  },
];

export const MUSCLE_PARTS: MusclePartDefinition[] = [
  {
    id: "Muscle_Chest-left",
    muscleId: "Muscle_Chest",
    geometry: "capsule",
    position: [-0.42, 2.75, 0.48],
    rotation: [0.25, 0.08, -0.5],
    scale: [0.82, 0.78, 0.58],
  },
  {
    id: "Muscle_Chest-right",
    muscleId: "Muscle_Chest",
    geometry: "capsule",
    position: [0.42, 2.75, 0.48],
    rotation: [0.25, -0.08, 0.5],
    scale: [0.82, 0.78, 0.58],
  },
  {
    id: "Muscle_Deltoid-left",
    muscleId: "Muscle_Deltoid",
    geometry: "capsule",
    position: [-0.83, 2.84, 0.32],
    rotation: [0.22, 0.04, -0.52],
    scale: [0.56, 0.52, 0.5],
  },
  {
    id: "Muscle_Deltoid-right",
    muscleId: "Muscle_Deltoid",
    geometry: "capsule",
    position: [0.83, 2.84, 0.32],
    rotation: [0.22, -0.04, 0.52],
    scale: [0.56, 0.52, 0.5],
  },
  {
    id: "Muscle_Biceps-left",
    muscleId: "Muscle_Biceps",
    geometry: "capsule",
    position: [-1.18, 2.16, 0.24],
    rotation: [0.1, 0, -0.12],
    scale: [0.48, 0.78, 0.48],
  },
  {
    id: "Muscle_Biceps-right",
    muscleId: "Muscle_Biceps",
    geometry: "capsule",
    position: [1.18, 2.16, 0.24],
    rotation: [0.1, 0, 0.12],
    scale: [0.48, 0.78, 0.48],
  },
  {
    id: "Muscle_ForearmFlexors-left",
    muscleId: "Muscle_ForearmFlexors",
    geometry: "capsule",
    position: [-1.24, 1.32, 0.26],
    rotation: [0.2, 0.04, -0.16],
    scale: [0.34, 0.88, 0.34],
  },
  {
    id: "Muscle_ForearmFlexors-right",
    muscleId: "Muscle_ForearmFlexors",
    geometry: "capsule",
    position: [1.24, 1.32, 0.26],
    rotation: [0.2, -0.04, 0.16],
    scale: [0.34, 0.88, 0.34],
  },
  {
    id: "Muscle_Abs",
    muscleId: "Muscle_Abs",
    geometry: "box",
    position: [0, 1.58, 0.44],
    rotation: [0, 0, 0],
    scale: [0.88, 1.26, 0.36],
  },
  {
    id: "Muscle_Obliques-left",
    muscleId: "Muscle_Obliques",
    geometry: "capsule",
    position: [-0.58, 1.56, 0.34],
    rotation: [0.08, 0.12, -0.34],
    scale: [0.34, 0.9, 0.28],
  },
  {
    id: "Muscle_Obliques-right",
    muscleId: "Muscle_Obliques",
    geometry: "capsule",
    position: [0.58, 1.56, 0.34],
    rotation: [0.08, -0.12, 0.34],
    scale: [0.34, 0.9, 0.28],
  },
  {
    id: "Muscle_Quads-left",
    muscleId: "Muscle_Quads",
    geometry: "capsule",
    position: [-0.46, 0.15, 0.2],
    rotation: [0.08, 0, 0.02],
    scale: [0.62, 1.2, 0.62],
  },
  {
    id: "Muscle_Quads-right",
    muscleId: "Muscle_Quads",
    geometry: "capsule",
    position: [0.46, 0.15, 0.2],
    rotation: [0.08, 0, -0.02],
    scale: [0.62, 1.2, 0.62],
  },
  {
    id: "Muscle_TibialisAnterior-left",
    muscleId: "Muscle_TibialisAnterior",
    geometry: "capsule",
    position: [-0.28, -0.98, 0.22],
    rotation: [0.08, 0.02, 0.02],
    scale: [0.26, 0.9, 0.24],
  },
  {
    id: "Muscle_TibialisAnterior-right",
    muscleId: "Muscle_TibialisAnterior",
    geometry: "capsule",
    position: [0.28, -0.98, 0.22],
    rotation: [0.08, -0.02, -0.02],
    scale: [0.26, 0.9, 0.24],
  },
];
