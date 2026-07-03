# Office Monitoring System — API Reference

> **Base URL:** `http://localhost:5000/api/v1`
> **Auth:** All protected routes require a valid session cookie (`accessToken`) obtained from `POST /auth/login`.

---

## Table of Contents

1. [Auth](#auth)
2. [User](#user)
3. [Rooms](#rooms)
4. [Devices](#devices)
5. [Dashboard](#dashboard)
6. [Alerts](#alerts)
7. [Daily Usage](#daily-usage)
8. [Discord Bot](#discord-bot)

---

## Auth

### POST `/auth/login`

Authenticates a user and sets `accessToken` + `refreshToken` cookies.

**Request Body**
```json
{
  "email": "admin@example.com",
  "password": "secret123"
}
```

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Login is successful.",
  "data": {
    "id": "uuid",
    "email": "admin@example.com"
  }
}
```

**Error `404`** — User not found
**Error `401`** — Incorrect password

---

### POST `/auth/logout`

🔒 Protected. Clears session cookies and removes active tokens.

**Request Body** — _none_

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Logout is successful.",
  "data": {
    "message": "Logout is successful"
  }
}
```

---

### GET `/auth/me`

🔒 Protected. Returns the currently authenticated user's profile.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully!",
  "data": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com"
  }
}
```

---

### POST `/auth/change-password`

🔒 Protected. Changes the authenticated user's password.

**Request Body**
```json
{
  "oldPassword": "secret123",
  "newPassword": "newSecret456"
}
```

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Password changed successfully!",
  "data": {
    "message": "Password changed successfully!"
  }
}
```

**Error `401`** — Old password is incorrect

---

## User

### POST `/user`

Creates a new admin user.

**Request Body**
```json
{
  "password": "secret123",
  "admin": {
    "email": "admin@example.com",
    "name": "Admin User"
  }
}
```

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Admin created successfully!",
  "data": {
    "id": "uuid",
    "name": "Admin User",
    "email": "admin@example.com",
    "createdAt": "2026-07-03T15:00:00.000Z",
    "updatedAt": "2026-07-03T15:00:00.000Z"
  }
}
```

---

## Rooms

> All room endpoints are **read-only**. Rooms are managed by the system.

### GET `/rooms`

🔒 Protected. Returns all rooms with device count.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Rooms retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "name": "Drawing Room",
      "type": "COMMON",
      "createdAt": "2026-07-01T10:00:00.000Z",
      "updatedAt": "2026-07-03T14:00:00.000Z",
      "_count": {
        "devices": 3
      }
    },
    {
      "id": "uuid-2",
      "name": "Server Room",
      "type": "RESTRICTED",
      "createdAt": "2026-07-01T10:00:00.000Z",
      "updatedAt": "2026-07-03T14:00:00.000Z",
      "_count": {
        "devices": 5
      }
    }
  ]
}
```

---

### GET `/rooms/:id`

🔒 Protected. Returns a single room by ID with device and alert counts.

**Path Params**
| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | Room UUID   |

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Room retrieved successfully",
  "data": {
    "id": "uuid",
    "name": "Drawing Room",
    "type": "COMMON",
    "createdAt": "2026-07-01T10:00:00.000Z",
    "updatedAt": "2026-07-03T14:00:00.000Z",
    "_count": {
      "devices": 3,
      "alerts": 1
    }
  }
}
```

**Error `404`** — Room not found

---

### GET `/rooms/:id/devices`

🔒 Protected. Returns all devices belonging to a specific room.

**Path Params**
| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | Room UUID   |

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Room devices retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "roomId": "room-uuid",
      "name": "Ceiling Fan",
      "type": "FAN",
      "status": true,
      "ratedPower": 75,
      "currentPower": 75,
      "lastChanged": "2026-07-03T14:30:00.000Z",
      "createdAt": "2026-07-01T10:00:00.000Z",
      "updatedAt": "2026-07-03T14:30:00.000Z"
    },
    {
      "id": "uuid-2",
      "roomId": "room-uuid",
      "name": "Tube Light",
      "type": "LIGHT",
      "status": false,
      "ratedPower": 40,
      "currentPower": 0,
      "lastChanged": "2026-07-03T12:00:00.000Z",
      "createdAt": "2026-07-01T10:00:00.000Z",
      "updatedAt": "2026-07-03T12:00:00.000Z"
    }
  ]
}
```

**Error `404`** — Room not found

---

## Devices

### GET `/devices`

🔒 Protected. Returns all devices across all rooms.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Devices retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "roomId": "room-uuid",
      "name": "Ceiling Fan",
      "type": "FAN",
      "status": true,
      "ratedPower": 75,
      "currentPower": 75,
      "lastChanged": "2026-07-03T14:30:00.000Z",
      "createdAt": "2026-07-01T10:00:00.000Z",
      "updatedAt": "2026-07-03T14:30:00.000Z",
      "room": {
        "id": "room-uuid",
        "name": "Drawing Room"
      }
    }
  ]
}
```

---

### GET `/devices/:id`

🔒 Protected. Returns a single device by ID.

**Path Params**
| Param | Type   | Description  |
|-------|--------|--------------|
| `id`  | string | Device UUID  |

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Device retrieved successfully",
  "data": {
    "id": "uuid",
    "roomId": "room-uuid",
    "name": "Ceiling Fan",
    "type": "FAN",
    "status": true,
    "ratedPower": 75,
    "currentPower": 75,
    "lastChanged": "2026-07-03T14:30:00.000Z",
    "createdAt": "2026-07-01T10:00:00.000Z",
    "updatedAt": "2026-07-03T14:30:00.000Z",
    "room": {
      "id": "room-uuid",
      "name": "Drawing Room"
    }
  }
}
```

