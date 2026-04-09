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
    - `metadataId`, `levelOfStudies`, `specialty`, `maxYears`, `level`, `maxTerms`, `currentTerm`, `numberOfClasses`
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

---

## 19. Update Class Metadata

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

## 20. Get All Student Courses

- **Endpoint:** `POST /student`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Request Body:** None
- **Response:**
  - 200 OK: List of `SerializedCourse`
    - `id`, `name`, `description`, `term`, `professorFirstname`, `professorLastname`
    - `chapters[]`
      - `id`, `courseId`, `title`, `description`, `attachmentUrls`, `createdAt`, `updatedAt`
    - `exams[]`
      - `id`, `courseId`, `title`, `description`, `totalMarks`, `createdAt`, `updatedAt`
      - `mcqs[]`
        - `id`, `questionText`, `options`, `correctOptions`, `questionMark`, `explanation`, `attachmentUrls`, `createdAt`, `updatedAt`
      - `redactionQuestions[]`
        - `id`, `questionText`, `questionMark`, `attachmentUrls`, `createdAt`, `updatedAt`
    - `tests[]`
      - `id`, `courseId`, `title`, `description`, `totalMarks`, `createdAt`, `updatedAt`
      - `mcqs[]`
        - `id`, `questionText`, `options`, `correctOptions`, `questionMark`, `explanation`, `attachmentUrls`, `createdAt`, `updatedAt`
      - `redactionQuestions[]`
        - `id`, `questionText`, `questionMark`, `attachmentUrls`, `createdAt`, `updatedAt`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)
  - Returns only the courses whose `Term` matches the student class metadata `CurrentTerm`

---

## 21. Add Student to Class

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

## 22. Register New Uni Staff

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
  - Sends welcome email with auto-generated password and invitation guidance

---

## 23. Add Existing Uni Staff

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

## 24. Add New Professor to Course

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
  - Newly created professor accounts also receive a `ProfessorInvitation` row that they can later accept or reject

---

## 25. Add Existing Professor to Course

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

---

## 26. Increment Class Metadata Term

- **Endpoint:** `POST /administration/metadata/{metadataId}/increment-term`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `metadataId` (GUID, required)
- **Response:**
  - 200 OK: current term as integer
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
- **Side Effects:**
  - Increments `ClassMetadata.CurrentTerm` by 1
  - Fails if the caller is outside the institute or if `CurrentTerm >= MaxTerms`

---

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

---

## 28. Get Uni Staff Invitations

- **Endpoint:** `GET /accounts/uni-staff-invitations`
- **Auth:** Bearer token required, role `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Response:**
  - 200 OK: List of uni staff invitations
    - `id`, `instituteId`, `instituteName`, `status`, `invitedAt`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)

---

## 29. Accept Uni Staff Invitation

- **Endpoint:** `PUT /accounts/uni-staff-invitations/{invitationId}/accept`
- **Auth:** Bearer token required, role `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `invitationId` (GUID, required)
- **Response:**
  - 200 OK: Invitation accepted message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Sets invitation `Status = accepted`
  - Assigns the invited staff member to the invitation's institute
  - Creates a notification confirming acceptance

---

## 30. Reject Uni Staff Invitation

