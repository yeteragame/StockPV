# StockPV — Starter Project

StockPV is a fresh-start responsive web application scaffold for the agreed market-intelligence product plan.

## Included in this ZIP
- React + Vite responsive dashboard (mobile and desktop)
- Black + emerald visual system and reduced-motion support
- Ten primary navigation sections
- Stock discovery against a clearly labelled sample universe
- Watchlist interaction (session-only)
- Chart workspace with illustrative series
- AI research chat placeholder with explicit provider-not-configured messaging
- Virtual trading simulator with in-memory practice balance and trade history
- IPO, mutual-fund, news and Academy section shells
- Express backend with health, provider-presence status and demo-market endpoints
- Render environment template including SAHI Trade API slots
- Render Blueprint starter

## Important status
This is **StockPV Starter v0.1**, not a production-ready trading or investment application.
Market values shown in the UI are illustrative demo data, not live quotes. AI, OTP, Google OAuth, payments, broker order placement, persistent user accounts, database migrations, real news, IPO/fund feeds, and production admin analytics are not yet implemented. The SAHI screenshot is used to capture the required API-key and static-IP configuration concepts; its current official API documentation must be reviewed before implementing authenticated endpoints or any order workflow.

No live orders are sent. The Virtual Trading area is a local in-memory simulator and resets when the page reloads.

## Requirements
- Node.js 20+
- npm 10+

## Run locally
```bash
cp .env.example .env
npm install
npm run dev
```
- Frontend: http://localhost:5173
- Backend: http://localhost:4000/api/health

## Build frontend
```bash
npm run build
```

## Render deployment
This starter includes `render.yaml`. Connect the repository to Render and review the service settings. Add secrets in Render Dashboard → Environment. Never put API secrets in frontend variables or commit `.env`.

For a production deployment, configure a persistent database, secure authentication, HTTPS, CORS allow-list, secret rotation, logging, backups, rate limits and provider-specific integrations before opening access to users.

## SAHI integration notes
Environment placeholders:
- `SAHI_API_KEY`
- `SAHI_API_SECRET`
- `SAHI_CLIENT_CODE`
- `SAHI_STATIC_IP`

The screenshot indicates a static IP is required for placing orders, while data APIs can be used without one. Confirm exact current credential names, API host, authentication signature, permitted endpoints, IP allow-listing and exchange permissions in SAHI's official documentation. Do not infer endpoint paths or send live orders from this scaffold.

## Planned production milestones
1. Database schema, migrations, user sessions and phone OTP / Google OAuth.
2. Provider adapter interface and verified Market Data API integration.
3. SAHI authenticated data integration and separately gated order workflow.
4. Broker/data licensing and exchange compliance review.
5. Persistent paper-trading engine and accurate position/P&L calculations.
6. AI provider adapters, citations/source timestamps and usage limits.
7. Payment gateway orders, verified webhooks, invoices and subscription entitlements.
8. IPO, mutual fund, news, commodities and calendar data providers.
9. Secure owner-only admin analytics and audit trail.
10. Automated unit, integration, security and end-to-end tests.
11. Production Android packaging/PWA validation and final deployment.

## Safety and compliance
This project is for market information, research education and virtual trading. Real-money brokerage features require provider approval, exchange permissions, regulatory review and additional security work. Do not treat AI output as investment advice.
