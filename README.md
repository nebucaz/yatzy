# Yatzy Score Tracker

A single-page application (SPA) for tracking and recording scores for multiple players in the dice game Yatzy. Built with SvelteKit, TypeScript, and Bun.

## Features

- **Multi-Player Support**: Add and manage multiple players with customizable names
- **Score Tracking**: Track scores across all Yatzy categories:
  - Top section: Ones, Twos, Threes, Fours, Fives, Sixes
  - Bonus: Automatic bonus calculation (25 points if top section ≥ 63)
  - Bottom section: One Pair, Two Pairs, Three of a Kind, Four of a Kind, Small Straight, Large Straight, Full House, Chance, Yatzy
- **Player Management**: 
  - Add/remove players dynamically
  - Rename players
  - Drag and drop to reorder player columns
  - Color-coded columns for easy identification
- **Score Entry**:
  - Click cells to enter scores
  - Category-specific value suggestions
  - Skip option for unused categories
  - Clear values if entered by mistake
- **Game History**: 
  - Automatic saving of completed games
  - View past game results
  - Clear history option
- **Rankings**:
  - Current game ranking (shown when game is complete)
  - Overall ranking based on game history (average scores)
- **Localization**: Support for multiple languages:
  - English (en)
  - German (de) - Default
  - Spanish (es)
  - French (fr)
  - Italian (it)
- **Persistent Storage**: All game data stored in browser's local storage
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Framework**: SvelteKit 2.x with Svelte 5
- **Language**: TypeScript
- **Package Manager**: Bun
- **Build Tool**: Vite
- **Deployment**: Static site generation with Nginx (Docker)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (latest version recommended)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd yatzy
```

2. Install dependencies:
```bash
bun install
```

### Development

Start the development server:

```bash
bun run dev
```

The app will be available at `http://localhost:5173`

To open the app automatically in your browser:

```bash
bun run dev -- --open
```

### Building

Create a production build:

```bash
bun run build
```

The built files will be in the `build/` directory.

Preview the production build:

```bash
bun run preview
```

### Type Checking

Run TypeScript and Svelte type checking:

```bash
bun run check
```

Watch mode for type checking:

```bash
bun run check:watch
```

## Deployment

The application is configured as a static site and can be deployed using Docker. See [DOCKER.md](./DOCKER.md) for detailed deployment instructions.

### Quick Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up --build

# The app will be available at http://localhost:8080
```

## Project Structure

```
yatzy/
├── src/
│   ├── lib/
│   │   ├── components/     # Svelte components
│   │   ├── stores/         # Svelte stores (game state, i18n)
│   │   └── utils/          # Utility functions (calculations, storage, translations)
│   └── routes/             # SvelteKit routes
├── agent/                  # Project documentation and plans
├── build/                  # Production build output
├── Dockerfile              # Docker build configuration
├── docker-compose.yml      # Docker Compose configuration
├── nginx.conf              # Nginx configuration for static serving
└── package.json           # Project dependencies and scripts
```

## How to Use

1. **Start a Game**: The app starts with one default player. Click the "+ Add Player" button to add more players.

2. **Enter Scores**: Click on any empty cell in a player's column to open the score entry popup. Select a value or skip the category.

3. **Edit Player Names**: Click on a player's column header to edit their name or remove them.

4. **Reorder Players**: Drag and drop player column headers to reorder them.

5. **Complete Game**: Fill or skip all categories for all players. The "Ranking" button will appear below the scoreboard.

6. **View Rankings**: 
   - Click "Ranking" button to see current game results
   - Use the hamburger menu (☰) to access "Overall Ranking" based on game history

7. **New Game**: Use the hamburger menu to start a new game (saves current game to history) or clear the scoreboard.

## License

[Add your license information here]
