# CLAUDE SUITE デプロイ手順

## 📦 Git & Vercelデプロイ手順

### 1. Gitリポジトリの初期化とプッシュ

#### ステップ1: Gitの初期化
```bash
git init
git add .
git commit -m "Initial commit: CLAUDE SUITE demo site"
```

#### ステップ2: GitHubリポジトリの作成
1. [GitHub](https://github.com)にアクセス
2. 右上の「+」→「New repository」をクリック
3. リポジトリ名を入力（例: `claude-suite-demo`）
4. 「Public」または「Private」を選択
5. 「Create repository」をクリック

#### ステップ3: リモートリポジトリの設定とプッシュ
```bash
# GitHubのリポジトリURLを設定（YOUR_USERNAMEを自分のユーザー名に変更）
git remote add origin https://github.com/YOUR_USERNAME/claude-suite-demo.git

# mainブランチに変更（必要な場合）
git branch -M main

# プッシュ
git push -u origin main
```

---

### 2. Vercelへのデプロイ

#### 方法A: Vercel CLI を使用（推奨）

```bash
# Vercel CLIのインストール（初回のみ）
npm install -g vercel

# Vercelにログイン
vercel login

# デプロイ
vercel

# 本番環境へデプロイ
vercel --prod
```

#### 方法B: Vercel Web UI を使用

1. [Vercel](https://vercel.com)にアクセス
2. 「Sign Up」または「Log In」（GitHubアカウントで連携推奨）
3. 「Add New Project」をクリック
4. GitHubリポジトリを選択（`claude-suite-demo`）
5. プロジェクト設定:
   - **Framework Preset**: Other
   - **Root Directory**: `./`（デフォルト）
   - **Build Command**: 空欄
   - **Output Directory**: `./`（デフォルト）
6. 「Deploy」をクリック

---

### 3. デプロイ後の確認

デプロイが完了すると、以下のようなURLが発行されます：
```
https://claude-suite-demo.vercel.app
```

または
```
https://claude-suite-demo-[your-username].vercel.app
```

---

## 🔄 更新手順

コードを更新してVercelに反映する手順：

```bash
# ファイルを変更後
git add .
git commit -m "Update: [変更内容を記述]"
git push

# Vercelが自動的に再デプロイします
```

---

## ⚙️ カスタムドメインの設定（オプション）

Vercelダッシュボードから独自ドメインを設定できます：

1. Vercelプロジェクトページを開く
2. 「Settings」→「Domains」
3. カスタムドメインを追加
4. DNSレコードを設定

---

## 📱 主要ページURL

デプロイ後、以下のURLでアクセスできます：

- トップページ: `https://your-domain.vercel.app/`
- ログイン: `https://your-domain.vercel.app/login.html`
- ダッシュボード: `https://your-domain.vercel.app/demo_dashboard.html`
- 請求書管理: `https://your-domain.vercel.app/demo_invoices.html`
- 適格請求書: `https://your-domain.vercel.app/invoice_detail.html`
- 会計ソフト連携: `https://your-domain.vercel.app/demo_export.html`

---

## 🚨 トラブルシューティング

### 問題: 404エラーが表示される
**解決策**: `vercel.json`が正しく配置されているか確認

### 問題: CSSが読み込まれない
**解決策**: HTMLファイル内のパスが相対パスになっているか確認

### 問題: Gitのプッシュが失敗する
**解決策**: 
```bash
git config --global user.email "t@uma-s.com"
git config --global user.name "SONODA MAYU"
```

---

## 📞 サポート

問題が解決しない場合：
- Vercel公式ドキュメント: https://vercel.com/docs
- GitHub公式ドキュメント: https://docs.github.com

---

**合同会社UMA**  
CLAUDE SUITE - クラウド型顧客管理AIシステム

