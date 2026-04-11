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
