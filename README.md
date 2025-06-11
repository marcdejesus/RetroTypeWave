# RetroTypeWave 🎮⌨️

A retro-themed multiplayer typing race game that combines the nostalgia of synthwave aesthetics with competitive typing challenges. Improve your typing speed and accuracy while racing against AI opponents in a vibrant, neon-soaked environment.

## ✨ Features

### 🏁 Core Gameplay
- **AI Racing**: Challenge yourself against intelligent AI opponents
- **Real-time Typing**: Fast-paced typing races with dynamic prompts
- **Speed & Accuracy**: Track your Words Per Minute (WPM) and accuracy metrics
- **Progressive Difficulty**: Adaptive challenges that grow with your skills

### 🎯 Competitive Features
- **Elo Rating System**: Dynamic skill-based rating that adjusts with performance
- **Global Leaderboard**: Compete for top positions against players worldwide
- **Personal Best Tracking**: Monitor your improvement over time
- **Performance Analytics**: Detailed statistics on your typing performance

### 🎨 Retro Experience
- **Synthwave Aesthetics**: Immersive retro-futuristic visual design
- **Animated Backgrounds**: Dynamic retrowave city sunset scenes
- **Neon UI Elements**: Carefully crafted interface with retro styling
- **Authentic Feel**: True-to-era design language and animations

### 🔮 Coming Soon
- **Multiplayer Lobbies**: Race against friends in private rooms
- **Custom Prompts**: Create and share your own typing challenges
- **Achievements System**: Unlock rewards for various milestones
- **Tournament Mode**: Organized competitive events

## 🛠️ Tech Stack

### Frontend
- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[React 18](https://react.dev/)** - UI library with latest features
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first styling
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives

### Backend & Services
- **[Firebase](https://firebase.google.com/)** - Backend-as-a-Service
  - Authentication
  - Firestore Database
  - Hosting
- **[Google GenKit](https://firebase.google.com/docs/genkit)** - AI integration
- **[Gemini 2.0 Flash](https://ai.google.dev/)** - AI model for dynamic content

### Development Tools
- **[TanStack Query](https://tanstack.com/query)** - Server state management
- **[React Hook Form](https://react-hook-form.com/)** - Form handling
- **[Zod](https://zod.dev/)** - Runtime type validation
- **[Lucide React](https://lucide.dev/)** - Icon library

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **Firebase Project** with Firestore enabled
- **Google AI API Key** for GenKit integration

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/RetroTypeWave.git
   cd RetroTypeWave
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Firebase and Google AI credentials (see [Environment Setup](#environment-setup) below)

4. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore Database
   - Enable Authentication (optional, for future features)
   - Copy your configuration to `.env.local`

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:9002](http://localhost:9002)

### Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Google AI (for GenKit)
GOOGLE_GENAI_API_KEY=your_google_ai_api_key
```

## 📝 Available Scripts

- `npm run dev` - Start development server on port 9002 with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run typecheck` - Run TypeScript type checking
- `npm run genkit:dev` - Start GenKit development server
- `npm run genkit:watch` - Start GenKit in watch mode

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── game-lobby/        # Game lobby page
│   ├── race/              # Race gameplay page
│   ├── about/             # About page
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   └── ui/               # Shadcn/ui components
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions and configs
│   └── firebase.ts       # Firebase configuration
├── ai/                   # GenKit AI integration
│   └── genkit.ts         # AI model configuration
└── types/                # TypeScript type definitions
```

## 🎮 How to Play

1. **Start a Race**: Click "Start Typing Now!" on the homepage
2. **Enter the Lobby**: Choose your difficulty and race settings
3. **Type Fast & Accurate**: Type the displayed prompt as quickly and accurately as possible
4. **Beat the AI**: Race against intelligent opponents that adapt to your skill level
5. **Track Progress**: Monitor your WPM, accuracy, and Elo rating
6. **Climb the Leaderboard**: Compete for the top spots globally

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint && npm run typecheck`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Synthwave Community** - For inspiration and aesthetic guidance
- **Open Source Libraries** - All the amazing tools that make this possible
- **Firebase Team** - For providing excellent backend infrastructure
- **Google AI** - For powering our intelligent features

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/RetroTypeWave/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/RetroTypeWave/discussions)
- **Email**: support@retrotypewave.com

---

**Built with ❤️ and ⌨️ by the RetroTypeWave team**
