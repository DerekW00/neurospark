# NeuroSpark

NeuroSpark is an ADHD-friendly task and goal management application designed to help users break down overwhelming goals into manageable tasks, visualize their schedule, and maintain momentum through regular check-ins.

## Features

- **AI-Powered Task Breakdown**: Break down large goals into smaller, manageable steps using AI assistance
- **Calendar Integration**: Visualize tasks alongside existing calendar commitments
- **Check-in System**: Regular reminders to help maintain focus and momentum
- **Energy Tracking**: Log and track energy levels to optimize task scheduling
- **ADHD-Friendly Design**: Simple, intuitive interface designed for individuals with ADHD

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **State Management**: Zustand with persistence
- **AI Integration**: OpenAI API for task breakdown
- **Calendar**: Google Calendar API integration
- **Styling**: Tailwind CSS

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn
- OpenAI API key (for AI task breakdown feature)
- Google API credentials (for calendar integration)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/neurospark.git
   cd neurospark
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   NEXTAUTH_SECRET=some_random_string_for_security
   NEXTAUTH_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/src/app`: Next.js app router pages
- `/src/components`: React components organized by feature
- `/src/services`: Service modules for API integrations
- `/src/store`: Zustand store for state management
- `/src/types`: TypeScript type definitions
- `/src/utils`: Utility functions

## Future Plans

- iOS app integration
- Community features and buddy system
- Advanced analytics for energy patterns
- Gamification and rewards system
- Expanded AI coaching capabilities

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- This project was created to address the specific needs of individuals with ADHD
- Thanks to the ADHD coaching community for insights on effective strategies
