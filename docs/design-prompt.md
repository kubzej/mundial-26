# Claude Design Prompt – Mundial 26

Design a mobile-first PWA for tracking the FIFA World Cup 2026. The app is personal (single user), used almost exclusively on a phone. It should feel modern, minimal, and data-dense — prioritizing scanability and quick access to match info.

## Core specs

- **Platform:** Mobile PWA (iPhone-sized viewport, 390×844 as base)
- **Theme:** Dark mode by default (deep navy/slate background `#0f172a`, cards `#1e293b`, accent green `#22c55e`)
- **Typography:** System font stack, clean and compact
- **Navigation:** Fixed bottom tab bar with 5 tabs: Live, Program, Skupiny (Groups), Bracket, Stats
- **Language:** Czech (UI labels in Czech)
- **Style:** Minimal, no decorative elements. Clean cards, subtle borders, tight spacing. Data-first — inspired by apps like FotMob, OneFootball, or Apple Sports.

---

## Screens to design

### 1. Live / Dnes (Home – default tab)

The landing screen. Shows what's happening right now and today.

**Sections:**

- **Live now** – card(s) for currently playing matches with: team logos, names, live score, match minute, key events (goal scorers with minute)
- **Today's matches** – list of upcoming matches today: time, team logos + names, venue
- If no live matches, show today's upcoming first and yesterday's results below

**Interactions:** Tap match → Match Detail

---

### 2. Program (Schedule)

All 104 matches of the tournament.

**Layout:**

- Horizontal date pills at top (scrollable, today highlighted)
- Below: list of matches for selected day grouped by time
- Each match card: time, team flags + names, score (if played), status badge (Live / FT / upcoming)
- Filter chip for round (Group Stage 1/2/3, Round of 32, R16, QF, SF, Final)

**Interactions:** Tap match → Match Detail

---

### 3. Skupiny (Groups)

All 12 group tables (A through L).

**Layout:**

- Tabs or horizontal scroll for group selection (A–L)
- Classic standings table: position, team flag + name, P, W, D, L, GF, GA, GD, Pts
- Top 2 rows highlighted (green = qualified), 3rd row highlighted differently (potential qualifier)
- Compact but readable on mobile

**Interactions:** Tap team → Team Detail

---

### 4. Bracket (Knockout stage)

Visual bracket for Round of 32 → R16 → QF → SF → Final.

**Layout:**

- Horizontal scrollable bracket (tournament tree)
- Each matchup: two team flags + names + score (or TBD)
- Rounds as vertical columns, connected with lines
- Current/next round highlighted

**Interactions:** Tap match → Match Detail

---

### 5. Stats (Statistics)

Top performers across the tournament.

**Layout:**

- Segmented control: Goals / Assists / Yellow Cards / Red Cards
- Ranked list: position number, player photo, name, team flag, stat count
- Top 3 emphasized visually

**Interactions:** Tap player → Player Detail

---

### 6. Match Detail (sub-page, no tab)

Full match info.

**Sections (scrollable):**

- Header: team logos, names, score (large), match status/minute, venue + date
- **Events timeline:** goals, cards, substitutions with minute + player name, visually on left/right by team
- **Lineups:** formation display or simple list, with shirt numbers
- **Stats:** horizontal bar comparisons (possession, shots, corners, fouls, etc.)
- **Player ratings:** list of players with 0–10 rating badge
- **Pre-match (before kickoff):** show Predictions (win probabilities) and H2H record instead

---

### 7. Team Detail (sub-page, no tab)

Accessed from Groups or match pages.

**Sections:**

- Header: large team logo, name, group, coach name + photo
- **Squad:** list of players grouped by position (GK, DEF, MID, FWD) – name, number, age
- **Matches:** team's matches in the tournament (results + upcoming)
- **Stats:** team-level stats summary (goals scored, conceded, possession avg)

---

### 8. Player Detail (sub-page, no tab)

Accessed from Stats or lineups.

**Sections:**

- Header: player photo, name, team flag, position, age, height
- **Tournament stats:** goals, assists, yellow/red cards, matches played, minutes, average rating
- **Match-by-match:** list of matches with individual rating and key contributions

---

## Design system notes

- Cards: rounded corners (8–12px), subtle border (`#334155`), no heavy shadows
- Spacing: tight but breathable (12–16px padding)
- Team logos/flags: 24–32px in lists, 48–64px in headers
- Active tab in bottom nav: green accent color
- Status badges: green for live, muted for FT, subtle for upcoming
- Numbers and scores: bold monospace feel for quick scanning
- Pull-to-refresh pattern on main lists
- Safe area padding for bottom nav and notch

---

## Don't include

- No onboarding, login, or settings screens
- No ads or promo banners
- No video or news content
- No light mode variant needed (dark only)
