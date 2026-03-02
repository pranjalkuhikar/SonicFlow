# SonicFlow - Frontend Flow Documentation

Got it—you want to think in terms of screen-by-screen flow and behavior on the frontend first, then later map that to backend/microservices.

I'll describe the functionality in order a user (and an admin/artist) experiences it.

## Auth Flow: Register → Login → Home

### 1. Register Page (Signup)

- **Route:** `/register`
- **Fields:** name, email, password, confirm password (optionally role: user / artist)
- **On submit:**
  - Frontend validates (empty fields, password length, passwords match)
  - Sends request to backend `POST /api/auth/register`
  - **On success:**
    - Show success toast: "Account created successfully"
    - Redirect to Login page automatically (`/login`)

### 2. Login Page

- **Route:** `/login`
- **Fields:** email, password
- **On submit:**
  - Frontend validates
  - Sends `POST /api/auth/login`
  - **On success:**
    - Save token/user info in global state (e.g., context/Redux/Zustand)
    - Optionally save JWT in httpOnly cookie (handled by backend)
    - Redirect to Home page (`/` or `/home`)
  - **On failure:**
    - Show error: "Invalid email or password"

### 3. Protected Routes

- If user tries to open `/home`, `/library`, `/profile`, etc. without being logged in:
  - Frontend checks auth state
  - If not authenticated → redirect to `/login`

## Home Page (All Music, Main Player Experience)

- **Route:** `/` or `/home`
- When user lands here after login, frontend:
  - Calls backend: `GET /api/tracks` (and maybe `GET /api/playlists/recommended`)
  - Shows different sections:
    - "All Songs" or "Trending" list/grid
    - Maybe "Recently Played" and "Made for You"

### Typical behavior on Home:

- **Clicking a song card/row:**
  - Sets `currentTrack` in global state
  - Starts playback using bottom player (HTML `<audio>`)

- **Search bar:**
  - User types song/artist/album
  - Frontend calls `GET /api/search?query=...` and shows results

- **Sidebar navigation:**
  - Home: main list of songs
  - Library: user's playlists, liked songs
  - Upload: only for admin/artist
  - Profile: user profile settings

The bottom sticky player is visible on all "app" pages after login (Home, Library, Playlist detail, etc.), sharing state across the whole frontend.

## Roles: Normal User vs Admin/Artist

### Normal User:

- Can browse and play all public songs
- Can create playlists, add/remove songs from playlists
- Can like/favorite songs

### Admin/Artist:

- All user capabilities, plus:
- Access to Admin/Artist Dashboard
- Can upload new songs (title, artist name, album, genre, audio file, cover image)
- Can edit/delete their own songs (or all songs, if super admin)

### Frontend role-based behavior:

- After login, backend returns `role: "user"` or `role: "admin"`/`"artist"`
- **If `role === "admin"`:**
  - Show extra sidebar item: "Admin / Artist Dashboard"
  - Allow access to `/admin` routes
- **If `role === "user"`:**
  - Hide admin menu items
  - If user tries to go to `/admin`, redirect to Home or show 403

## Admin/Artist Flows (Frontend)

### a) Admin/Artist Dashboard

- **Route:** `/admin`
- When admin/artist opens this:
  - Frontend calls `GET /api/admin/tracks/my` (or `GET /api/admin/tracks`)
  - Shows table or card list with columns: Cover, Title, Artist, Plays, Status (published/draft), Actions (Edit/Delete)

#### Main actions:

**1. Upload new music**

- Button: "Upload Track" → route `/admin/upload`
- Form fields:
  - Title
  - Artist (pre-filled with artist profile, editable if needed)
  - Album
  - Genre
  - File upload (audio)
  - Cover image upload
  - Optional: isPublic (toggle)
- On submit:
  - Frontend sends to `POST /api/admin/tracks` with `FormData`
  - On success: go back to Admin Dashboard and show new track in list

**2. Edit existing track**

- On track row/card: "Edit" button → `/admin/tracks/:id/edit`
- Form same as upload but pre-populated
- On submit:
  - `PUT`/`PATCH` to `/api/admin/tracks/:id`
  - Update list locally or refetch

**3. Delete track**

