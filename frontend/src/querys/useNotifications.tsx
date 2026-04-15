/*
## 27. Get Current User Notifications

- **Endpoint:** `GET /accounts/notifications`
- **Auth:** Bearer token required
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Response:**
  - 200 OK: List of notifications
    - `id`, `message`, `createdAt`, `seen`
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - Marks unread notifications as seen when fetched
  */

import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";

export interface Notification {
  id: string;
  message: string;
  createdAt: string;
  seen: string;
}

export default function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get<Notification[]>("/accounts/notifications");
      return response.data;
    },
  });
}
