import { useQuery } from "@tanstack/react-query";
import { api } from "./axios";

/*
## 78. List Institute Users

## done

- **Endpoint:** `GET /administration/institute/users`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Query Parameters:**
  - `pageNumber` (int, optional, default `1`)
  - `pageSize` (int, optional, default `10`)
- **Response:**
  - 200 OK: `SerializedUserListResponse`
    - `users[]`
      - `id`, `identityId`, `firstname`, `lastname`, `email`, `role`, `createdAt`, `updatedAt`, `pfpUrl`
    - `totalCount`
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claim
- **Side Effects:**
  - None (read-only)

*/

interface User {
  id: string;
  identityId: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  pfpUrl: string;
}

interface Response {
  users: User[];
  totalCount: number;
}

export default function useListUniUsers({
  pageNumber,
  pageSize,
}: {
  pageNumber?: number;
  pageSize?: number;
}) {
  return useQuery({
    queryKey: ["uniusers"],
    queryFn: async () => {
      const response = await api.get<Response>(
        "/administration/institute/users",
        {
          params: { pageNumber, pageSize },
        },
      );
      return response.data;
    },
  });
}
