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
        - `id`, `questionText`, `options`, `questionMark`, `attachmentUrls`, `createdAt`, `updatedAt`
      - `redactionQuestions[]`
        - `id`, `questionText`, `questionMark`, `attachmentUrls`, `createdAt`, `updatedAt`
    - `tests[]`
      - `id`, `courseId`, `title`, `description`, `totalMarks`, `createdAt`, `updatedAt`
      - `mcqs[]`
        - `id`, `questionText`, `options`, `questionMark`, `attachmentUrls`, `createdAt`, `updatedAt`
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

## 21.1 Get Student Course

- **Endpoint:** `GET /student/courses/{courseId}`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Response:**
  - 200 OK: `SerializedCourse`
  - 400 Bad Request: Error message (course not found / unauthorized / class not joined)
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)
  - Returns only if the course belongs to the student's class and current term

---

## 21.2 Get Course Chapters For Student

- **Endpoint:** `GET /student/courses/{courseId}/chapters`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Response:**
  - 200 OK: List of `SerializedChapter`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)

---

## 21.3 Get Chapter For Student

- **Endpoint:** `GET /student/chapters/{chapterId}`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `chapterId` (GUID, required)
- **Response:**
  - 200 OK: `SerializedChapter`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)

---

## 21.4 Get Course Exams For Student

- **Endpoint:** `GET /student/courses/{courseId}/exams`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Response:**
  - 200 OK: List of `SerializedExam`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)
  - Exam MCQs returned to students do not include `correctOptions`

---

## 21.5 Get Exam For Student

- **Endpoint:** `GET /student/exams/{examId}`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `examId` (GUID, required)
- **Response:**
  - 200 OK: `SerializedExam`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)
  - Exam MCQs returned to students do not include `correctOptions`

---

## 21.6 Get Course Tests For Student

- **Endpoint:** `GET /student/courses/{courseId}/tests`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `courseId` (GUID, required)
- **Response:**
  - 200 OK: List of `SerializedTest`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)
  - Test MCQs returned to students do not include `correctOptions`

---

## 21.7 Get Test For Student

- **Endpoint:** `GET /student/tests/{testId}`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `testId` (GUID, required)
- **Response:**
  - 200 OK: `SerializedTest`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - None (read-only)
  - Test MCQs returned to students do not include `correctOptions`

---

## 21.8 Submit Exam MCQ Response

- **Endpoint:** `PUT /student/exams/mcqs/response`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON
  - `questionId` (GUID, required)
  - `selectedOptionIndex` (int, required, zero-based)
- **Response:**
  - 200 OK: `SerializedStudentMcqResponse`
    - `id`, `questionId`, `selectedOptionIndex`, `score`, `createdAt`, `updatedAt`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Creates or updates the student MCQ response for the question
  - Sets score automatically from server-side answer validation

---

## 21.9 Submit Exam Redaction Response

- **Endpoint:** `PUT /student/exams/redaction-questions/response`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON
  - `questionId` (GUID, required)
  - `answerText` (string, required)
- **Response:**
  - 200 OK: `SerializedStudentRedactionResponse`
    - `id`, `questionId`, `answerText`, `score`, `createdAt`, `updatedAt`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Creates or updates the student redaction response for the question
  - Resets score to `0` until professor grading

---

## 21.10 Submit Test MCQ Response

- **Endpoint:** `PUT /student/tests/mcqs/response`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON
  - `questionId` (GUID, required)
  - `selectedOptionIndex` (int, required, zero-based)
- **Response:**
  - 200 OK: `SerializedStudentMcqResponse`
    - `id`, `questionId`, `selectedOptionIndex`, `score`, `createdAt`, `updatedAt`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Creates or updates the student MCQ response for the question
  - Sets score automatically from server-side answer validation

---

## 21.11 Submit Test Redaction Response

- **Endpoint:** `PUT /student/tests/redaction-questions/response`
- **Auth:** Bearer token required, role `student`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Content-Type: application/json`
  - `Accept: application/json`
- **Request Body:** JSON
  - `questionId` (GUID, required)
  - `answerText` (string, required)
- **Response:**
  - 200 OK: `SerializedStudentRedactionResponse`
    - `id`, `questionId`, `answerText`, `score`, `createdAt`, `updatedAt`
  - 400 Bad Request: Error message
  - 401/403: Unauthorized or forbidden by role policy
- **Side Effects:**
  - Creates or updates the student redaction response for the question
  - Resets score to `0` until professor grading

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