- **Endpoint:** `PUT /accounts/uni-staff-invitations/{invitationId}/reject`
- **Auth:** Bearer token required, role `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `invitationId` (GUID, required)
- **Response:**
  - 200 OK: Invitation rejected message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Sets invitation `Status = rejected`
  - Does not assign the staff member to the institute
  - Creates a notification confirming rejection

---

## 31. Get Professor Invitations

- **Endpoint:** `GET /accounts/professor-invitations`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Response:**
  - 200 OK: List of professor invitations
    - `id`, `courseId`, `courseName`, `classPrettyName`, `status`, `invitedAt`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)

---

## 32. Accept Professor Invitation

- **Endpoint:** `PUT /accounts/professor-invitations/{invitationId}/accept`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `invitationId` (GUID, required)
- **Response:**
  - 200 OK: Invitation accepted message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Sets invitation `Status = accepted`
  - Assigns the invited professor to the invitation’s course
  - Creates a notification confirming acceptance

---

## 33. Reject Professor Invitation

- **Endpoint:** `PUT /accounts/professor-invitations/{invitationId}/reject`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `invitationId` (GUID, required)
- **Response:**
  - 200 OK: Invitation rejected message
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Sets invitation `Status = rejected`
  - Does not assign the professor to the course
  - Creates a notification confirming rejection

---

## 34. Initialize Empty Chapter

- **Endpoint:** `POST /professor/courses/{courseId}/chapters/init`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Response:**
  - 200 OK: `SerializedChapter`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Creates an empty chapter with title `Untitled chapter`
  - Professor must own the course

---

## 35. List Course Chapters

- **Endpoint:** `GET /professor/courses/{courseId}/chapters`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: List of `SerializedChapter`
  - 400 Bad Request: Error message

---

## 36. Get Chapter

- **Endpoint:** `GET /professor/chapters/{chapterId}`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: `SerializedChapter`
  - 400 Bad Request: Error message

---

## 37. Update Chapter

- **Endpoint:** `PUT /professor/chapters`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `id` (GUID, required)
  - `title` (string, optional)
  - `description` (string, optional)
  - `attachments` (file[], optional; allowed: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`; max 25MB each)
- **Response:**
  - 200 OK: Updated `SerializedChapter`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Uploads files under `wwwroot/uploads/professor-space/chapters/...`
  - Stores generated static URLs in `attachmentUrls`

---

## 38. Delete Chapter

- **Endpoint:** `DELETE /professor/chapters/{chapterId}`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK
  - 400 Bad Request: Error message

---

## 39. Initialize Empty Exam

- **Endpoint:** `POST /professor/courses/{courseId}/exams/init`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: `SerializedExam`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Creates an empty exam with title `Untitled exam`

---

## 40. List Course Exams

- **Endpoint:** `GET /professor/courses/{courseId}/exams`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: List of `SerializedExam`
  - 400 Bad Request: Error message

---

## 41. Get Exam

- **Endpoint:** `GET /professor/exams/{examId}`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: `SerializedExam`
  - 400 Bad Request: Error message

---

## 42. Update Exam

- **Endpoint:** `PUT /professor/exams`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:** JSON
  - `id` (GUID, required)
  - `title` (string, optional)
  - `description` (string, optional)
  - `totalMarks` (int, optional)
- **Response:**
  - 200 OK: Updated `SerializedExam`
  - 400 Bad Request: Error message

---

## 43. Delete Exam

- **Endpoint:** `DELETE /professor/exams/{examId}`
- **Auth:** Bearer token required, role `professor`

---

## 44. Add Exam MCQ

- **Endpoint:** `POST /professor/exams/{examId}/mcqs`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `questionText` (string, required)
  - `options` (string, required)
  - `correctOptions` (string, required)
  - `questionMark` (int, required)
  - `explanation` (string, optional)
  - `attachments` (file[], optional; allowed: `.jpg`, `.jpeg`, `.png`, `.webp`, `.pdf`)
- **Response:**
  - 200 OK: `SerializedMcqQuestion`
  - 400 Bad Request: Error message

---

## 45. Update Exam MCQ

- **Endpoint:** `PUT /professor/exams/mcqs`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `id` (GUID, required)
  - other MCQ fields optional
  - `attachments` (file[], optional)
- **Response:**
  - 200 OK: `SerializedMcqQuestion`
  - 400 Bad Request: Error message

---

## 46. Delete Exam MCQ

- **Endpoint:** `DELETE /professor/exams/mcqs/{mcqId}`
- **Auth:** Bearer token required, role `professor`

---

## 47. Add Exam Redaction Question

- **Endpoint:** `POST /professor/exams/{examId}/redaction-questions`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `questionText` (string, required)
  - `questionMark` (int, required)
  - `attachments` (file[], optional)
- **Response:**
  - 200 OK: `SerializedRedactionQuestion`
  - 400 Bad Request: Error message