**Error `404`** — Device not found

---

### PATCH `/devices/:id/status`

🌐 **Open** (no auth required — used by simulator, hardware, testing).

Turns a device on or off. Automatically sets `currentPower` to `ratedPower` (on) or `0` (off) and records a `DeviceHistory` entry if the status changed.

**Path Params**
| Param | Type   | Description  |
|-------|--------|--------------|
| `id`  | string | Device UUID  |

**Request Body**
```json
{
  "status": true
}
```

| Field    | Type    | Required | Description                    |
|----------|---------|----------|--------------------------------|
| `status` | boolean | ✅ Yes   | `true` = ON, `false` = OFF     |

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Device status updated successfully",
  "data": {
    "id": "uuid",
    "roomId": "room-uuid",
    "name": "Ceiling Fan",
    "type": "FAN",
    "status": true,
    "ratedPower": 75,
    "currentPower": 75,
    "lastChanged": "2026-07-03T15:00:00.000Z",
    "createdAt": "2026-07-01T10:00:00.000Z",
    "updatedAt": "2026-07-03T15:00:00.000Z",
    "room": {
      "id": "room-uuid",
      "name": "Drawing Room"
    }
  }
}
```

**Error `404`** — Device not found
**Error `400`** — `status` field missing or not a boolean

---

## Dashboard

### GET `/dashboard`

🔒 Protected. Returns a full dashboard snapshot — room list with nested devices, aggregate counts, and total power.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard data retrieved successfully",
  "data": {
    "totalRooms": 3,
    "totalDevices": 10,
    "activeDevices": 4,
    "totalPower": 390,
    "activeAlerts": 2,
    "rooms": [
      {
        "id": "uuid",
        "name": "Drawing Room",
        "type": "COMMON",
        "createdAt": "2026-07-01T10:00:00.000Z",
        "updatedAt": "2026-07-03T14:00:00.000Z",
        "devices": [
          {
            "id": "uuid",
            "name": "Ceiling Fan",
            "type": "FAN",
            "status": true,
            "currentPower": 75
          }
        ],
        "_count": {
          "alerts": 1
        }
      }
    ]
  }
}
```

---

### GET `/dashboard/summary`

🔒 Protected. Returns a compact summary — ideal for cards/widgets on the web dashboard and Discord bot.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Dashboard summary retrieved successfully",
  "data": {
    "totalRooms": 3,
    "totalDevices": 10,
    "activeDevices": 4,
    "totalPower": 390,
    "activeAlerts": 2
  }
}
```

---

### GET `/dashboard/power`

🔒 Protected. Returns current power consumption broken down by room.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Power data retrieved successfully",
  "data": {
    "totalPower": 390,
    "rooms": [
      {
        "name": "Drawing Room",
        "power": 90
      },
      {
        "name": "Conference Room",
        "power": 200
      },
      {
        "name": "Server Room",
        "power": 100
      }
    ]
  }
}
```

---

## Alerts

### GET `/alerts`

