## 20. Get All Student Courses

- **Endpoint:** `GET /student`
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

---
