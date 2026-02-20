# 🍰 Bakery Delivery Super App

A production-ready full-stack bakery delivery application with Telegram Mini App integration.

## Architecture

```
/frontend   → Next.js 14 + Tailwind + Framer Motion (Port 3000)
/backend    → Node.js + Express + MongoDB (Port 5000)
/admin      → Next.js Admin Dashboard (Port 3001)
/bot        → Telegram Bot (Telegraf)
```

## Quick Start

### 1. Backend
```bash
cd backend
npm install
# Edit .env with your MongoDB URI
npm run seed    # Seed database
npm run dev     # Start API server
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev     # Start at http://localhost:3000
```

### 3. Admin
```bash
cd admin
npm install
npm run dev     # Start at http://localhost:3001
```
Admin Login: `admin@bakery.uz` / `admin123`

### 4. Telegram Bot
```bash
cd bot
npm install
# Edit .env with your BOT_TOKEN from @BotFather
npm run dev
```

## Features

- 🌍 **Multilingual**: Uzbek (default), Russian, English
- 🎨 **Luxury UI**: Glassmorphism, 3D cards, animations
- 🛒 **Cart System**: Animated drawer with quantity controls
- 💳 **Payments**: Cash + Click simulation
- 🤖 **Telegram Mini App**: Full WebApp integration
- 👑 **Admin Panel**: Dashboard, products, orders, users
- 🌙 **Dark/Light Mode**: Theme switching
- 📱 **PWA**: Installable progressive web app
- 🔄 **Real-time**: Socket.io order updates
- 🎉 **Confetti**: Order success celebration
- 📊 **Analytics**: Revenue, orders, users charts

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/bakery-delivery
JWT_SECRET=your-secret-key
TELEGRAM_BOT_TOKEN=your-bot-token
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Bot (.env)
```
BOT_TOKEN=your-bot-token
WEBAPP_URL=https://your-frontend.vercel.app
API_URL=http://localhost:5000
```

## Deployment

- **Frontend** → Vercel
- **Admin** → Vercel
- **Backend** → Render.com
- **Bot** → Render.com (Background Worker)
- **Database** → MongoDB Atlas

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, Framer Motion |
| Backend | Node.js, Express, MongoDB, Mongoose |
| Auth | JWT, Telegram initData HMAC-SHA256 |
| Real-time | Socket.io |
| Bot | Telegraf |
| QR | qrcode library |
| Validation | Zod |
| Security | Helmet, CORS, Rate Limiting |
