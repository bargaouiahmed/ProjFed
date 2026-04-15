/*
## XX. List Professor Courses (ProfessorSpace)

- **Endpoint:** `GET /professor-space/courses`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Query Parameters:**
  - `pageNumber` (int, optional, default `1`)
  - `pageSize` (int, optional, default `10`)
- **Response:**
  - 200 OK: List of courses assigned to the authenticated professor
    - `id`, `courseName`, `description`, `term`, `studentCount`, etc.
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)
  - Only returns courses for the authenticated professor

## Base URL

- Docker: `http://localhost:8080/api/v0`
- Local: `http://localhost:5193/api/v0`

---

*/

import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export interface Course {
  id: string;
  name: string;
  description: string;
  term: string;
  uniClassId: string;
  createdAt: string;
}

interface Response {
  totalCount: number;
  courses: Course[];
}

export default function useProfCourses() {
  return useQuery({
    queryKey: ["prof-courses"],
    queryFn: async () => {
      const response = await api.get<Response>(`/professor/courses`);
      return response.data;
    },
  });
}
