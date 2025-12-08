import * as fs from "fs";
import * as path from "path";

// 1. まず環境変数を読み込む
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  console.log("Loading .env.local...");
  const envConfig = fs.readFileSync(envPath, "utf8");
  envConfig.split("\n").forEach((line) => {
    if (!line || line.startsWith("#")) return;
    const separatorIndex = line.indexOf("=");
    if (separatorIndex === -1) return;
    const key = line.substring(0, separatorIndex).trim();
    const value = line.substring(separatorIndex + 1).trim();
    const cleanValue = value.replace(/^['"](.*)['"]$/, "$1");
    if (key) process.env[key] = cleanValue;
  });
} else {
  console.warn(".env.local not found!");
}

// 2. その後でクライアントを動的インポート (これでprocess.envが反映される)
async function main() {
  const { japanPostClient } = await import("../src/lib/japan-post-api");

  console.log("--- Testing JapanPostClient ---");
  try {
    const code = "1000001";
    console.log(`Searching for code: ${code}`);
    
    const result = await japanPostClient.searchAddress(code);
    
    console.log("\nSuccess!");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("\nError occurred:");
    console.error(error);
  }
}

main();
