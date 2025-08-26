# ResilientFlow

A web app for users to engage in daily activities that build emotional resilience, featuring automated check-ins, progress tracking, and AI-driven personalized insights.

## Features

- **Gamified Daily Check-ins**: Automated, low-friction prompts for daily emotional activity
- **Visual Progress Dashboard**: Clear, insightful charts and summaries of emotional trends
- **Curated Resilience Activities**: Short, guided exercises tailored to common emotional challenges
- **Personalized Insight Engine**: Identifying patterns and suggesting personalized strategies based on tracked data

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **State Management**: Zustand
- **Database**: Supabase
- **Authentication**: Supabase Auth
- **Charts**: Recharts
- **AI Integration**: OpenAI API

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account (for database and authentication)
- OpenAI API key (optional, for AI insights)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/resilient-flow.git
   cd resilient-flow
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add the following variables:
     ```
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     VITE_OPENAI_API_KEY=your_openai_api_key (optional)
     ```

4. Set up Supabase:
   - Follow the instructions in [SUPABASE_SETUP.md](SUPABASE_SETUP.md)

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Demo Mode

If you don't set up Supabase, the app will run in demo mode with mock data. This is useful for development and testing.

## Project Structure

```
resilient-flow/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   ├── lib/             # Utility libraries
│   ├── pages/           # Page components
│   ├── services/        # API service modules
│   ├── stores/          # Zustand state stores
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   └── main.jsx         # Entry point
├── supabase/            # Supabase configuration
└── .env                 # Environment variables
```

## Data Model

- **User**: User account information and preferences
- **DailyEntry**: Daily emotional state check-ins
- **Activity**: Resilience-building activities
- **ActivityLog**: Records of completed activities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Supabase](https://supabase.com) for database and authentication
- [OpenAI](https://openai.com) for AI insights
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Recharts](https://recharts.org) for data visualization

