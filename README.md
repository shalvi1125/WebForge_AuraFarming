# 🌟 Raahi – AI-Powered Indian Heritage Travel Companion

<div align="center">
  <img src="public/images/logo.png" alt="Raahi Logo" width="120" height="120">
  
  <h3>Transforming Cultural Tourism Through Technology</h3>

  <p>
    <img src="https://img.shields.io/badge/React-19.0.0-blue.svg">
    <img src="https://img.shields.io/badge/TypeScript-5.7.3-blue.svg">
    <img src="https://img.shields.io/badge/Cloudflare-Workers-orange.svg">
    <img src="https://img.shields.io/badge/TailwindCSS-4.1.16-blue.svg">
    <img src="https://img.shields.io/badge/OpenAI-GPT--4o--mini-green.svg">
  </p>

  
## 📘 Overview

**Raahi** is an AI-powered travel companion redefining Indian heritage tourism.  
It helps travelers **discover, plan, and experience** India’s cultural legacy through **personalized itineraries**, **interactive exploration**, and **community-driven authenticity**.

### 🎯 Mission
> *The Only AI Travel Companion That Understands India’s Soul.*

Raahi combines **AI intelligence**, **local context**, and **cultural insight** to create an immersive, meaningful travel experience.

---

## 🚀 Key Features

### 🧭 **AI Travel Planning**
- GPT-4o-mini powered itinerary generation  
- Context-aware cultural recommendations  
- Weather and season-based dynamic planning  
- Multi-language narrative storytelling  

### 🌍 **Smart Search**
- Intelligent city and landmark suggestions  
- Typo-tolerant (e.g., “Gao” → *Goa*)  
- Offline cache for quick results  

### 🗺️ **Interactive Heritage Maps**
- 3D visualization of sites  
- Explore routes, monuments, and artifacts  
- Real-time route estimation and navigation  

### 💬 **AI Chat Companion**
- Conversational travel assistant  
- Multilingual (12 Indian languages)  
- Context retention and on-trip guidance  

### 📸 **Memory & Media Intelligence**
- Smart photo geotagging and organization  
- AI-generated captions and descriptions  
- Personal digital travel albums  

### 👥 **Community Layer**
- Authentic reviews and traveler interactions  
- Follow, share, and reward system  
- Local experience-based recommendations  

---

## 🧠 Technology Stack

### 🎨 **Frontend**
| Technology | Purpose |
|-------------|----------|
| React 19.0.0 | UI Framework |
| TypeScript 5.7.3 | Strong typing |
| TailwindCSS 4.1.16 | Styling |
| Vite 7.1.12 | Build tool |
| React Router 7.5.3 | Routing |

### ⚙️ **Backend & Infrastructure**
| Technology | Purpose |
|-------------|----------|
| Cloudflare Workers | Edge-hosted backend |
| Hono 4.7.7 | Lightweight API framework |
| Neon PostgreSQL | Serverless database |
| Cloudflare R2 | Object storage (planned) |
| Wrangler 4.33.0 | Deployment CLI |

### 🤖 **AI & APIs**
| API | Usage |
|------|--------|
| OpenAI GPT-4o-mini | AI chat & itinerary generation |
| Google Maps API | Routes, distances, geocoding |
| SerpAPI | Maps, reviews, events, hotels |
| Open-Meteo API | Real-time weather |
| Google Translate API | Multilingual responses |

### 🧩 **Developer Tools**
| Tool | Purpose |
|------|----------|
| ESLint + Prettier | Code quality |
| TypeScript ESLint | Type checking |
| Vitest | Testing |
| Wrangler | Edge deployment |

---

## ⚙️ Setup Guide

### 🧩 **Prerequisites**
- **Node.js** ≥ 18  
- **npm** ≥ 8  
- **Cloudflare account** (for deployment)  
- **Neon Database** (for persistence)

---

### 💻 **Local Development Setup**

```bash
# 1️⃣ Clone repository
git clone https://github.com/yourusername/raahi.git
cd raahi

# 2️⃣ Install dependencies
npm install

# 3️⃣ Copy environment file
cp .env.example .env
