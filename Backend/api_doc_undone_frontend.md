# API Documentation

## Base URL

- Docker: `http://localhost:8080/api/v0`
- Local: `http://localhost:5193/api/v0`

## Common Request Headers

- `Accept: application/json` (recommended for all endpoints)
- `Authorization: Bearer <accessToken>` (required only on protected endpoints)
- `Content-Type` depends on endpoint body type:
  - `application/json` for JSON bodies
  - `multipart/form-data` for file upload forms

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
