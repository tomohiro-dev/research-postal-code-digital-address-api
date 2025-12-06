# research-postal-code-digital-address-api

## 概要
日本郵政が提供する「デジタルアドレスAPI」を検証・研究するためのプロジェクトです。
7桁の英数字（デジタルアドレス）から住所情報を検索・表示するシンプルなWebアプリケーションを構築します。

### 目的
- デジタルアドレスAPIの仕様理解と挙動確認
- Next.js (App Router) + TypeScript によるBFF (Backend for Frontend) パターンの実装検証
- 初めて使うNext.jsとVercelへのデプロイフロー確認

### 技術スタック
- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS

## 開発コマンド
- `npm run dev`: 開発サーバーを起動（http://localhost:3000）
- `npm run build`: 本番用にアプリケーションをビルド
- `npm start`: ビルドされたアプリケーションを起動
- `npm run lint`: コードの静的解析（Lint）を実行

## 補足
- あくまでも調査なので簡易的なPRで進めます。
- 詳細は `REQUIREMENTS.md` を参照してください。

## PRのprefix
PRのタイトルには以下のプレフィックスをつけてください。
- feat: 新機能
- fix: バグ修正
- docs: ドキュメントのみの変更
- style: コードの動作に影響しない変更（フォーマットなど）
- refactor: バグ修正も機能追加も行わないコード変更
- perf: パフォーマンス改善
- test: テストの追加・修正
- chore: ビルドプロセスやツールの変更

