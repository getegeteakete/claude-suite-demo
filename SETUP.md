# CLAUDE SUITE セットアップガイド

## 🚀 クイックスタート

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`を`.env.local`にコピーして、必要な値を設定してください。

```bash
cp .env.example .env.local
```

### 3. Vercel Postgresのセットアップ

#### Vercelダッシュボードで設定

1. [Vercel Dashboard](https://vercel.com/dashboard) にアクセス
2. プロジェクトを選択
3. Storage タブ → Create Database → Postgres を選択
4. データベース名を入力して作成
5. `.env` タブから環境変数をコピー

#### ローカルで環境変数を設定

Vercelから取得した環境変数を `.env.local` に貼り付けます。

### 4. データベースの初期化

```bash
# SQLファイルを実行してテーブルを作成
# Vercel Postgres Dashboardの Query タブで以下のSQLを実行
cat lib/db/schema.sql
```

または、Vercelの管理画面から直接SQLを実行：

1. Storage → あなたのデータベース → Query タブ
2. `lib/db/schema.sql` の内容を貼り付けて実行

### 5. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

## 📝 デモアカウント

初期データベースには以下のデモアカウントが作成されます：

- **Email**: demo@uma-s.com
- **Password**: demo1234

## 🗂️ プロジェクト構造

```
CLAUDEAISITE/
├── app/                    # Next.js App Router
│   ├── api/               # APIルート
│   │   └── auth/         # 認証API
│   ├── app/              # メインアプリケーション
│   │   ├── dashboard/   # ダッシュボード
│   │   ├── customers/   # 顧客管理
│   │   ├── deals/       # 商談管理
│   │   ├── invoices/    # 請求書管理
│   │   └── workflow/    # ワークフロー
│   ├── login/           # ログインページ
│   └── page.tsx         # トップページ
│
├── components/           # 共通コンポーネント
│   ├── Sidebar.tsx
│   └── Header.tsx
│
├── lib/                 # ユーティリティ
│   ├── db.ts           # データベース関数
│   └── db/
│       └── schema.sql  # DBスキーマ
│
├── demo_*.html         # デモ画面（既存）
└── workflow_*.html     # ワークフローデモ（既存）
```

## 🛠️ 利用可能なスクリプト

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# デモHTML表示（http-server）
npm run demo
```

## 🌐 デプロイ（Vercel）

### 自動デプロイ

GitHubにプッシュすると自動的にデプロイされます。

```bash
git add .
git commit -m "Initial setup"
git push origin main
```

### 環境変数の設定（Vercel）

1. Vercel Dashboard → プロジェクト → Settings → Environment Variables
2. 以下の環境変数を追加：
   - `NEXTAUTH_URL`: https://your-domain.vercel.app
   - `NEXTAUTH_SECRET`: ランダムな文字列（openssl rand -base64 32 で生成）
   - Postgres関連の変数（自動で設定されます）

## 🔐 セキュリティ

### パスワードのハッシュ化

新しいユーザーを作成する場合は、bcryptでパスワードをハッシュ化してください。

```javascript
const bcrypt = require('bcryptjs')
const hashedPassword = await bcrypt.hash('your-password', 10)
```

### NEXTAUTH_SECRET の生成

```bash
openssl rand -base64 32
```

## 📚 技術スタック

- **フロントエンド**: React, Next.js 14, TailwindCSS
- **認証**: NextAuth.js
- **データベース**: Vercel Postgres (PostgreSQL)
- **デプロイ**: Vercel
- **アイコン**: Lucide React

## 🐛 トラブルシューティング

### データベース接続エラー

環境変数が正しく設定されているか確認してください。

```bash
# .env.local の内容を確認
cat .env.local
```

### ログインできない

1. データベースにユーザーが作成されているか確認
2. パスワードが正しくハッシュ化されているか確認
3. `schema.sql` が正しく実行されたか確認

### ビルドエラー

```bash
# node_modulesを削除して再インストール
rm -rf node_modules
npm install
```

## 📞 サポート

問題が発生した場合は、Issuesを作成してください。

---

**開発元**: 合同会社UMA  
**製品名**: CLAUDE SUITE - クラウド型顧客管理AIシステム

