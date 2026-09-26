export const MUSCLE_IDS = [
  "Muscle_Chest", // 大胸筋
  "Muscle_Deltoid", // 三角筋
  "Muscle_Biceps", // 上腕二頭筋
  "Muscle_ForearmFlexors", // 前腕屈筋群
  "Muscle_Abs", // 腹直筋
  "Muscle_Obliques", // 腹斜筋
  "Muscle_Quads", // 大腿四頭筋
  "Muscle_TibialisAnterior", // 前脛骨筋
  "Muscle_Trapezius", // 僧帽筋
  "Muscle_LatissimusDorsi", // 広背筋
  "Muscle_TricepsBrachii", // 上腕三頭筋
  "Muscle_GluteusMaximus", // 大殿筋
  "Muscle_Platysma", // 広頸筋
] as const;

export type MuscleId = (typeof MUSCLE_IDS)[number];

export const GLTF_HIGHLIGHTABLE_MUSCLE_IDS = MUSCLE_IDS.filter(
  (muscleId) => muscleId !== "Muscle_Platysma",
);

type MuscleDefinition = {
  id: MuscleId;
  name: string;
  reading: string;
  description: string;
  color: string;
  labelPosition: Vector3Tuple;
};

type Vector3Tuple = [number, number, number];

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
    labelPosition: [0.4, 3.62, -0.3],
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
    id: "Muscle_ForearmFlexors",
    name: "前腕屈筋群",
    reading: "ぜんわんくっきんぐん",
    description: "前腕の手のひら側にある筋群で、手首や指を曲げる動きに関わります。",
    color: "#06b6d4",
    labelPosition: [0.62, 2.68, 0.0],
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
  {
    id: "Muscle_Trapezius",
    name: "僧帽筋",
    reading: "そうぼうきん",
    description: "首から肩、背中上部へ広がる筋で、肩甲骨の挙上・内転や姿勢保持に関わります。",
    color: "#14b8a6",
    labelPosition: [0, 3.6, -0.5],
  },
  {
    id: "Muscle_LatissimusDorsi",
    name: "広背筋",
    reading: "こうはいきん",
    description: "背中の広い面積を占める筋で、腕を引く動きや肩関節の伸展・内転を助けます。",
    color: "#8b5cf6",
    labelPosition: [0, 3.0, -0.55],
  },
  {
    id: "Muscle_TricepsBrachii",
    name: "上腕三頭筋",
    reading: "じょうわんさんとうきん",
    description: "上腕後面の大きな筋で、肘を伸ばす動きの主力となります。",
    color: "#f59e0b",
    labelPosition: [-0.32, 3.2, -0.48],
  },
  {
    id: "Muscle_GluteusMaximus",
    name: "大殿筋",
    reading: "だいでんきん",
    description: "股関節の伸展や外旋に関わる大きな臀部の筋で、立ち上がりや走行時に重要です。",
    color: "#ec4899",
    labelPosition: [0, 2.54, -0.62],
  },
  {
    id: "Muscle_Platysma",
    name: "広頸筋",
    reading: "こうけいきん",
    description:
      "首の前面から下顎に広がる薄い筋で、首の皮膚を緊張させ、下顎を下げる動きを助けます。",
    color: "#0ea5e9",
    labelPosition: [-0.2, 3.65, -0.14],
  },
];