- "Delete" → confirm modal
- On confirm: `DELETE /api/admin/tracks/:id`
- Remove from list on success

### b) Artist Profile

Optional but nice to have:

- **Route:** `/artist/:id`
- Shows:
  - Artist name, photo, bio
  - List of all tracks by this artist
- Clicking artist name from songs on Home may navigate here

## Other User-Facing Screens

To make the app feel complete, include these pages:

### 1. Library Page (`/library`)

- Lists:
  - User's own playlists
  - Liked songs
- Clicking a playlist opens Playlist Detail

### 2. Playlist Detail Page (`/playlists/:id`)

- Shows playlist cover/name, description, owner
- List of tracks
- "Play" button to play all
- Options to remove track from playlist, etc.

### 3. Profile/Settings Page (`/profile`)

- User info (name, email, avatar)
- Change password (via backend)
- Logout button

## Step-by-Step Functional Build Order (Frontend-First)

Build features in this order for a smooth user experience:

### 1. Auth UI

- Build `/register` → submit → redirect to `/login`
- Build `/login` → submit → store user + token → redirect to `/home`
- Implement protected routes (if not logged in → redirect to `/login`)

### 2. Home UI

- Layout: sidebar, top bar, content, bottom player
- Fetch and display all songs
- Implement click-to-play in bottom player (`currentTrack` state)

### 3. Role-Based UI

- Receive `role` from login response
- Show/hide admin/artist menu item and routes based on role

### 4. Admin/Artist Dashboard

- `/admin`: list of songs
- `/admin/upload`: upload new track UI
- `/admin/tracks/:id/edit`: edit track UI
- Delete actions

### 5. Library & Playlists

- `/library` page
- Playlist creation modal/form
- Playlist detail pages with playable tracks

### 6. Profile and Misc UX

- `/profile` update info page
- Logout
- Toasts, loading states, error handling

---

# Backend Flow Documentation

Your backend will use **HTTP for core flows** and **RabbitMQ events (with acks)** for all cross-service side effects.

## 1. Architecture Overview

You will have multiple Node/Express microservices, each as its own project:

- **API Gateway (Web/BFF)** – Single entry point for frontend
- **Auth Service** – User registration, login, JWT management
- **Music Service** – Tracks, artists, albums, likes
- **Playlist Service** – User playlists and playlist management
- **Streaming Service** – Audio streaming and play events
- **Notification + Analytics Service** – Email, notifications, analytics

All services are exposed to the frontend **only via the API Gateway**. Internal communication uses:

- **HTTP** for direct, synchronous needs
- **RabbitMQ (AMQP)** for async publish/consume events with acknowledgements

### Service Structure

Each service has:

```
service-name/
├── src/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── configs/
│   ├── db/
│   ├── app.js
│   └── server.js
├── .env
├── package.json
├── Dockerfile
└── README.md
```

Each service has its own MongoDB database (or separate collections in a shared cluster).

---

## 2. API Gateway (Web / BFF)

**Purpose:** Single entry point for the React frontend.

**Public URL:** `/api/...`

### Responsibilities:

- Verify JWT on protected routes
- Attach `userId`, `role` to proxied requests
- Route mapping:
  - `/api/auth/*` → Auth Service
  - `/api/tracks/*`, `/api/library/*` → Music Service
  - `/api/playlists/*` → Playlist Service
  - `/api/stream/*` → Streaming Service
- Error normalization, rate limiting, CORS

**Note:** No RabbitMQ here. Only HTTP in/out.

---

## 3. Auth Service

**Purpose:** Sign up, login, roles (user/artist/admin), user identity.

### Sync (HTTP)

#### `POST /auth/register`

- Create user in `users` collection
- Hash password (bcrypt)
- Role default: `user`; option for `artist`/`admin`
- Response: `{ token, user: { id, name, email, role } }`

#### `POST /auth/login`

- Validate credentials
- Return `{ token, user: { id, name, email, role } }`

#### `GET /auth/me`

- Return current user based on JWT

#### `GET /auth/verify` (Internal)

- Gateway uses to validate tokens

### Async (RabbitMQ)

#### On successful registration:

