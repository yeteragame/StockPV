import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_ORIGIN?.split(",") || true }));
app.use(express.json({ limit: "1mb" }));
const port = Number(process.env.PORT || 4000);

const providerGroups = {
  marketData: ["TWELVE_DATA_API_KEY","ALPHA_VANTAGE_API_KEY","FINNHUB_API_KEY","POLYGON_API_KEY","EODHD_API_KEY"],
  broker: ["SAHI_API_KEY","ANGELONE_API_KEY","UPSTOX_API_KEY","KITE_API_KEY","DHAN_API_KEY","FYERS_APP_ID"],
  ai: ["GEMINI_API_KEY","OPENAI_API_KEY","ANTHROPIC_API_KEY","GROQ_API_KEY","MISTRAL_API_KEY"],
  payment: ["CASHFREE_APP_ID","RAZORPAY_KEY_ID","PAYU_MERCHANT_KEY","PHONEPE_CLIENT_ID","STRIPE_SECRET_KEY"],
  news: ["NEWSAPI_KEY","FINNHUB_NEWS_API_KEY","MARKETAUX_API_KEY","GNEWS_API_KEY","ALPHA_VANTAGE_NEWS_KEY"],
  otp: ["MSG91_AUTH_KEY","TWILIO_ACCOUNT_SID","VONAGE_API_KEY","TWOFACTOR_API_KEY","FIREBASE_PROJECT_ID"]
};
app.get("/api/health", (_req,res)=>res.json({status:"ok",app:"StockPV API",mode:"starter",time:new Date().toISOString()}));
app.get("/api/config/status", (_req,res)=>{
  const status = Object.fromEntries(Object.entries(providerGroups).map(([group,keys])=>[group,keys.map(key=>({key,configured:Boolean(process.env[key])}))]));
  res.json({status:"ok",providers:status,note:"Only presence is reported; secret values are never returned."});
});
app.get("/api/market/overview", (_req,res)=>{
  res.json({mode:"demo",live:false,message:"No licensed market-data provider configured. Values must not be treated as live prices.",indices:[
    {symbol:"NIFTY 50",price:24112.35,change:0.72},{symbol:"SENSEX",price:79802.14,change:0.58},
    {symbol:"BANK NIFTY",price:51204.8,change:-0.24},{symbol:"INDIA VIX",price:14.28,change:-1.15}
  ]});
});
app.get("/api/integrations/sahi/status", (_req,res)=>res.json({
  provider:"SAHI Trade API",
  configured:Boolean(process.env.SAHI_API_KEY),
  staticIpConfigured:Boolean(process.env.SAHI_STATIC_IP),
  tradingReady:false,
  note:"SAHI endpoints, auth signing, request schemas and order workflows must be implemented against the current official SAHI documentation. Do not send orders until reviewed and tested."
}));
app.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({error:"Internal server error"});});
app.listen(port,()=>console.log(`StockPV API listening on ${port}`));
