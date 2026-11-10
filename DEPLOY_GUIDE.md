# GitHub Pages 公開手順（ユーザー承認後）

このパッケージを新しい **公開用リポジトリ** のルートへアップロードし、GitHub Settings → Pages → Build and deployment → Source: GitHub Actions を選択します。`main` への push で `.github/workflows/pages.yml` がサイトを更新します。GitHubのアカウントとリポジトリ名を確認してから操作してください。

## 一斉更新
- 問題の更新は `content.json` の `version` と `manifest.json` の `contentVersion` を上げ、GitHub に commit/push。
- ゲーム機能の更新は `index.html` と `manifest.json` の `appVersion` を上げて push。
- Pages デプロイ成功後、**同じ公開URL** の利用者が次回アクセス/更新確認で新教材を取得。開いているページのコードは自動置換されず、再読み込みが必要。
- ZIPを配った相手には更新は反映されない。
- 学習履歴は同一ブラウザ・同一オリジンの localStorage に保存。端末間の同期は未実装。

## 公開前チェック
- 運営者の表示名・ライセンス（同梱MIT）・プライバシー方針を確認。
- 公開リポジトリには秘密鍵、取引履歴、個人情報、他社の有料教材・非公開Chapioコードを置かない。
- 本番URLでスマホ/PC表示、コース解放、進捗保存・復元、更新反映を実機試験。
- この構成は公開URLでの中央配信を前提とし、GitHub Pagesへの**実際の公開は未実施**。