- **Event:** `user.created`
- **Exchange:** `user.exchange`
- **Routing Key:** `user.created`
- **Payload:**
  ```json
  {
    "userId": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "createdAt": "2026-03-02T10:00:00Z"
  }
  ```

#### Queues & Acks:

- Queue: `user.created.queue` (bound to `user.exchange`)
- Consumer: Notification/Analytics service
- Action: Send welcome email, log event
- After processing: **Send ack** to remove message from queue

---

## 4. Music Service

**Purpose:** All music data: tracks, artists, albums, likes. Powers Home + Library.

### Data Model (MongoDB)

```
tracks: {
  _id: ObjectId,
  title: String,
  artistId: ObjectId,
  albumId: ObjectId,
  duration: Number (seconds),
  audioUrl: String,
  coverUrl: String,
  ownerId: ObjectId,
  isPublic: Boolean,
  createdAt: Date
}

artists: {
  _id: ObjectId,
  name: String,
  bio: String,
  avatarUrl: String
}

albums: {
  _id: ObjectId,
  title: String,
  artistId: ObjectId,
  coverUrl: String,
  year: Number
}

likes: {
  _id: ObjectId,
  userId: ObjectId,
  trackId: ObjectId,
  createdAt: Date
}
```

### Sync (HTTP)

#### For Users:

- `GET /tracks` – Search, paginate; used on Home page
- `GET /tracks/:id` – Get track details
- `GET /me/likes` – For Library "Liked Songs"
- `POST /tracks/:id/like` – Like a track
- `DELETE /tracks/:id/like` – Unlike a track

#### For Artists/Admins:

- `POST /tracks` – Upload new track (only `role = artist/admin`)
- `GET /me/tracks` – Get user's uploaded tracks
- `PATCH /tracks/:id` – Edit track metadata
- `DELETE /tracks/:id` – Delete track (only owner or admin)

### Async (RabbitMQ)

#### After track is created:

- **Event:** `track.uploaded`
- **Exchange:** `track.exchange`
- **Routing Key:** `track.uploaded`
- **Payload:**
  ```json
  {
    "trackId": "track_id",
    "artistId": "artist_id",
    "title": "Song Title",
    "audioUrl": "https://...",
    "coverUrl": "https://...",
    "uploadedAt": "2026-03-02T10:00:00Z"
  }
  ```

#### After user likes/unlikes:

- **Event:** `track.liked` or `track.unliked`
- **Exchange:** `track.exchange`
- **Payload:**
  ```json
  {
    "userId": "user_id",
    "trackId": "track_id",
    "likedAt": "2026-03-02T10:00:00Z"
  }
  ```

#### Consumers & Acks:

- Queues:
  - `track.uploaded.queue`
  - `track.liked.queue`
  - `track.unliked.queue`
- Consumer: Notification/Analytics service
- Action: Update stats, notify followers, increment like counters
- After success: **Send ack** (message removed from queue)
- On failure: Don't ack or `nack` with requeue (message stays in queue for retry)

---

## 5. Playlist Service

**Purpose:** Manage playlists as named collections of tracks.

### Data Model (MongoDB)

```
playlists: {
  _id: ObjectId,
  name: String,
  description: String,
  ownerId: ObjectId,
  isPublic: Boolean,
  coverUrl: String,
  createdAt: Date,
  updatedAt: Date
}

playlistTracks: {
  _id: ObjectId,
  playlistId: ObjectId,
  trackId: ObjectId,
  order: Number,
  addedAt: Date
}
```

### Sync (HTTP)

#### Library & Playlist Flows:

- `GET /me/playlists` – Library "Playlists" section
- `GET /playlists/:id` – Playlist metadata (name, owner, description)
- `GET /playlists/:id/tracks` – Returns track IDs and basic info

#### Management:

- `POST /playlists` – Create new playlist
- `PATCH /playlists/:id` – Update playlist (name, description, cover)
- `DELETE /playlists/:id` – Delete playlist
- `POST /playlists/:id/tracks` – Add track to playlist (body: `{ trackId }`)
- `DELETE /playlists/:id/tracks/:trackId` – Remove track from playlist

**Note:** Gateway uses this service + Music service to build full playlist details for frontend.

### Async (RabbitMQ)

#### On certain actions:

