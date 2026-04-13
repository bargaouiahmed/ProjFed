/**
 * 
 * ## 26A. Reset Class Metadata Term

- **Endpoint:** `GET /administration/metadata/{metadataId}/reset-term`
- **Auth:** Bearer token required, role `uni_admin` or `uni_staff`
- **Headers:**
  - `Authorization: Bearer <accessToken>`
  - `Accept: application/json`
- **Route Parameters:**
  - `metadataId` (GUID, required)
- **Response:**
  - 200 OK: Array of `SerializedClassMetaData` objects (all class metadata for the institute, with the reset term)
    - Each object:
      - `metadataId` (GUID)
      - `levelOfStudies` (string)
      - `specialty` (string)
      - `maxYears` (int)
      - `level` (int)
      - `maxTerms` (int)
      - `currentTerm` (int)
      - `numberOfClasses` (int)
  - 400 Bad Request: Error message
  - 401 Unauthorized: Missing/invalid token claims
  - 403 Forbidden: Not allowed to reset term for this metadata
- **Side Effects:**
  - Resets the `CurrentTerm` for the specified ClassMetadata and returns all metadata for the institute

---
 */
