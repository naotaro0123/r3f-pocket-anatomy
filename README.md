# r3f-pocket-anatomy

ポケット解剖図鑑。筋肉パーツをクリックして筋肉名を表示、解説します。

開発ステータス: 進行中

## モデルアセットについて

`public/models/` に BodyParts3D 4.0 を加工した Web 用モデルを同梱しています。初期状態では、このモデルに含まれる筋肉と頭蓋骨・顔面骨・歯を表示します。

- 450個のメッシュを6個のバイナリチャンクにまとめています
- 非圧縮チャンクは圧縮ストリーム非対応環境向けのフォールバックです
- データの出典、ライセンス、加工内容は [`public/models/ATTRIBUTION.md`](public/models/ATTRIBUTION.md) を参照してください
- モデル変換・配信形式は [ashemag/human-atlas](https://github.com/ashemag/human-atlas) を参考にしています

### モデルを差し替える

別の glTF モデルを使う場合は `.env.local` を作成し、必要に応じて以下を設定します。

```bash
VITE_MUSCLE_MODEL_URL=/models/your-model.glb
VITE_MUSCLE_MODEL_ROTATION_X=90
VITE_MUSCLE_MODEL_ROTATION_Y=0
VITE_MUSCLE_MODEL_ROTATION_Z=0
VITE_MUSCLE_MODEL_SCALE=0.01
```

1. 再配布可能なモデルを `public/models/your-model.glb` に置く
2. `.env.local` に読み込み先と変換値を設定する
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
