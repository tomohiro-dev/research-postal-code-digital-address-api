import { NextRequest, NextResponse } from "next/server";
import { japanPostClient } from "@/lib/japan-post-api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");

  // 1. バリデーション
  if (!code) {
    return NextResponse.json(
      { error: "Parameter 'code' is required." },
      { status: 400 }
    );
  }

  // 7桁数字チェック (ハイフンなし)
  if (!/^\d{7}$/.test(code)) {
    return NextResponse.json(
      { error: "Invalid code format. Must be 7 digits (no hyphens)." },
      { status: 400 }
    );
  }

  try {
    // 2. API呼び出し
    const data = await japanPostClient.searchAddress(code);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("BFF API Error:", error);

    // エラーレスポンスの正規化
    const status = error.status || 500;
    const message = error.message || "Internal Server Error";
    
    // 詳細情報 (detail) はセキュリティのため本番では隠すべきだが、今回は研究用なので出す
    const detail = error.detail || null;

    return NextResponse.json(
      { error: message, detail },
      { status }
    );
  }
}
