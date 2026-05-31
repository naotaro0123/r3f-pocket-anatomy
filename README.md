# r3f-pocket-anatomy

ポケット解剖図鑑。筋肉パーツをクリックして筋肉名を表示、解説します。

開発ステータス: 進行中

## モデルアセットについて

このリポジトリには 3D モデル本体を同梱していません。`public/models/` 配下の `.glb` / `.gltf` / `.fbx` は `.gitignore` 済みです。

- デフォルトでは、リポジトリ内の簡易プロシージャル人体モデルを表示します
- 再配布可能な独自モデルを使う場合は、ローカルに配置して環境変数で読み込み先を指定します

### 独自モデルを使う

`.env.local` を作成して、必要に応じて以下を設定します。

```bash
VITE_MUSCLE_MODEL_URL=/models/your-model.glb
VITE_MUSCLE_MODEL_ROTATION_X=90
VITE_MUSCLE_MODEL_ROTATION_Y=0
VITE_MUSCLE_MODEL_ROTATION_Z=0
VITE_MUSCLE_MODEL_SCALE=0.01
```

例:

1. 再配布可能なモデルを `public/models/your-model.glb` に置く
2. `.env.local` に `VITE_MUSCLE_MODEL_URL=/models/your-model.glb` を設定する
3. `npm run dev` で確認する

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
```
