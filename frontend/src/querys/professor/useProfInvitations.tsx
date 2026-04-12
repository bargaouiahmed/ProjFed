/*
## 18. List All Professor Invitations

- **Endpoint:** `GET /administration/professor-invitations`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Response:**
  - 200 OK: List of professor invitations across the caller's institute
    - `id`, `identityId`, `professorEmail`, `courseId`, `courseName`, `classPrettyName`, `status`, `invitedAt`
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - None (read-only)
  - Includes invitations with any status: `pending`, `accepted`, or `rejected`
  
  */

import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

interface ProfInvitation {
  id: string;
  identityId: string;
  professorEmail: string;
  courseId: string;
  courseName: string;
  classPrettyName: string;
  status: string;
  invitedAt: Date;
}

export default function useProfInvitations() {
  return useQuery({
    queryKey: ["profinvitations"],
    queryFn: async () => {
      const response = await api.get<ProfInvitation[]>(
        "/administration/professor-invitations",
      );
      return response.data;
    },
  });
}