🔒 Protected. Returns all alerts (both active and resolved), ordered by newest first.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Alerts retrieved successfully",
  "data": [
    {
      "id": "uuid",
      "roomId": "room-uuid",
      "deviceId": "device-uuid",
      "type": "AFTER_HOURS",
      "severity": "HIGH",
      "message": "Device is running after office hours",
      "isActive": true,
      "createdAt": "2026-07-03T20:00:00.000Z",
      "resolvedAt": null,
      "room": {
        "id": "room-uuid",
        "name": "Drawing Room"
      },
      "device": {
        "id": "device-uuid",
        "name": "Ceiling Fan",
        "type": "FAN"
      }
    },
    {
      "id": "uuid-2",
      "roomId": "room-uuid-2",
      "deviceId": null,
      "type": "ROOM_RUNNING_TOO_LONG",
      "severity": "MEDIUM",
      "message": "Room has been active for over 8 hours",
      "isActive": false,
      "createdAt": "2026-07-03T08:00:00.000Z",
      "resolvedAt": "2026-07-03T16:30:00.000Z",
      "room": {
        "id": "room-uuid-2",
        "name": "Conference Room"
      },
      "device": null
    }
  ]
}
```

> **Alert Types:** `AFTER_HOURS` | `ROOM_RUNNING_TOO_LONG`
> **Severity Levels:** `LOW` | `MEDIUM` | `HIGH`

---

### PATCH `/alerts/:id/resolve`

🔒 Protected. Marks an alert as resolved by setting `isActive: false` and recording `resolvedAt`.

**Path Params**
| Param | Type   | Description  |
|-------|--------|--------------|
| `id`  | string | Alert UUID   |

**Request Body** — _none_

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Alert resolved successfully",
  "data": {
    "id": "uuid",
    "roomId": "room-uuid",
    "deviceId": "device-uuid",
    "type": "AFTER_HOURS",
    "severity": "HIGH",
    "message": "Device is running after office hours",
    "isActive": false,
    "createdAt": "2026-07-03T20:00:00.000Z",
    "resolvedAt": "2026-07-03T21:30:00.000Z",
    "room": {
      "id": "room-uuid",
      "name": "Drawing Room"
    },
    "device": {
      "id": "device-uuid",
      "name": "Ceiling Fan",
      "type": "FAN"
    }
  }
}
```

**Error `404`** — Alert not found

---

## Daily Usage

### GET `/usage/today`

🔒 Protected. Returns energy consumption logs for today, grouped with a total.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Today's usage retrieved successfully",
  "data": {
    "date": "2026-07-03",
    "totalKwh": 12.45,
    "logs": [
      {
        "id": "uuid",
        "roomId": "room-uuid",
        "usageDate": "2026-07-03T00:00:00.000Z",
        "energyKwh": 5.2,
        "createdAt": "2026-07-03T00:05:00.000Z",
        "room": {
          "id": "room-uuid",
          "name": "Drawing Room"
        }
      },
      {
        "id": "uuid-2",
        "roomId": "room-uuid-2",
        "usageDate": "2026-07-03T00:00:00.000Z",
        "energyKwh": 7.25,
        "createdAt": "2026-07-03T00:05:00.000Z",
        "room": {
          "id": "room-uuid-2",
          "name": "Conference Room"
        }
      }
    ]
  }
}
```

---

### GET `/usage/history`

🔒 Protected. Returns full usage history, grouped by date (newest first).

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Usage history retrieved successfully",
  "data": [
    {
      "date": "2026-07-03",
      "totalKwh": 12.45,
      "rooms": [
        {
          "roomId": "room-uuid",
          "roomName": "Drawing Room",
          "energyKwh": 5.2
        },
        {
          "roomId": "room-uuid-2",
          "roomName": "Conference Room",
          "energyKwh": 7.25
        }
      ]
    },
    {
      "date": "2026-07-02",
      "totalKwh": 18.9,
      "rooms": [
        {
          "roomId": "room-uuid",
          "roomName": "Drawing Room",
          "energyKwh": 8.1
        },
        {
          "roomId": "room-uuid-2",
          "roomName": "Conference Room",
          "energyKwh": 10.8
        }
      ]
    }
  ]
}
```

---

### GET `/usage/rooms/:id`

🔒 Protected. Returns all usage logs for a specific room with total kWh.

