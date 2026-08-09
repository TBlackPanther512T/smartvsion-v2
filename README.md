# SmartVision v2

A Vite + React application that uses the Gemini API to power the SmartVision experience.

## Run locally

### Prerequisites
- Node.js 18+

### Steps
1. Install dependencies:
   `npm install`
2. Create a local environment file named `.env.local` and set your Gemini API key:
   `GEMINI_API_KEY=your_api_key_here`
3. Start the app:
   `npm run dev`

The app will be available at `http://localhost:3000/`.

## Deploy to GitHub Pages

This project is configured to deploy automatically to GitHub Pages through GitHub Actions.

### What was added
- GitHub Actions workflow for automatic build and deploy
- Production base path configuration for the repository name

## Project structure
- `src/` and app entry files for the React UI
- `services/` for API integration
- `components/` for reusable UI components
