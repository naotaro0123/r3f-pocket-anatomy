# r3f-pocket-anatomy

ポケット解剖図鑑。筋肉パーツをクリックして筋肉名を表示、解説します。

開発ステータス: 進行中

## モデルアセットについて

このリポジトリには 3D モデル本体を同梱していません。

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
3. `yarn dev` で確認する

## 開発

```bash
yarn
yarn dev
```

## ビルド

```bash
yarn build
```

## フォーマット

```bash
yarn format
yarn format:check
```

- VS Code で保存時整形を有効にする場合は、ユーザー設定ではなく、このリポジトリの `.vscode/settings.json` にワークスペース設定として入れてください。
- `yarn format` はリポジトリ全体を整形するため、保存時は Oxc の VS Code 拡張 (`oxc.oxc-vscode`) を使って、開いているファイルだけを `formatOnSave` する運用を推奨します。
