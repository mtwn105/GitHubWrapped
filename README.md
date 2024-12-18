# GitHub Wrapped 2024

Your personalized year in review for GitHub contributions and coding activity. View your GitHub stats, contributions, and coding journey for 2024 in a beautiful, shareable format.

![GitHub Wrapped 2024](https://githubwrapped.xyz/github-wrapped-og.png)

## Live Demo - [Click here](https://githubwrapped.xyz)

## Features

- 📊 Comprehensive GitHub statistics for 2024
- 📈 Contribution patterns visualization
- 🔤 Most used programming languages
- 🌟 Top repositories showcase
- 📊 Contribution breakdown analysis
- 🎯 Weekend activity tracking
- 📱 Social sharing capabilities
- 🖼️ Shareable OG images

## Tech Stack

### Frontend

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI Components
- OpenPanel for analytics
- Server Actions for API calls

### Backend

- Spring Boot 3.3
- Java 21
- MongoDB
- GitHub API Integration
- Resilience4j for circuit breaking
- Maven for dependency management

## Getting Started

### Prerequisites

- Node.js (Latest LTS version)
- Java 21
- MongoDB
- GitHub API Token
- pnpm (recommended) or npm

### Frontend Setup

1. Clone the repository

```bash
git clone https://github.com/mtwn105/GitHubWrapped.git
cd frontend
```

2. Install dependencies

```bash
pnpm install
```

3. Set up environment variables

```bash
# Create .env.local file
BACKEND_URL=http://localhost:9009
BACKEND_AUTH_TOKEN=your_auth_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_OPENPANEL_CLIENTID=your_openpanel_client_id
OPENPANEL_CLIENTID=your_openpanel_client_id
OPENPANEL_CLIENT_SECRET=your_openpanel_client_secret
```

4. Run development server

```bash
pnpm dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to backend directory

```bash
cd backend
```

2. Configure application.yml

```yaml
server:
  port: 9009

spring:
  data:
    mongodb:
      uri: mongodb://localhost:27017/githubwrapped

auth:
  token: your_auth_token

github:
  graphql:
    url: https://api.github.com/graphql
  username: your_github_username
  token: your_github_token
```

3. Run the application

```bash
./mvnw spring-boot:run
```

The backend will be available at `http://localhost:9009`

## Project Structure

```
project-root/
├── frontend/
│   ├── app/
│   │   ├── actions/
│   │   ├── components/
│   │   └── [username]/
│   ├── components/
│   ├── types/
│   └── public/
└── backend/
    ├── src/
    │   ├── main/
    │   │   ├── java/
    │   │   └── resources/
    │   └── test/
    └── pom.xml
```

## API Endpoints

### Stats

```
GET /api/stats/{username} - Get user's GitHub stats
POST /api/stats/{username} - Generate user's GitHub stats
GET /api/stats/top - Get top GitHub users
GET /api/stats/all - Get all GitHub users
```

### Health

```
GET /api/health - Check API health status
```

## Deployment

### Frontend

The application is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with `vercel deploy`

### Backend

The backend includes Fly.io configuration:

1. Install Fly.io CLI
2. Configure secrets:

```bash
flyctl secrets set MONGODB_URI=your_mongodb_uri
flyctl secrets set AUTH_TOKEN=your_auth_token
flyctl secrets set GITHUB_TOKEN=your_github_token
```

3. Deploy:

```bash
flyctl deploy
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author

Created by [Amit Wani](https://github.com/mtwn105)

- Twitter: [@mtwn105](https://x.com/mtwn105)
- GitHub: [@mtwn105](https://github.com/mtwn105)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/) and [Spring Boot](https://spring.io/projects/spring-boot)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
