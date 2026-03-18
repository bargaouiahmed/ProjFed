# API Documentation

## Base URL

`http://localhost:8080/api/v0 or http://localhost:5193`

---

## 1. Register Student

- **Endpoint:** `POST /student/auth/register`
- **Request Body:** JSON
  - `email` (string, required)
  - `password` (string, required)
  - `firstname` (string, required)
  - `lastname` (string, required)
- **Response:**
  - 200 OK: Registration successful message
  - 400 Bad Request: Error message

---

## 2. Register Institute Admin

- **Endpoint:** `POST /institute/auth/admin/register`
- **Request Body:** Form Data (multipart/form-data)
  - `adminfirstname` (string, required)
  - `adminlastname` (string, required)
  - `name` (string, required)
  - `adminemail` (string, required)
  - `adminpassword` (string, required)
  - `country` (string, required)
  - `city` (string, required)
  - `postalcode` (string, required)
  - `ProofDocument` (file, required)
  - `IdentityDocument` (file, required)
- **Response:**
  - 200 OK: Registration request submitted message
  - 400 Bad Request: Error message

---

## 3. Student Login

- **Endpoint:** `POST /student/auth/login`
- **Request Body:** JSON
  - `email` (string, required)
  - `password` (string, required)
- **Response:**
  - 200 OK: Token pair (access and refresh tokens)
  - 400 Bad Request: Error message

---

## 4. Activate Account

- **Endpoint:** `POST /auth/activate-account`
- **Query Parameters:**
  - `identityId` (GUID, required)
  - `token` (string, required)
- **Response:**
  - 200 OK: Account activated message
  - 400 Bad Request: Error message

---

## 5. Request Password Reset

- **Endpoint:** `POST /auth/request-password-reset`
- **Query Parameters:**
  - `email` (string, required)
- **Response:**
  - 200 OK: Password reset email sent message
  - 400 Bad Request: Error message

---

## 6. Reset Password

- **Endpoint:** `POST /auth/reset-password`
- **Request Body:** JSON
  - `identityId` (GUID, required)
  - `resetToken` (string, required)
  - `newPassword` (string, required)
- **Response:**
  - 200 OK: Password reset message
  - 400 Bad Request: Error message

---

## 7. Resend Activation Email

- **Endpoint:** `POST /auth/resend-activation-email`
- **Query Parameters:**
  - `email` (string, required)
- **Response:**
  - 200 OK: Activation email resent message
  - 400 Bad Request: Error message

---

## 8. Refresh Token

- **Endpoint:** `POST /auth/refresh-token`
- **Request Body:** JSON
  - `refreshToken` (string, required)
- **Response:**
  - 200 OK: New access token (and possibly refresh token)
  - 400 Bad Request: Error message

---

> All endpoints return errors in the format:
>
> ```json
> {
>   "type": "...",
>   "title": "One or more validation errors occurred.",
>   "status": 400,
>   "errors": {
>     "FieldName": ["Error message"]
>   },
>   "traceId": "..."
> }
> ```
