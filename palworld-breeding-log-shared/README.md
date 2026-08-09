# パル配合記録帳を、インターネットに公開する手順

これを最後まで順番にやれば、あなたの「パル配合記録帳」が
インターネット上のアドレス（URL）で、誰でも見られるようになります。
一つずつ、飛ばさずにやってください。難しく見えても、順番にやれば大丈夫です。

かかる時間の目安：30分〜1時間くらい
お金：かかりません（無料の範囲でできます）

---

## まず、全体の流れをざっくり知っておこう

1. 「Supabase（スーパーベース）」という、データを保存しておく無料の倉庫を作る
2. パソコンに「Node.js（ノードジェイエス）」という道具を入れる
3. アプリのファイルをパソコンで動かしてみる（練習）
4. 「Vercel（バーセル）」という無料のサービスで、インターネットに公開する

この4つだけです。順番にやっていきましょう。

---

## ステップ1：Supabase（データの倉庫）を作る

### 1-1. アカウントを作る

1. ブラウザで https://supabase.com を開く
2. 右上あたりの「Start your project」というボタンを押す
3. 「Continue with GitHub」を押す（GitHubのアカウントがなければ、その場で無料で作れます）
4. 案内にしたがって進む

### 1-2. プロジェクト（保管場所）を作る

1. 「New project」というボタンを押す
2. 名前を聞かれたら、好きな名前を入れる（例：palworld-log）
3. パスワードを聞かれたら、自動で作られたものをそのまま使ってOK。ただし、あとで使うので、どこかにメモ帳などでコピーして残しておく
4. 場所（Region）を聞かれたら「Tokyo」を選ぶ
5. 「Create new project」を押して、1〜2分待つ

待っている間に、次のステップの説明を読んでおいてください。

### 1-3. データを入れる「表」を作る

1. 画面の左側にあるメニューから「SQL Editor」を探してクリック
2. 「New query」というボタンを押すと、文字を打てる白い画面が出てくる
3. その白い画面に、下の文字を**そのままコピーして貼り付ける**

```sql
create table kv_store (
  key text primary key,
  value text not null,
  updated_at timestamptz default now()
);

alter table kv_store enable row level security;

create policy "誰でも読める" on kv_store
  for select using (true);

create policy "誰でも書き込める" on kv_store
  for insert with check (true);

create policy "誰でも書き換えられる" on kv_store
  for update using (true);

create policy "誰でも消せる" on kv_store
  for delete using (true);
```

4. 画面右下の緑色の「Run」というボタン（または `Ctrl+Enter`）を押す
5. 「Success」という緑の表示が出れば成功

これで、データを入れておく「箱」ができました。

### 1-4. リアルタイム更新をONにする（任意）

1. 左メニューの「Database」→「Publications」をクリック
2. `supabase_realtime` という項目をクリックし、`kv_store` のスイッチをONにする

これをやっておくと、将来「他の人の更新がすぐ見える」機能を足しやすくなります。今回のシンプル版では必須ではないので、わからなければ飛ばしてOKです。

### 1-5. 「鍵」をメモしておく

1. 左メニューの「Project Settings」（歯車マーク）→「API」をクリック
2. 「Project URL」という欄の文字列をコピーして、メモ帳に貼っておく
3. 「anon public」という欄の、長い文字列もコピーして、メモ帳に貼っておく

この2つは、あとで必ず使います。無くさないでください。

---

## ステップ2：パソコンに「Node.js」を入れる

これは、アプリを動かすための土台になるプログラムです。

1. ブラウザで https://nodejs.org を開く
2. 「LTS」と書かれている、大きい方のボタンをクリックしてダウンロード
   - Windowsなら「Windows Installer (.msi)」を選ぶ
   - Macなら「macOS Installer (.pkg)」を選ぶ
3. ダウンロードしたファイルをダブルクリックして開く
4. 「Next」「Next」「Install」のように、案内どおりに進めていく
5. 終わったら、一度使っているウィンドウ（ターミナルやPowerShell）を**全部閉じる**

### 確認する

1. 新しく「ターミナル」（Macの場合）または「PowerShell」（Windowsの場合）を開く
2. 次の文字を打って、Enterキーを押す