---

## 48. Update Exam Redaction Question

- **Endpoint:** `PUT /professor/exams/redaction-questions`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `id` (GUID, required)
  - `questionText` (string, optional)
  - `questionMark` (int, optional)
  - `attachments` (file[], optional)
- **Response:**
  - 200 OK: `SerializedRedactionQuestion`
  - 400 Bad Request: Error message

---

## 49. Delete Exam Redaction Question

- **Endpoint:** `DELETE /professor/exams/redaction-questions/{questionId}`
- **Auth:** Bearer token required, role `professor`

---

## 50. Initialize Empty Test

- **Endpoint:** `POST /professor/courses/{courseId}/tests/init`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: `SerializedTest`
  - 400 Bad Request: Error message
- **Side Effects:**
  - Creates an empty test with title `Untitled test`

---

## 51. List Course Tests

- **Endpoint:** `GET /professor/courses/{courseId}/tests`
- **Auth:** Bearer token required, role `professor`

---

## 52. Get Test

- **Endpoint:** `GET /professor/tests/{testId}`
- **Auth:** Bearer token required, role `professor`

---

## 53. Update Test

- **Endpoint:** `PUT /professor/tests`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:** JSON
  - `id` (GUID, required)
  - `title` (string, optional)
  - `description` (string, optional)
  - `totalMarks` (int, optional)

---

## 54. Delete Test

- **Endpoint:** `DELETE /professor/tests/{testId}`
- **Auth:** Bearer token required, role `professor`

---

## 55. Add Test MCQ

- **Endpoint:** `POST /professor/tests/{testId}/mcqs`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `questionText`, `options`, `correctOptions`, `questionMark`, `explanation`, `attachments`

---

## 56. Update Test MCQ

- **Endpoint:** `PUT /professor/tests/mcqs`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`
- **Request Body:** Form Data
  - `id` (GUID, required)
  - other fields optional

---

## 57. Delete Test MCQ

- **Endpoint:** `DELETE /professor/tests/mcqs/{mcqId}`
- **Auth:** Bearer token required, role `professor`

---

## 58. Add Test Redaction Question

- **Endpoint:** `POST /professor/tests/{testId}/redaction-questions`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`

---

## 59. Update Test Redaction Question

- **Endpoint:** `PUT /professor/tests/redaction-questions`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: multipart/form-data`

---

## 60. Delete Test Redaction Question

- **Endpoint:** `DELETE /professor/tests/redaction-questions/{questionId}`
- **Auth:** Bearer token required, role `professor`

---

## 61. Get Course Students And Grades

- **Endpoint:** `GET /professor/courses/{courseId}/students/grades`
- **Auth:** Bearer token required, role `professor`
- **Response:**
  - 200 OK: List of student grade summaries
    - `studentId`, `firstname`, `lastname`
    - `overallExamScore`, `overallExamTotalMarks`, `overallExamScoreOn20`
    - `overallTestScore`, `overallTestTotalMarks`, `overallTestScoreOn20`
    - `examGrades[]` and `testGrades[]`
      - `assessmentId`, `title`, `assessmentType`, `score`, `totalMarks`, `normalizedScoreOn20`

---

## 62. Grade Exam MCQ Response

- **Endpoint:** `PUT /professor/responses/exam-mcqs/{responseId}/grade`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:** JSON
  - `score` (int, required)

---

## 63. Grade Exam Redaction Response

- **Endpoint:** `PUT /professor/responses/exam-redaction-questions/{responseId}/grade`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:** JSON
  - `score` (int, required)

---

## 64. Grade Test MCQ Response

- **Endpoint:** `PUT /professor/responses/test-mcqs/{responseId}/grade`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:** JSON
  - `score` (int, required)

---

## 65. Grade Test Redaction Response

- **Endpoint:** `PUT /professor/responses/test-redaction-questions/{responseId}/grade`
- **Auth:** Bearer token required, role `professor`
- **Headers:**
  - `Content-Type: application/json`
- **Request Body:** JSON
  - `score` (int, required)
