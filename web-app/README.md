# Dilithium Nexus Explorer

The official "Quantum Resistant" Blockchain Explorer for Dilithium Coin.
Built with Next.js 14, Supabase, and a Cyberpunk/Glassmorphism design system.

## Features

- **Real-time Dashboard**: Live updates of blocks and transactions using Supabase Realtime.
- **Smart Search** (`Ctrl+K`): Navigate instantly to blocks, transactions, or addresses.
- **Deep Space Aesthetics**: Custom "Obsidian" theme with glassmorphism UI components.
- **Responsive**: Fully optimized for desktop and mobile.

## Getting Started

### Prerequisites

1.  **Node.js** (v18+)
2.  **Supabase Project** (See root `supabase_schema.sql` for setup)

### Installation

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure Environment:
    Create a `.env.local` file in this directory:
    ```env
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    NODE_URL=http://localhost:3001
    ```

3.  Run the Development Server:
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the explorer.

## Project Structure

- `/app`: App Router pages and layouts.
- `/components`: Reusable UI (`/ui`) and Business Logic (`/blockchain`) components.
- `/lib`: Utilities and Supabase client.
- `/types`: TypeScript definitions.

## Styling

This project uses **Vanilla CSS** with CSS Modules and CSS Variables.
Global styles are defined in `app/globals.css`.
No Tailwind CSS is used, as per specific requirements.
