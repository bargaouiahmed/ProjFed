# API Documentation

## Base URL

- Docker: `http://localhost:8080/api/v0`
- Local: `http://localhost:5193/api/v0`

---

## 1. Register Student

## done

- **Endpoint:** `POST /student/auth/register`
- **Auth:** None
- **Request Body:** JSON
  - `firstname` (string, required)
  - `lastname` (string, required)
  - `email` (string, required)
  - `password` (string, required)
- **Response:**
  - 200 OK: Registration successful message
  - 400 Bad Request: Error message
- **Side Effects:**
  - Creates a new `AuthIdentity` and `Student` record
  - Generates/stores account activation token
  - Sends activation email

---

## 2. Register Institute Admin

- **Endpoint:** `POST /institute/auth/admin/register`
- **Auth:** None
- **Request Body:** Form Data (`multipart/form-data`)
  - `adminFirstname` (string, required)
  - `adminLastname` (string, required)
  - `adminEmail` (string, required)
  - `adminPassword` (string, required)
  - `name` (string, required)
  - `country` (string, required)
  - `city` (string, required)
  - `postalCode` (string, required)
  - `proofDocument` (file: `.jpg`, `.jpeg`, `.png`, `.pdf`; max 25MB; required)
  - `identityDocument` (file: `.jpg`, `.jpeg`, `.png`, `.pdf`; max 25MB; required)
- **Response:**
  - 200 OK: Request submitted successfully
  - 400 Bad Request: Error message
- **Side Effects:**
  - Uploads and stores the 2 documents under `wwwroot/uploads/...`
  - Creates a pending `AuthIdentity` (`uni_admin`), `UniUser`, and `PendingJoinRequest`
  - No institute is created at this stage

---

## 3. Login

- **Endpoint:** `POST /auth/login`
- **Auth:** None
- **Request Body:** JSON
  - `email` (string, required)
  - `password` (string, required)
- **Response:**
  - 200 OK: `{ accessToken, refreshToken }`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Rotates/stores refresh token and its expiry in DB

---

## 4. Activate Account

## done

- **Endpoint:** `GET /student/auth/activate-account`
- **Auth:** None
- **Query Parameters:**
  - `id` (GUID, required)
  - `token` (string, required)
- **Response:**
  - 200 OK: Account activated message
  - 400 Bad Request: Error message
- **Side Effects:**
  - Sets `IsActive=true`
  - Clears activation token and token expiry

---

## 5. Request Password Reset

- **Endpoint:** `POST /auth/request-password-reset`
- **Auth:** None
- **Query Parameters:**
  - `email` (string, required)
- **Response:**
  - 200 OK: Password reset email sent message
  - 400 Bad Request: Error message
- **Side Effects:**
  - Generates/stores password reset token and expiry
  - Sends password reset email

---

## 6. Reset Password

- **Endpoint:** `POST /auth/reset-password`
- **Auth:** None
- **Request Body:** JSON
  - `identityId` (GUID, required)
  - `resetToken` (string, required)
  - `newPassword` (string, required)
- **Response:**
  - 200 OK: Password reset message
  - 400 Bad Request: Error message
- **Side Effects:**
  - Replaces stored password hash
  - Clears password reset token and expiry

---

## 7. Resend Activation Email

- **Endpoint:** `POST /auth/resend-activation-email`
- **Auth:** None
- **Query Parameters:**
  - `email` (string, required)
- **Response:**
  - 200 OK: Activation email resent message
  - 400 Bad Request: Error message
- **Side Effects:**
  - Regenerates/stores activation token and expiry
  - Sends activation email

---

## 8. Refresh Token

- **Endpoint:** `POST /auth/refresh-token`
- **Auth:** None
- **Request Body:** JSON
  - `refreshToken` (string, required)
- **Response:**
  - 200 OK: `{ accessToken }`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Rotates/stores a new refresh token and expiry in DB
  - Returns only new access token in response payload

---

## 9. Get Current Account

- **Endpoint:** `GET /accounts`
- **Auth:** Bearer token required
- **Request Body:** None
- **Response:**
  - 200 OK: `SerializedUser`
    - `id`, `identityId`, `firstname`, `lastname`, `email`, `role`, `createdAt`, `updatedAt`, `pfpUrl`
  - 401 Unauthorized: Missing/invalid token claims
  - 404 Not Found: User not found
- **Side Effects:**
  - None (read-only)

---

## 10. List Pending Institute Join Requests

- **Endpoint:** `GET /admin/requests`
- **Auth:** Bearer token required, role `admin` or `super_admin`
- **Query Parameters:**
  - `pageNumber` (int, optional, default `1`)
  - `pageSize` (int, optional, default `10`)
- **Response:**
  - 200 OK: List of `PendingRequestResponse`
    - Includes request/admin identity fields, institute fields, status, and `totalRequestsCount`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)

---

## 11. Accept Pending Institute Join Request

- **Endpoint:** `PUT /admin/requests/{requestId}/accept`
- **Auth:** Bearer token required, role `admin` or `super_admin`
- **Route Parameters:**
  - `requestId` (GUID, required)
- **Response:**
  - 200 OK: Accepted `PendingRequestResponse`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Marks request/identity as accepted
  - Sets `ReviewedAt` and `ReviewedBy`
  - Creates a new `Institute`
  - Assigns the requesting `UniUser` to the created institute