- **Event:** `playlist.created`
- **Payload:**

  ```json
  {
    "playlistId": "playlist_id",
    "userId": "user_id",
    "name": "My Playlist",
    "createdAt": "2026-03-02T10:00:00Z"
  }
  ```

- **Event:** `playlist.trackAdded`
- **Payload:**
  ```json
  {
    "playlistId": "playlist_id",
    "userId": "user_id",
    "trackId": "track_id",
    "addedAt": "2026-03-02T10:00:00Z"
  }
  ```

#### Consumers & Acks:

- Queues:
  - `playlist.created.queue`
  - `playlist.trackAdded.queue`
- Consumer: Notification/Analytics service
- Action: Update stats, social notifications
- After success: **Send ack**
- On failure: Don't ack or `nack` with requeue

---

## 6. Streaming Service

**Purpose:** Serve audio bytes for playback and emit play events.

### Sync (HTTP)

#### `GET /stream/:trackId`

- Used as `<audio src="/api/stream/:trackId">`
- Validates user via JWT (gateway forwards)
- Internally requests track metadata from Music Service (to get `audioUrl` and permission info)
- Streams file with HTTP Range support for seeking

### Async (RabbitMQ)

#### On every successful play:

- **Event:** `track.played`
- **Exchange:** `track.exchange`
- **Routing Key:** `track.played`
- **Payload:**
  ```json
  {
    "trackId": "track_id",
    "userId": "user_id",
    "playedAt": "2026-03-02T10:00:00Z"
  }
  ```

#### Consumers & Acks:

- Queue: `track.played.queue`
- Consumer: Analytics service
- Action: Increment play count, update leaderboards, recompute popularity
- After success: **Send ack** (message removed from queue)
- On failure: Don't ack (message remains for retry)

---

## 7. Notification + Analytics Service

**Purpose:**

- React to events from other services
- Send notifications (emails/in-app)
- Maintain analytics (plays, likes, uploads, signups)

### Sync (HTTP)

Optional endpoints:

- `GET /stats/overview` – Admin-only, view analytics
- `GET /me/notifications` – In-app notifications for user

### Async (RabbitMQ) – Consumer Roles

This service consumes from multiple queues:

#### `user.created.queue`

- **On receive:**
  - Send welcome email / in-app notification
  - Log new user
  - **Ack** when done

#### `track.uploaded.queue`

- **On receive:**
  - Update per-artist upload stats
  - Optional: send notifications to followers
  - **Ack**

#### `track.played.queue`

- **On receive:**
  - Increment play counters
  - Recompute popularity metrics
  - **Ack**

#### `track.liked.queue` / `track.unliked.queue`

- **On receive:**
  - Update like counters per track/user
  - **Ack**

#### `playlist.created.queue` / `playlist.trackAdded.queue`

- **On receive:**
  - Update playlist/engagement stats
  - **Ack**

### Message Handling:

- **If processing succeeds:** Send `channel.ack(msg)` → message removed from queue
- **If processing fails:** Don't ack or send `channel.nack(msg, false, true)` with requeue → message stays in queue for later retry

---

## 8. RabbitMQ Design: Exchanges, Queues, Acks

You will have the following structure:

### Exchanges & Queues:

#### `user.exchange`

```
Queue: user.created.queue
Routing Key: user.created
Binding: user.exchange -> user.created.queue
```

#### `track.exchange`

```
Queue: track.uploaded.queue
Routing Key: track.uploaded

Queue: track.played.queue
Routing Key: track.played

Queue: track.liked.queue
Routing Key: track.liked

Queue: track.unliked.queue
Routing Key: track.unliked
```

#### `playlist.exchange`

```
Queue: playlist.created.queue
Routing Key: playlist.created

Queue: playlist.trackAdded.queue
Routing Key: playlist.trackAdded
```

### Publisher Pattern (in each service):

1. Perform the main action via HTTP and database
2. On success, publish event to the appropriate exchange
3. Example (Music Service):
   ```javascript
   // After saving track to DB
   await amqpChannel.publish(
     "track.exchange",
     "track.uploaded",
     Buffer.from(
       JSON.stringify({
         trackId: track._id,
         artistId: track.artistId,
         title: track.title,
         audioUrl: track.audioUrl,
         uploadedAt: new Date(),
       }),
     ),
   );
   ```

