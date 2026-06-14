# Copilot Instructions

このリポジトリで GitHub Copilot が作業する際は、以下を前提にしてください。

## プロジェクト概要

React + Vite + TypeScript + React Three Fiber / drei で構築された、ポケット解剖図鑑です。Canvas 上の 3D モデルを回転・ズームしながら、筋肉ラベルの選択と詳細表示を行います。

## 開発コマンド

```bash
# 依存関係のインストール
yarn

# 開発サーバー
yarn dev

# Format
yarn format

# Format check
yarn format:check

# Lint
yarn lint

# ビルド
yarn build

# プレビュー
yarn preview
```

- README には `npm install` / `npm run dev` / `npm run build` も記載されていますが、リポジトリには `yarn.lock` があるため、通常は Yarn ベースで扱ってください。
- 自動テスト用の script は `package.json` に未定義です。単体テスト実行コマンドも現状はありません。
- コード整形は `oxfmt` を使います。変更前後の整形確認は `yarn format` または `yarn format:check` を使ってください。
- VS Code の保存時整形設定を案内・追加する場合は、`User/settings.json` ではなく、このリポジトリの `.vscode/settings.json` にワークスペース設定として入れる前提で扱ってください。
- 変更確認は `yarn format:check`・`yarn lint`・`yarn build` を優先してください。

## 高レベルアーキテクチャ

- **`src/App.tsx`** が画面全体の composition root です。`selectedMuscleId` と `highlightedMuscleId` を持ち、Canvas と右側情報パネルの両方へ渡します。
- **`src/data/muscles.ts`** が筋肉データの正本です。`MUSCLES` は一覧表示・詳細文・色・ラベル位置を兼ね、`MUSCLE_PARTS` は procedural fallback モデルの各メッシュ形状を定義します。
- **`src/components/AnatomyCanvas.tsx`** は 3D シーン全体を担当します。カメラ視点プリセット、`OrbitControls` 制約、ライト、ラベルマーカー、選択中の callout をまとめて管理します。
- **`src/components/MuscleModel.tsx`** は表示モデルの切り替え境界です。`VITE_MUSCLE_MODEL_URL` があれば glTF を読み込み、なければ `MUSCLE_PARTS` を使う procedural モデルにフォールバックします。
- glTF モードでは選択状態を emissive で見せ、procedural モードでは `MUSCLE_PARTS` の各メッシュに `MUSCLES` の色を適用して同じ選択 state を共有します。データ層・Canvas 層・モデル層が `MuscleId` で結び付いています。

## 実装上の重要な前提

- 初期状態は `selectedMuscleId = null` です。未選択状態を前提に UI を壊さないようにしてください。
- hover と click は別 state です。Canvas 側では `highlightedMuscleId ?? selectedMuscleId` をモデル強調に使っているため、hover 表現を変えるときは選択状態との優先順位も確認してください。
- 右側の筋肉一覧、Canvas 上の番号ラベル、選択中の詳細文はすべて `MUSCLES` の配列順と `id` に依存しています。筋肉を追加・削除する場合は、一覧だけでなくラベル位置・fallback 形状・モデル側の highlight 対応までそろえて更新してください。
- 外部モデルの向きと倍率は `VITE_MUSCLE_MODEL_ROTATION_X/Y/Z` と `VITE_MUSCLE_MODEL_SCALE` で吸収する設計です。モデルの見え方調整は、まず env 変数かカメラ設定で吸収し、他の UI 座標系に影響する場当たり的な transform 変更は避けてください。
- 現在の glTF 実装で個別 highlight 対応しているのは `Muscle_Chest` / `Muscle_Biceps` / `Muscle_Abs` / `Muscle_Quads` です。`MUSCLES` 側へ筋肉を増やしても、glTF ノードが無ければ procedural fallback ほど細かくは光りません。

## コードベース固有の慣習

- UI 文言は日本語ベースです。新しい表示文言も既存トーンに合わせてください。
- JS / TS の整形は `oxfmt` 前提です。フォーマット方針を変える変更では、まず `package.json` の scripts と関連ドキュメントの整合を確認してください。
- 保存時整形を扱うときは、リポジトリ全体に `yarn format` を掛けるより、Oxc の VS Code 拡張 (`oxc.oxc-vscode`) などの formatter 拡張で開いているファイルだけを `formatOnSave` する方向を優先してください。
- スタイルは `src/App.css` に集約されています。小さな UI 追加でも別 CSS ファイルへ分散させず、既存クラス命名と見た目に寄せてください。
- Canvas 上のオーバーレイ UI は増やしすぎない前提です。常時表示の UI は通常 DOM オーバーレイを優先し、`<Html>` は現在の筋肉 callout のような限定用途に寄せてください。
- 3D 表示の調整は、モデル座標を直接動かす前に `CAMERA_PRESETS`、`CAMERA_TARGET`、`OrbitControls` の制約を見直してください。
- このリポジトリのコードはセミコロンありで統一されています。

## 3D モデルアセット

- リポジトリには 3D モデル本体を同梱していません。
- デフォルトでは簡易 procedural モデルを表示します。
- 再配布可能な独自モデルを使う場合は、`public/models/` に配置して `.env.local` から `VITE_MUSCLE_MODEL_URL` を指定してください。

```bash
VITE_MUSCLE_MODEL_URL=/models/your-model.glb
VITE_MUSCLE_MODEL_ROTATION_X=90
VITE_MUSCLE_MODEL_ROTATION_Y=0
VITE_MUSCLE_MODEL_ROTATION_Z=0
VITE_MUSCLE_MODEL_SCALE=0.01
```

## Commit メッセージ

- Copilot が commit メッセージを提案する場合は `.github/skills/commit-message/SKILL.md` のルールに従ってください。
- 基本は Conventional Commits を使い、本文は英語で簡潔に書きます。
- `docs(copilot): ...` は Copilot instruction 更新時の既存ルールとして使えます。
