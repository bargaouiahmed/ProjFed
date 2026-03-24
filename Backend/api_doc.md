# API Documentation

## Base URL

- Docker: `http://localhost:8080/api/v0`
- Local: `http://localhost:5193/api/v0`

---

## Common Request Headers

- `Accept: application/json` (recommended for all endpoints)
- `Authorization: Bearer <accessToken>` (required only on protected endpoints)
- `Content-Type` depends on endpoint body type:
  - `application/json` for JSON bodies
  - `multipart/form-data` for file upload forms

---

## 1. Register Student

## done

- **Endpoint:** `POST /student/auth/register`
- **Auth:** None
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
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
- **Headers:**
  - `Content-Type: multipart/form-data`
  - `Accept: application/json`
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
  - Uploads and stores the 2 documents under `wwwroot/uploads/institutes/{instituteName}/admindocuments/proofdocuments/...`
  - Creates upload directories on disk if they do not already exist
  - Creates a pending `AuthIdentity` (`uni_admin`), `UniUser`, and `PendingJoinRequest`
  - No institute is created at this stage

---

## done

## 3. Login

## done

- **Endpoint:** `POST /auth/login`
- **Auth:** None
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
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
- **Headers:**
  - `Accept: application/json`
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

## done

- **Endpoint:** `POST /auth/request-password-reset`
- **Auth:** None
- **Headers:**
  - `Accept: application/json`
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

## done

- **Endpoint:** `POST /auth/reset-password`
- **Auth:** None
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
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

## done

## 7. Resend Activation Email

- **Endpoint:** `POST /auth/resend-activation-email`
- **Auth:** None
- **Headers:**
  - `Accept: application/json`
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

## done

- **Endpoint:** `POST /auth/refresh-token`
- **Auth:** None
- **Headers:**
  - `Content-Type: application/json`
  - `Accept: application/json`
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
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Request Body:** None
- **Response:**
  - 200 OK: `SerializedUser`
    - `id`, `identityId`, `firstname`, `lastname`, `email`, `role`, `createdAt`, `updatedAt`, `pfpUrl`
  - 401 Unauthorized: Missing/invalid token claims
  - 404 Not Found: User not found
- **Side Effects:**
  - None (read-only)

---

## 10. List Institute Join Requests

- **Endpoint:** `GET /admin/requests`
- **Auth:** Bearer token required, role `admin` or `super_admin`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
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
  - Note: current implementation does not filter by `status = pending`; it returns paginated join requests with their current status

---

## 11. Accept Pending Institute Join Request

- **Endpoint:** `PUT /admin/requests/{requestId}/accept`
- **Auth:** Bearer token required, role `admin` or `super_admin`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
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

---

## 12. Reject Pending Institute Join Request

- **Endpoint:** `PUT /admin/requests/{requestId}/reject`
- **Auth:** Bearer token required, role `admin` or `super_admin`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json` (required only if sending body)
  - `Accept: application/json`
- **Route Parameters:**
  - `requestId` (GUID, required)
- **Request Body:** JSON (optional)
  - `message` (string, optional)
- **Response:**
  - 200 OK: Rejected `PendingRequestResponse`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Marks request/identity as rejected
  - Sets `ReviewedAt` and `ReviewedBy`
  - Stores rejection message (if provided) in request `Message`
  - Soft-deletes/deactivates related identity (`IsDeleted=true`, `DeletedAt` set, `IsActive=false`)

---

## 13. Update Current Account

- **Endpoint:** `PUT /accounts`
- **Auth:** Bearer token required
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: multipart/form-data`
  - `Accept: application/json`
- **Request Body:** Form Data (`multipart/form-data`)
  - `firstname` (string, optional)
  - `lastname` (string, optional)
  - `email` (string, optional)
  - `pfp` (file, optional; allowed: `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`; max 5MB)
- **Response:**
  - 200 OK: Updated `SerializedUser`
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - Updates the account profile (names/email)
  - If `pfp` is provided, stores the file under `wwwroot/uploads/users/<role>/...` and updates `pfpUrl`

---

## 14. Reset User Password (Admin)

- **Endpoint:** `PUT /admin/users/{userId}/reset-password`
- **Auth:** Bearer token required, role `admin` or `super_admin`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Route Parameters:**
  - `userId` (GUID, required)