### Consumer Pattern (in Notification/Analytics Service):

1. Connect to RabbitMQ
2. Subscribe to queues with `noAck: false` (manual ack mode)
3. For each message:
   - Parse payload
   - Do work (send email, update stats, etc.)
   - On success → `channel.ack(msg)` (removes message)
   - On failure → don't ack or `channel.nack(msg, false, true)` (requeue)

Example:

```javascript
amqpChannel.consume("user.created.queue", async (msg) => {
  try {
    const event = JSON.parse(msg.content.toString());
    // Send welcome email
    await sendWelcomeEmail(event.email);
    // Log event
    await logAnalytics("user_signup", event.userId);
    // Acknowledge
    amqpChannel.ack(msg);
  } catch (error) {
    console.error("Failed to process user.created event:", error);
    // Don't ack - message stays in queue for retry
  }
});
```

---

## 9. Synchronous vs Asynchronous in Your App

### Synchronous (HTTP – immediate response via Gateway):

- Register, login, get profile
- Browse tracks, search, view track details
- Like/unlike a track (like count updated instantly in DB)
- Create/edit/delete playlist
- Add/remove tracks from playlist
- Request stream for a track (`GET /stream/:trackId`)

### Asynchronous (AMQP events – background processing):

- After user registered → `user.created` (welcome email, stats logged)
- After track uploaded → `track.uploaded` (processing, notifications, indexing)
- After track played → `track.played` (analytics, play count increment)
- After track liked/unliked → `track.liked` / `track.unliked` (engagement analytics)
- After playlist created / track added → `playlist.created` / `playlist.trackAdded` (stats, social features)

This separation keeps your core UX **fast and reliable**, while still using microservices and AMQP correctly for backend side effects.

---

## 10. Complete Frontend-to-Backend Flow Example

### User Registration Flow:

1. **Frontend:** User fills register form and clicks "Sign Up"
2. **Gateway:** `POST /api/auth/register` → routes to Auth Service
3. **Auth Service (Sync):**
   - Validates input
   - Hashes password
   - Saves user to `users` collection
   - **Publishes:** `user.created` event to `user.exchange`
   - Returns: `{ token, user: { id, name, email, role } }`
4. **Frontend:** Receives response, saves token, shows "Account created" toast, redirects to `/login`
5. **Notification Service (Async):**
   - Receives `user.created` event from queue
   - Sends welcome email
   - Logs user signup in analytics DB
   - **Acks message** (removed from queue)

### User Playing a Track Flow:

1. **Frontend:** User clicks on a track in Home
2. **Gateway:** `GET /api/stream/:trackId` → routes to Streaming Service
3. **Streaming Service (Sync):**
   - Validates JWT
   - Gets track metadata from Music Service
   - Streams audio file
   - **Publishes:** `track.played` event to `track.exchange`
   - Returns: audio stream
4. **Frontend:** Receives audio stream, plays it in `<audio>` element
5. **Analytics Service (Async):**
   - Receives `track.played` event from queue
   - Increments play count in `tracks` collection
   - Updates user's "Recently Played" list
   - Recomputes popularity metrics
   - **Acks message** (removed from queue)

---

## 11. Deployment & Environment Variables

Each service will need:

```
# .env template
NODE_ENV=development
PORT=5001

# Database
MONGODB_URI=mongodb://...

# JWT
JWT_SECRET=your_jwt_secret_key

# RabbitMQ
RABBITMQ_URL=amqp://user:pass@hostname:5672

# Services (for direct HTTP calls)
AUTH_SERVICE_URL=http://auth-service:5001
MUSIC_SERVICE_URL=http://music-service:5002
PLAYLIST_SERVICE_URL=http://playlist-service:5003
STREAMING_SERVICE_URL=http://streaming-service:5004
NOTIFICATION_SERVICE_URL=http://notification-service:5005

# Email (for Notification Service)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

---

This is your **final backend plan**: services, responsibilities, HTTP APIs, RabbitMQ events, queue/ack behavior, and how everything ties to the frontend flows you already designed.
