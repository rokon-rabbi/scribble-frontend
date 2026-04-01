# Scribble Clone — Frontend

A real-time multiplayer drawing-and-guessing game built with Next.js. One player draws on an HTML5 Canvas while others guess the word in real-time chat.

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS 4 + CSS variables |
| State | Zustand (auth, game, canvas, chat stores) |
| Real-time | @stomp/stompjs + SockJS (WebSocket) |
| HTTP | Axios (JWT interceptors) |
| Canvas | Native HTML5 Canvas API (dual-layer) |
| Animations | Framer Motion |
| Icons | Lucide React |
| Fonts | Fredoka (headings), Nunito (body), JetBrains Mono (monospace) |
| Toasts | Sonner |
| Sound | Howler.js |

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Backend API running at `http://localhost:8080` (see `../backend/`)

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create `.env.local` (already included):

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_WS_URL=http://localhost:8080/ws
```

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (fonts, providers, Toaster)
│   ├── page.tsx                  # Landing page (animated hero)
│   ├── globals.css               # CSS variables, Tailwind, animations
│   ├── (auth)/login/page.tsx     # Login page
│   ├── (auth)/register/page.tsx  # Register page
│   ├── lobby/page.tsx            # Room browser + create/join
│   ├── room/[roomCode]/
│   │   ├── layout.tsx            # WebSocket provider wrapper
│   │   └── page.tsx              # Game room (waiting/playing/finished)
│   └── leaderboard/page.tsx      # Global leaderboard
├── components/
│   ├── ui/                       # Reusable primitives
│   │   ├── Button.tsx            # 4 variants, 3 sizes, loading state
│   │   ├── Input.tsx             # Label, error, icon prefix
│   │   ├── Card.tsx              # Shadow, padding, rounded
│   │   ├── Avatar.tsx            # Image or initials fallback
│   │   ├── Badge.tsx             # Status indicators
│   │   ├── Spinner.tsx           # Loading spinner
│   │   ├── Timer.tsx             # Colored countdown display
│   │   └── Modal.tsx             # Framer Motion overlay
│   ├── layout/Navbar.tsx         # Auth-aware nav + mute toggle
│   ├── auth/                     # LoginForm, RegisterForm
│   ├── lobby/                    # CreateRoomModal, JoinRoomForm, RoomCard
│   ├── game/                     # Core game components
│   │   ├── Canvas.tsx            # Dual-layer drawing canvas
│   │   ├── ToolBar.tsx           # Brush/eraser/fill, colors, sizes, undo
│   │   ├── ChatBox.tsx           # Messages + guess input
│   │   ├── PlayerList.tsx        # Sidebar with scores & status
│   │   ├── PlayerCard.tsx        # Individual player row
│   │   ├── GameTimer.tsx         # SVG circular countdown
│   │   ├── WordHint.tsx          # Underscore/letter display
│   │   ├── WordPicker.tsx        # 3-word choice modal (drawer)
│   │   ├── DrawerBadge.tsx       # "You are drawing!" indicator
│   │   ├── RoundScoreboard.tsx   # Between-round score overlay
│   │   ├── FinalLeaderboard.tsx  # End-game podium + confetti
│   │   └── CorrectGuessEffect.tsx # CSS confetti particles
│   └── leaderboard/
│       └── LeaderboardTable.tsx  # Paginated player rankings
├── stores/                       # Zustand stores
│   ├── useAuthStore.ts           # User, token, persist to localStorage
│   ├── useGameStore.ts           # Room, players, rounds, scores
│   ├── useCanvasStore.ts         # Tool, color, brush size, strokes
│   └── useChatStore.ts           # Chat messages (200 max)
├── hooks/
│   ├── useWebSocket.ts           # STOMP subscriptions + send functions
│   ├── useCanvas.ts              # Drawing logic (stroke, undo, redraw)
│   ├── useTimer.ts               # Local timer interpolation
│   ├── useAuth.ts                # Auth guard (redirect if not logged in)
│   └── useSound.ts               # Howler.js wrapper + mute store
├── lib/
│   ├── api.ts                    # Axios instance + JWT + auth/player/game APIs
│   ├── stomp.ts                  # STOMP client factory
│   ├── types.ts                  # All TypeScript interfaces
│   ├── constants.ts              # URLs, colors, sizes, game defaults
│   └── utils.ts                  # cn() helper (clsx + tailwind-merge)
└── providers/
    ├── AuthProvider.tsx           # Zustand hydration gate
    └── WebSocketProvider.tsx      # WebSocket context for game rooms
```

## Game Flow

1. **Register/Login** — JWT stored in localStorage via Zustand persist
2. **Lobby** — Browse public rooms, join by code, or create a new room
3. **Waiting Room** — See players join in real-time, host starts game
4. **Playing** — Drawer picks a word, draws on canvas; guessers type guesses in chat
5. **Round End** — Scores shown, word revealed, next round begins
6. **Game Over** — Podium with top 3, confetti, back to lobby

## Responsive Layouts

| Breakpoint | Layout |
|------------|--------|
| Desktop (lg, 1024px+) | 3-column: Players / Canvas+Toolbar / Chat |
| Tablet (md, 768-1023px) | 2-column: Canvas / Chat, players below |
| Mobile (<768px) | Tabbed: Canvas / Chat / Players |

## Canvas Implementation

- **Dual-layer**: bottom canvas for committed strokes, top canvas for live preview
- **Native resolution**: 800x600, CSS-scaled responsively
- **Smooth lines**: `quadraticCurveTo` interpolation between points
- **Tools**: Brush, Eraser (`destination-out` compositing), Fill (flood-fill algorithm)
- **Touch support**: touch events with `preventDefault` to block scrolling

## Available Scripts

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
```

## Deployment

```bash
npm run build
```

Deploy to Vercel or any Node.js host. Set environment variables:

```
NEXT_PUBLIC_API_URL=https://your-api-domain.com
NEXT_PUBLIC_WS_URL=https://your-api-domain.com/ws
```
