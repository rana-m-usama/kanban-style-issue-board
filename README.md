# Kanban Style Issue Board

A React + TypeScript kanban board application for managing issues with drag-and-drop functionality, priority sorting, and role-based access control.

## Features

- **Drag & Drop**: Move issues between Backlog, In Progress, and Done columns
- **Optimistic Updates**: Instant UI feedback with undo capability (5-second window)
- **Search & Filter**: Real-time search by title/tags, filter by assignee and severity
- **Recently Accessed**: Sidebar tracking last 5 visited issues (stored in localStorage)
- **Role-Based Permissions**: Admin users can modify issues, contributors have read-only access
- **Real-Time Polling**: Auto-refresh every 10 seconds with last sync time display
- **Issue Detail Page**: View full issue information with "Mark as Resolved" action

## Tech Stack

- **React 19** + **TypeScript** 
- **Vite** for build tooling
- **Zustand** for state management
- **@dnd-kit** for drag-and-drop
- **React Router** for routing
- **SCSS Modules** for styling

## Getting Started

### Prerequisites

- **Node.js**: Version 24.11.1 or higher (specified in `.nvmrc`)
- **pnpm**: Package manager

### Installation

1. Install pnpm (if not already installed):
   ```bash
   npm install -g pnpm
   ```

2. Use the correct Node version (if using nvm):
   ```bash
   nvm use
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

4. Start development server:
   ```bash
   pnpm dev
   ```

5. Open your browser at `http://localhost:5173`

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build
- `pnpm lint` - Run ESLint
- `pnpm test` - Run test suite
- `pnpm test:ui` - Run tests with UI
- `pnpm test:coverage` - Run tests with coverage report

## Production Build

### Building for Production

To create an optimized production build:

```bash
pnpm build
```

This command:
- Compiles TypeScript to JavaScript
- Bundles and minifies all assets
- Optimizes CSS and removes unused styles
- Generates source maps for debugging
- Creates a `dist/` directory with production-ready files

### Build Output

The production build generates:
- `dist/index.html` - Main HTML file
- `dist/assets/` - Bundled and hashed JS/CSS files
- Optimized for performance with code splitting and tree shaking

### Preview Production Build Locally

To test the production build on your local machine:

```bash
pnpm preview
```

This starts a local server serving the production build at `http://localhost:4173`

### Deployment

The `dist/` directory can be deployed to any static hosting service:

- **Vercel**: `vercel deploy`
- **Netlify**: Drag and drop the `dist/` folder or use Netlify CLI
- **GitHub Pages**: Push the `dist/` folder to `gh-pages` branch
- **AWS S3**: Upload the `dist/` folder to an S3 bucket configured for static hosting
- **nginx/Apache**: Serve the `dist/` directory as the web root

**Important**: Ensure your hosting service is configured to handle client-side routing by redirecting all routes to `index.html`.

## Testing

This project uses **Vitest** and **React Testing Library** for comprehensive component testing.

### Test Coverage

The test suite includes:

- **Common Components**: Button, Badge, Input, Select, Toast
- **Board Components**: Board, Column, IssueCard
- **Layout Components**: Layout, Navigation

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with UI interface
pnpm test:ui

# Generate coverage report
pnpm test:coverage
```

### Test Structure

- Unit tests for component rendering and user interactions
- Integration tests for complex component behavior
- Mocked dependencies (@dnd-kit, stores, hooks, router)
- Accessibility testing with semantic queries

## Configuration

- `.nvmrc` - Node.js version specification
- `.npmrc` - pnpm configuration with strict engine enforcement
- `pnpm-workspace.yaml` - Workspace configuration
