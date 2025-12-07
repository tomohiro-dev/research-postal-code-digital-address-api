// 日本郵政デジタルアドレスAPIの型定義 (Mock環境準拠)

/**
 * トークン取得APIのレスポンス
 * Note: Mock環境では key が "access_token" ではなく "token" の場合があるが、
 * アプリケーション内では "access_token" に統一して扱うことを推奨。
 * ここではAPIの生レスポンス型として定義する。
 */
export interface JapanPostTokenResponse {
  token: string;         // Mock APIは "token" を返す
  access_token?: string; // 本番仕様またはOAuth標準
  expires_in: number;
  token_type: string;
  scope?: string;
  issued_at?: number;
}

/**
 * 住所情報オブジェクト
 * APIから返却される個々の住所データ
 */
export interface JapanPostAddress {
  dgacode: string | null;       // デジタルアドレス (郵便番号検索時はnullの場合あり)
  zip_code: string;             // 郵便番号
  pref_code?: string;           // 都道府県コード
  pref_name: string;            // 都道府県名
  pref_kana?: string;
  pref_roma?: string;
  city_code?: string;           // 市区町村コード
  city_name: string;            // 市区町村名
  city_kana?: string;
  city_roma?: string;
  town_name: string;            // 町名
  town_kana?: string;
  town_roma?: string;
  block_name: string | null;    // 丁目・番地
  other_name?: string | null;   // その他（建物名など）
  address: string | null;       // 結合されたフル住所文字列 (Mockではnullの場合あり)
  biz_name?: string | null;
  biz_kana?: string | null;
  biz_roma?: string | null;
  longitude?: string | null;
  latitude?: string | null;
}

/**
 * 住所検索APIのレスポンス
 */
export interface JapanPostSearchResponse {
  page: number;
  limit: number;
  count: number;
  searchtype: string;
  addresses: JapanPostAddress[];
}

/**
 * アプリケーション内部エラー型
 */
export interface AppError {
  message: string;
  code?: string;
  status?: number;
}
