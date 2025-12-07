#!/bin/bash
source .env.local 2>/dev/null

# テスト環境
HOST="https://stub-qz73x.da.pf.japanpost.jp"

# Tokenを取得
echo "Requesting Token..."
TOKEN_JSON=$(curl -s -X POST "$HOST/api/v1/j/token" \
  -H "Content-Type: application/json" \
  -d "{\"grant_type\":\"client_credentials\",\"client_id\":\"$JP_DIGITAL_AD_CLIENT_ID\",\"secret_key\":\"$JP_DIGITAL_AD_SECRET_KEY\"}")

echo "Token Response: $TOKEN_JSON"

# Node.jsを使って抽出
TOKEN=$(echo $TOKEN_JSON | node -e "console.log(JSON.parse(require('fs').readFileSync(0)).token)")

if [ -n "$TOKEN" ] && [ "$TOKEN" != "undefined" ]; then

  # 2. Search
  echo -e "\nSearching Address (1000001)..."
  curl -s -X GET "$HOST/api/v1/searchcode/1000001" \
    -H "Authorization: Bearer $TOKEN"
  echo ""
else
  echo "Token extraction failed."
fi