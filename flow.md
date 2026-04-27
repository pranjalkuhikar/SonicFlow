# SonicFlow Application Flows

This document details the key operational flows within the SonicFlow microservices ecosystem using Mermaid sequence diagrams.

## 1. User Registration & Onboarding Flow
This flow illustrates the asynchronous notification process triggered upon user registration.

```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant Web as Web Frontend
    participant Auth as Auth Service
    participant MQ as RabbitMQ
    participant Notif as Notification Service
    participant Email as Email Service (Nodemailer)

    User->>Web: Submits Registration Form
    Web->>Auth: POST /api/user/register
    Auth->>Auth: Hash Password & Save User
    Auth->>MQ: Publish 'User Created' Event
    Auth-->>Web: 201 Created
    Web-->>User: Show Success Message

    MQ->>Notif: Consume 'User Created' Event
    Notif->>Notif: Generate Email Template
    Notif->>Email: Send Welcome Email
    Email-->>User: Inbox: Welcome to SonicFlow!
```

---

## 2. Authentication & Session Flow
SonicFlow uses JWTs stored in `httpOnly` cookies for secure session management.

```mermaid
sequenceDiagram
    participant User as User (Browser)
    participant Web as Web Frontend
    participant Auth as Auth Service

    User->>Web: Submits Login Credentials
    Web->>Auth: POST /api/user/login
    Auth->>Auth: Verify Credentials
    Auth->>Auth: Sign JWT Token
    Auth-->>Web: Set-Cookie: token (httpOnly)
    Web-->>User: Redirect to Dashboard
    
    Note over Web, Auth: Subsequent Requests
    Web->>Auth: GET /api/user/profile (Cookie included)
    Auth->>Auth: Verify JWT Middleware
    Auth-->>Web: 200 OK (User Profile Data)
```

---

## 3. Artist Song Upload Flow
How artists contribute music to the platform.

```mermaid
sequenceDiagram
    participant Artist as Artist (Browser)
    participant Web as Web Frontend
    participant Music as Music Service
    participant IK as ImageKit CDN
    participant DB as Music DB (MongoDB)

    Artist->>Web: Selects Audio & Cover Art
    Web->>Music: POST /api/song/addSong (Multipart)
    Music->>IK: Upload Audio File
    IK-->>Music: Return audioUrl
    Music->>IK: Upload Cover Image
    IK-->>Music: Return coverUrl
    Music->>DB: Save Song (URLs + Metadata)
    DB-->>Music: Success
    Music-->>Web: 201 Created
    Web-->>Artist: Song Published!
```

---

## 4. Playlist Management Flow
Interaction for adding songs to a user or artist playlist.

```mermaid
sequenceDiagram
    participant User as User/Artist
    participant Web as Web Frontend
    participant Music as Music Service
    participant DB as Music DB

    User->>Web: Searches for Song
    Web->>Music: GET /api/song/search?query=...
    Music-->>Web: Search Results
    User->>Web: Clicks 'Add to Playlist'
    Web->>Music: POST /api/song/addSongToPlaylist/:id
    Music->>DB: Update Playlist (Push songId)
    DB-->>Music: Updated
    Music-->>Web: 200 OK
    Web-->>User: Playlist Updated
```