**Path Params**
| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | Room UUID   |

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Room usage retrieved successfully",
  "data": {
    "roomId": "room-uuid",
    "totalKwh": 45.6,
    "logs": [
      {
        "id": "uuid",
        "roomId": "room-uuid",
        "usageDate": "2026-07-03T00:00:00.000Z",
        "energyKwh": 5.2,
        "createdAt": "2026-07-03T00:05:00.000Z",
        "room": {
          "id": "room-uuid",
          "name": "Drawing Room"
        }
      }
    ]
  }
}
```

**Error `404`** — Room not found

---

## Discord Bot

> These endpoints serve pre-formatted embed payloads for the Discord bot. The bot maps its slash commands to these routes.

| Discord Command | Backend Endpoint          |
|-----------------|---------------------------|
| `!summary`      | `GET /discord/summary`    |
| `!room <id>`    | `GET /discord/room/:id`   |
| `!usage`        | `GET /discord/usage/today`|
| `!alerts`       | `GET /discord/alerts`     |

---

### GET `/discord/summary`

🔒 Protected. Returns a Discord embed-shaped dashboard summary.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Discord summary retrieved successfully",
  "data": {
    "embed": {
      "title": "📊 Office Dashboard Summary",
      "fields": [
        { "name": "🏠 Rooms",          "value": "3",      "inline": true },
        { "name": "💡 Total Devices",  "value": "10",     "inline": true },
        { "name": "✅ Active Devices", "value": "4",      "inline": true },
        { "name": "⚡ Total Power",    "value": "390 W",  "inline": true },
        { "name": "🚨 Active Alerts",  "value": "2",      "inline": true }
      ]
    }
  }
}
```

---

### GET `/discord/room/:id`

🔒 Protected. Returns a Discord embed for a single room with device summary.

**Path Params**
| Param | Type   | Description |
|-------|--------|-------------|
| `id`  | string | Room UUID   |

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Discord room info retrieved successfully",
  "data": {
    "embed": {
      "title": "🏠 Room: Drawing Room",
      "fields": [
        { "name": "Type",           "value": "COMMON", "inline": true },
        { "name": "Total Devices",  "value": "3",      "inline": true },
        { "name": "Active Devices", "value": "2",      "inline": true },
        { "name": "Current Power",  "value": "150 W",  "inline": true }
      ]
    }
  }
}
```

**Error `404`** — Room not found

---

### GET `/discord/usage/today`

🔒 Protected. Returns today's energy usage as a Discord embed.

**Response `200`**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Discord today usage retrieved successfully",
  "data": {
    "embed": {
      "title": "⚡ Today's Energy Usage (2026-07-03)",
      "fields": [
        {
          "name": "Total Consumption",
          "value": "12.45 kWh",
          "inline": false
        },
        {
          "name": "By Room",
          "value": "• Drawing Room: 5.20 kWh\n• Conference Room: 7.25 kWh",
          "inline": false
        }
      ]
    }
  }
}
```

---

### GET `/discord/alerts`

🔒 Protected. Returns active alerts as a Discord embed. Returns a "no alerts" embed if all clear.

**Response `200` — with active alerts**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Discord alerts retrieved successfully",
  "data": {
    "embed": {
      "title": "🚨 Active Alerts (2)",
      "description": "• **[HIGH]** Device is running after office hours — Room: Drawing Room — Device: Ceiling Fan\n• **[MEDIUM]** Room has been active for over 8 hours — Room: Conference Room"
    }
  }
}
```

**Response `200` — all clear**
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Discord alerts retrieved successfully",
  "data": {
    "embed": {
      "title": "✅ No Active Alerts",
      "description": "All systems are running normally."
    }
  }
}
```

---

## Common Error Responses

All errors follow this shape:

```json
{
  "success": false,
  "statusCode": 404,
  "message": "Not Found",
  "errorMessages": [
    {
      "path": "",
      "message": "No Room found with the provided id"
    }
  ]
}
```

| Status | Meaning                         |
|--------|---------------------------------|
| `400`  | Bad Request / Validation Error  |
| `401`  | Unauthorized / Token expired    |
| `404`  | Resource not found              |
| `500`  | Internal Server Error           |

---

## Enums Reference

| Enum            | Values                                    |
|-----------------|-------------------------------------------|
| `DeviceType`    | `FAN`, `LIGHT`                            |
| `AlertType`     | `AFTER_HOURS`, `ROOM_RUNNING_TOO_LONG`    |
| `AlertSeverity` | `LOW`, `MEDIUM`, `HIGH`                   |
| `TokenType`     | `ACCESS`, `REFRESH`                       |