```
node -v
```

3. `v20.〇〇〇` のような文字が出れば、成功です

---

## ステップ3：アプリのファイルを準備する

お渡ししたzipファイルを展開（解凍）して、出てきたフォルダを使います。

### 3-1. フォルダに移動する

1. ターミナル（またはPowerShell）を開く
2. `cd ` と半角スペースを打つ（`cd` の後ろに1つスペース）
3. 展開したフォルダを、ターミナルの画面にドラッグ＆ドロップする（パスが自動で入ります）
4. Enterキーを押す

### 3-2. 必要な部品をインストールする

次の文字を打って、Enterを押す。1〜2分かかります。

```
npm install
```

たくさん文字が流れますが、赤いエラーが出ていなければ大丈夫です。

### 3-3. 鍵を設定する

1. フォルダの中にある `.env.example` というファイルを探す
   - 見つからない場合は「隠しファイルを表示する」設定にする必要があります
     - Mac：Finderで `Cmd + Shift + .`（ピリオド）
     - Windows：エクスプローラーの「表示」タブから「隠しファイル」にチェック
2. `.env.example` をコピーして、コピーしたファイルの名前を `.env` に変える
3. `.env` をメモ帳（またはテキストエディット）で開く
4. 中身がこうなっているので、

```
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

5. ステップ1-5でメモしておいた2つの文字列に、書き換える（`=` の後ろだけを変える）
6. 保存する

### 3-4. 試しに動かしてみる

ターミナルで次を打って、Enter：

```
npm run dev
```

```
Local:   http://localhost:5173/
```

のような表示が出たら、そのアドレスをブラウザで開いてみてください。アプリの画面が出てきたら成功です！ここまでできたら、いよいよ公開です。

（動作確認できたら、ターミナルで `Ctrl + C` を押すと、いったん止められます）

---

## ステップ4：Vercel（インターネットへの公開）

### 4-1. コードをGitHubに置く

1. https://github.com にアクセスして、無料アカウントを作る（Supabaseと同じアカウントでもOK）
2. 右上の「＋」→「New repository」を押す
3. 名前を決めて（例：palworld-log）「Create repository」を押す
4. 作成後の画面に出てくる案内、または以下のコマンドをターミナルで順番に打つ（さっきの `npm run dev` を止めた状態で）

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin ここにGitHubが表示するURLを貼る
git push -u origin main
```

（`git` コマンドが「見つかりません」と出た場合は、https://git-scm.com からGitをインストールしてから、もう一度試してください）

### 4-2. Vercelでデプロイ（公開）する

1. https://vercel.com を開き、「Continue with GitHub」でログイン
2. 「Add New...」→「Project」を押す
3. さっき作ったGitHubのリポジトリを選んで「Import」
4. 「Environment Variables」という欄に、以下の2つを追加する
   - 名前：`VITE_SUPABASE_URL` → 値：ステップ1-5でメモしたProject URL
   - 名前：`VITE_SUPABASE_ANON_KEY` → 値：ステップ1-5でメモしたanon publicキー
5. 「Deploy」ボタンを押して、1分ほど待つ

終わると `https://なにか.vercel.app` というアドレスが表示されます。これが、あなたのアプリの公開URLです。このURLを友達に送れば、誰でもアクセスして、同じ配合記録・図鑑を一緒に使えます。

---

## 困ったときは

- 画面が真っ白になる → `.env` の中身（URLとキー）が正しいか、コピーミスがないか確認してください
- 「command not found」と出る → そのコマンド（node、npm、git）がインストールされていないか、ターミナルを再起動していない可能性があります
- それでも直らない → 出ているエラーメッセージをそのままコピーして、Claudeに貼り付けて聞いてください。一緒に直します

## 今後のアップデートについて

アプリの機能を追加・修正したら、また新しいファイルをお渡しします。その時は、フォルダの中の `src` フォルダにあるファイルを新しいものに入れ替えて、

```
git add .
git commit -m "update"
git push
```

を打てば、Vercelが自動で新しいバージョンに公開し直してくれます。
