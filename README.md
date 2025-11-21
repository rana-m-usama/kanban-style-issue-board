# Kanban Style Issue Board

A React + TypeScript kanban board application for managing issues with drag-and-drop functionality, priority sorting, and role-based access control.

## Features

- **Drag & Drop**: Move issues between Backlog, In Progress, and Done columns
- **Optimistic Updates**: Instant UI feedback with undo capability (5-second window)
- **Smart Sorting**: Issues automatically sorted by priority score (severity × 10 + days since creation × -1 + user rank)
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

## Code Quality Improvements

Recent refactoring included:

- ✅ Eliminated badge variant logic duplication across components
- ✅ Fixed filter dropdown bug (now shows all assignees/severities, not just filtered ones)
- ✅ Removed duplicate status label mappings
- ✅ Added proper async persistence for drag & drop operations with error handling
- ✅ Improved code maintainability and reduced ~60 lines of redundant code

## Configuration

- `.nvmrc` - Node.js version specification
- `.npmrc` - pnpm configuration with strict engine enforcement
- `pnpm-workspace.yaml` - Workspace configuration
