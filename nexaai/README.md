# NexaAI - Premium AI SaaS Platform

A production-ready AI assistant ecosystem inspired by ChatGPT and Perplexity AI.

## Features

- 💬 **AI Chat** - Intelligent conversations with context memory
- 💻 **Coding Assistant** - Code generation, explanation, and debugging
- 🎨 **Image Generation** - AI-powered image creation (coming soon)
- 📁 **File Analysis** - Upload and analyze PDFs, images, documents
- 💳 **Subscription System** - Free, Pro, Business, and Enterprise tiers
- 🎯 **Credit System** - Pay-per-use with monthly allowances
- 📊 **Admin Dashboard** - Complete analytics and management

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Gemini API key (free)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd nexaai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Get your free Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create an API key
   - Add it to your `.env` file:
   ```
   VITE_GEMINI_API_KEY=your_actual_key_here
   ```

5. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
src/
├── components/     # React components
│   ├── Sidebar.tsx
│   ├── Header.tsx
│   └── ChatArea.tsx
├── services/       # API integrations
│   ├── ai.ts
│   └── gemini.ts
├── store/          # State management
│   └── appStore.ts
├── types/          # TypeScript interfaces
│   └── index.ts
├── utils/          # Helper functions
└── pages/          # Page components
```

## AI Models

NexaAI provides branded AI models for different use cases:

| Model | Tier | Cost | Use Case |
|-------|------|------|----------|
| NexaAI Lite | FREE | 2 credits | Everyday questions |
| NexaAI Pro | PRO | 8 credits | Advanced reasoning |
| NexaAI Intelligence | BUSINESS | 15 credits | Professional workflows |
| NexaAI Ultra | ENTERPRISE | 25 credits | Maximum capability |
| NexaAI Code | PRO | 8 credits | Programming assistance |
| NexaAI Vision | PRO | 50 credits | Image analysis |

## Subscription Plans

### FREE - $0/month
- 1,000 credits/month
- NexaAI Lite access
- Basic features
- Ad-supported

### PRO - $10/month
- 15,000 credits/month
- NexaAI Pro access
- Image generation
- File analysis
- No ads

### BUSINESS - $25/month
- 50,000 credits/month
- Team accounts
- Shared workspace
- Analytics

### ENTERPRISE - $100+/month
- Custom credits
- NexaAI Ultra
- Priority support
- Custom integrations

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **AI Provider**: Google Gemini
- **Hosting**: Vercel (recommended)
- **Database**: PostgreSQL (backend)

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

```
VITE_GEMINI_API_KEY=your_production_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
VITE_APP_URL=https://yourdomain.com
```

## Future Roadmap

- [ ] Voice AI capabilities
- [ ] Mobile apps (iOS & Android)
- [ ] Browser extension
- [ ] Public API
- [ ] Plugin system
- [ ] Advanced search
- [ ] AI agents
- [ ] GitHub integration

## License

MIT License - See LICENSE file for details

## Support

For support, email support@nexaai.com or join our Discord community.
