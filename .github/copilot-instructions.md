# Copilot Instructions

このリポジトリで GitHub Copilot が作業する際は、以下を前提にしてください。

## プロジェクト概要

React + Vite + TypeScript + React Three Fiber / drei で構築された、ポケット解剖図鑑です。
Canvas 上の 3D モデルを回転・ズームしながら、筋肉ラベルの選択と詳細表示を行います。

## コマンド

```bash
# 依存関係のインストール
yarn

# 開発サーバー
yarn dev

# ビルド
yarn build

# Lint
yarn lint
```

検証時は `yarn lint` と `yarn build` を優先して実行してください。

## アーキテクチャ

- **`src/App.tsx`** — 画面全体のレイアウト、選択中の筋肉 state、情報パネル
- **`src/components/AnatomyCanvas.tsx`** — Canvas 本体、カメラ視点プリセット、FPS デバッグ UI、筋肉マーカー
- **`src/components/MuscleModel.tsx`** — glTF ベースの筋肉モデル表示。必要に応じて軽量 procedural モデルにフォールバック
- **`src/data/muscles.ts`** — 筋肉マスターデータ。表示名、ラベル位置、説明文を保持
- **`public/models/`** — 表示用 3D モデル

## 実装上の前提

- UI は React 関数コンポーネントで構成し、state はローカルに閉じる
- Canvas 上のオーバーレイ UI は、`<Html>` を増やしすぎず、必要なら通常の DOM オーバーレイを優先する
- カメラ視点のデバッグ UI は `AnatomyCanvas.tsx` で管理し、`CAMERA_PRESETS` と `CAMERA_TARGET` を基準に調整する
- 3D パフォーマンスを崩さないため、描画負荷の高い変更では DPR、shadow map、`Html` の使い方を見直す
- 初期表示では筋肉は未選択 (`selectedMuscleId = null`)

## 変更時の方針

- 既存の UI 文言は日本語ベースに揃える
- スタイルは `src/App.css` に集約し、既存のトーンに合わせる
- 3D 表示の調整は、モデル位置より先にカメラ位置・target・OrbitControls 制約を見直す
- 新しいデバッグ UI を追加する場合は、Canvas 内の既存オーバーレイ（FPS、視点ボタン）との干渉を避ける

## Commit メッセージ

- Copilot が commit メッセージを提案する場合は `.github/skills/commit-message/SKILL.md` のルールに従う
- 基本は Conventional Commits を使い、メッセージ本文は英語で簡潔に書く
