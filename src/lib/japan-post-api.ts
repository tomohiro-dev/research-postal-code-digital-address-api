import {
  JapanPostTokenResponse,
  JapanPostSearchResponse,
} from "./types";

// 環境設定
// true: Mock環境 (stub-qz73x...) を使用
// false: 本番環境 (api.da.pf...) を使用 (IP偽装あり)
const USE_MOCK_ENV = process.env.NEXT_PUBLIC_USE_MOCK_ENV !== "false"; 

// 定数定義
const MOCK_BASE_URL = "https://stub-qz73x.da.pf.japanpost.jp/api/v1";
const PROD_BASE_URL = "https://api.da.pf.japanpost.jp/api/v1";

/**
 * 日本郵政APIクライアント
 */
export class JapanPostClient {
  private clientId: string;
  private secretKey: string;
  private registeredHost: string;

  constructor() {
    this.clientId = process.env.JP_DIGITAL_AD_CLIENT_ID || "";
    this.secretKey = process.env.JP_DIGITAL_AD_SECRET_KEY || "";
    this.registeredHost = process.env.JP_REGISTERED_HOST || "http://localhost:3000";

    // クレデンシャルチェック
    if (!this.clientId || !this.secretKey) {
      console.warn("Japan Post API credentials are missing in environment variables.");
    }
  }

  /**
   * アクセストークンを取得する
   */
  async getAccessToken(): Promise<string> {
    const isMock = USE_MOCK_ENV;
    const baseUrl = isMock ? MOCK_BASE_URL : PROD_BASE_URL;
    const url = `${baseUrl}/j/token`;

    // Request Bodyの構築
    // Mock: secret_key
    // Prod: client_secret (Standard OAuth 2.0)
    const bodyParams: Record<string, string> = {
      grant_type: "client_credentials",
      client_id: this.clientId,
    };

    if (isMock) {
      bodyParams["secret_key"] = this.secretKey;
    } else {
      bodyParams["client_secret"] = this.secretKey;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "Origin": this.registeredHost,
    };

    // 本番環境（またはIP制限のあるテスト環境）へのIP偽装
    if (!isMock) {
      headers["X-Forwarded-For"] = "127.0.0.1";
    }

    console.log(`[API] Fetching Token (${isMock ? "Mock" : "Prod"})...`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(bodyParams),
      });

      if (!response.ok) {
        throw await this.createError(response, "Token Fetch");
      }

      const data: JapanPostTokenResponse = await response.json();
      
      // Response Normalization
      // Mockは 'token', 本番は 'access_token' (想定)
      const token = data.access_token || data.token;
      
      if (!token) {
        throw new Error(`Token not found in response. Keys: ${Object.keys(data).join(", ")}`);
      }
      
      return token;
    } catch (error) {
      console.error("[API] Token Error:", error);
      throw error;
    }
  }

  /**
   * 住所検索を実行
   * @param code 7桁の郵便番号またはデジタルアドレス
   */
  async searchAddress(code: string): Promise<JapanPostSearchResponse> {
    const token = await this.getAccessToken();
    
    const isMock = USE_MOCK_ENV;
    const baseUrl = isMock ? MOCK_BASE_URL : PROD_BASE_URL;
    
    // パスパラメータ形式: /searchcode/{code}
    const url = `${baseUrl}/searchcode/${code}`;
    
    console.log(`[API] Searching Address: ${code} (${isMock ? "Mock" : "Prod"})`);

    const headers: Record<string, string> = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      "Origin": this.registeredHost,
    };

    if (!isMock) {
      headers["X-Forwarded-For"] = "127.0.0.1";
    }

    try {
      const response = await fetch(url, {
        method: "GET",
        headers,
      });

      if (!response.ok) {
        throw await this.createError(response, "Search Address");
      }

      const data: JapanPostSearchResponse = await response.json();
      return data;
    } catch (error) {
      console.error("[API] Search Error:", error);
      throw error;
    }
  }

  /**
   * エラーオブジェクト生成ヘルパー
   */
  private async createError(response: Response, context: string) {
    const text = await response.text();
    return {
      message: `${context} failed: ${response.status} ${response.statusText}`,
      status: response.status,
      detail: text,
    };
  }
}

// シングルトンインスタンス
export const japanPostClient = new JapanPostClient();