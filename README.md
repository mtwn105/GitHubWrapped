# GitHub Wrapped 2025

Your personalized year in review for GitHub contributions and coding activity. View your GitHub stats, contributions, and coding journey for 2025 in a beautiful, shareable format.

![GitHub Wrapped 2025](https://githubwrapped.xyz/github-wrapped-og.png)

## Live Demo - [Click here](https://githubwrapped.xyz)

## Features

- 📊 Comprehensive GitHub statistics visualization
- 📈 Contribution patterns and calendar heatmap
- 🔤 Most used programming languages
- 🌟 Top repositories showcase
- 🤖 AI-powered year analysis and fun roasting
- 📱 Social sharing with dynamic OG images
- 💾 Download stats as image

## Tech Stack

- **Framework**: Next.js 14 (TypeScript)
- **Database**: MongoDB
- **Styling**: Tailwind CSS + Shadcn UI
- **APIs**: GitHub GraphQL & REST, OpenRouter AI
- **Analytics**: Umami

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB
- GitHub Personal Access Token
- OpenRouter API Key (for AI feature)

### Setup

1. Clone the repository

```bash
git clone https://github.com/mtwn105/GitHubWrapped.git
cd GitHubWrapped/frontend
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

Create a `.env.local` file in the `frontend` directory:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/githubwrapped

# GitHub
GITHUB_TOKEN=your_github_token

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_key

# Umami Analytics (optional)
NEXT_PUBLIC_UMAMI_URL=https://your-umami-instance.com
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_website_id

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

### Getting API Keys

**GitHub Token:**

- Go to GitHub Settings → Developer settings → Personal access tokens
- Generate token with `repo`, `read:user`, `user:email` scopes

**OpenRouter (for AI):**

- Sign up at [OpenRouter](https://openrouter.ai/)
- Get API key from dashboard

## Project Structure

```
frontend/
├── app/
│   ├── [username]/         # User profile pages
│   ├── about/              # About page
│   ├── actions/            # Server actions
│   ├── api/                # API routes
│   │   ├── [username]/og/  # OG image generation
│   │   ├── ai/             # AI analysis
│   │   └── stats/          # Stats endpoints
│   └── page.tsx            # Home page
├── components/             # UI components
├── lib/
│   ├── models/             # MongoDB models
│   ├── services/           # Business logic
│   ├── github.ts           # GitHub API
│   └── mongodb.ts          # DB connection
└── types/                  # TypeScript types
```

## API Endpoints

- `GET /api/stats/[username]` - Get user stats
- `POST /api/stats/[username]` - Generate user stats
- `GET /api/stats/top` - Top 6 users
- `GET /api/stats/all` - All users
- `POST /api/ai` - AI analysis
- `GET /api/[username]/og` - OG image

## Deployment

### Vercel (Recommended)

1. Import your repository to Vercel
2. Set `frontend` as root directory
3. Add environment variables:
   ```
   MONGODB_URI=your_mongodb_uri
   GITHUB_TOKEN=your_github_token
   OPENROUTER_API_KEY=your_openrouter_key
   NEXT_PUBLIC_UMAMI_URL=your_umami_url
   NEXT_PUBLIC_UMAMI_WEBSITE_ID=your_umami_id
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```
4. Deploy

### MongoDB Atlas

1. Create cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist IPs (`0.0.0.0/0` for Vercel)
4. Add connection string to Vercel env vars

## Contributing

Contributions are welcome! Feel free to submit a Pull Request.

1. Fork the repository
2. Create feature branch
3. Commit your changes
4. Push and open a PR

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Amit Wani](https://github.com/mtwn105)

- Twitter: [@mtwn105](https://x.com/mtwn105)
- GitHub: [@mtwn105](https://github.com/mtwn105)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Analytics by [Umami](https://umami.is/)