- **Request Body:** JSON
  - `newPassword` (string, required)
- **Response:**
  - 200 OK: Password reset successful message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Replaces stored password hash
  - Note: admin/super_admin accounts cannot be reset by this endpoint

---

## 15. Add Class Metadata

- **Endpoint:** `POST /administration/metadata`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON
  - `specialty` (string, required)
  - `instituteId` (GUID, required)
  - `levelOfStudies` (string, required)
  - `maxYears` (int, required)
  - `defaultMaxTerms` (int, required)
- **Response:**
  - 200 OK: Class metadata added message
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - Creates `ClassMetadata` rows for levels `1..maxYears`
  - Initializes `CurrentTerm = 1` for each created row

---

## 16. List Class Metadata (Paginated)

- **Endpoint:** `GET /administration/metadata`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Query Parameters:**
  - `instituteId` (GUID, required)
  - `pageNumber` (int, optional, default `1`)
  - `pageSize` (int, optional, default `10`)
- **Response:**
  - 200 OK: List of `SerializedClassMetaData`
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - None (read-only)

---

## 17. Add Class to Metadata Type

- **Endpoint:** `POST /administration/metadata/addClass`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Query Parameters:**
  - `metadataId` (GUID, required)
- **Response:**
  - 200 OK: `ClassPrettyName`
    - `name` (string)
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - Creates a new `UniClass` with a generated `ClassCode`

---

## 18. Update Class Metadata

- **Endpoint:** `PUT /administration/metadata`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON (`SerializedClassMetaData`)
  - `metadataId` (GUID, required)
  - `levelOfStudies` (string, required)
  - `specialty` (string, required)
  - `maxYears` (int, required)
  - `level` (int, required)
  - `maxTerms` (int, required)
  - `numberOfClasses` (int, required)
- **Response:**
  - 200 OK: Updated `SerializedClassMetaData`
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - Updates class metadata fields (except `maxYears`)

---

## 19. Get All Student Courses

- **Endpoint:** `POST /student`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Request Body:** None
- **Response:**
  - 200 OK: List of `SerializedCourse`
    - `id`, `name`, `description`, `professorFirstname`, `professorLastname`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)

---

## 20. Add Student to Class

- **Endpoint:** `POST /student/course/add`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Query Parameters:**
  - `classCode` (string, required)
- **Response:**
  - 200 OK: Student added to class message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Associates the student with the class identified by `classCode`

---

## 21. Register New Uni Staff

- **Endpoint:** `POST /administration/staff/register`
- **Auth:** Bearer token required, role `uni_admin`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON
  - `firstname` (string, required)
  - `lastname` (string, required)
  - `email` (string, required)
- **Response:**
  - 200 OK: Staff invitation created message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Creates a new `AuthIdentity` and `UniUser` (role `uni_staff`)
  - Creates a `UniStaffInvitation`
  - Sends welcome email with auto-generated password

---

## 22. Add Existing Uni Staff

- **Endpoint:** `POST /administration/staff/add-existing`
- **Auth:** Bearer token required, role `uni_admin`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON
  - `email` (string, required)
- **Response:**
  - 200 OK: Staff member added message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Associates the existing `UniUser` with the admin’s institute
  - Creates a `UniStaffInvitation` so the user can accept or reject

---

## 23. Add New Professor to Course

- **Endpoint:** `POST /administration/courses/{courseId}/professors`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Request Body:** JSON
  - `email` (string, required)
  - `firstname` (string, required)
  - `lastname` (string, required)
- **Response:**
  - 200 OK: Professor invitation created message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - If professor exists in same institute, assigns course and creates a notification
  - If professor exists in another institute, creates a `ProfessorInvitation`
  - If professor does not exist, creates identity/professor + invitation and sends email

---

## 24. Add Existing Professor to Course

- **Endpoint:** `POST /administration/courses/{courseId}/professors/add-existing`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Request Body:** JSON
  - `email` (string, required)
- **Response:**
  - 200 OK: Professor assignment processed message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - If professor exists in same institute, assigns course and creates a notification
  - If professor exists in another institute, creates a `ProfessorInvitation`
