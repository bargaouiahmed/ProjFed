# Project UML Diagrams

## 1. Use Case Diagram (Refactored)

```plantuml
@startuml
skinparam packageStyle rectangle
skinparam actorStyle stickman
left to right direction

' --- Actors Definition ---
actor "Super Admin" as SA
actor "Admin" as A
actor "Uni Admin" as UA
actor "Uni Staff" as US
actor "Professor" as P
actor "Student" as ST

' --- System Boundaries & Use Cases ---
rectangle "EduAdmin Platform" {

    package "Platform Management" {
        SA -- (Add New Admins)
        A -- (Review Institute Requests)
        (Review Institute Requests) <.. (Accept Request & Create Institute) : <<extend>>
        (Review Institute Requests) <.. (Reject Request) : <<extend>>
        A -- (Manage Institutes)
    }

    package "Institute Administration" {
        UA -- (Register New Uni Staff)
        (Register New Uni Staff) ..> (Send Staff Invitation) : <<include>>
        
        US -- (Manage Class Metadata)
        US -- (Create Uni Classes)
        US -- (Assign Professor to Course)
        (Assign Professor to Course) ..> (Generate Invitation) : <<include>>
        US -- (Increment Academic Term)
    }

    package "Academic Operations" {
        P -- (Manage Course Content)
        (Manage Course Content) <.. (Upload Attachments) : <<extend>>
        P -- (Evaluate Students)
        (Evaluate Students) ..> (Grade Submissions) : <<include>>
        P -- (Handle Invitations)
    }

    package "Student Services" {
        ST -- (Register Account)
        (Register Account) ..> (Activate via Email) : <<include>>
        ST -- (Enroll in Class)
        (Enroll in Class) ..> (Validate Class Code) : <<include>>
        ST -- (Access Learning Material)
    }
}

@enduml
```

---

## 2. Sequence Diagram: Adding a Professor to a Course

This diagram covers the flow where a Uni Admin or Staff adds a professor to a specific course. It handles both existing and new professors.

```plantuml
@startuml
actor "Uni Admin/Staff" as User
participant "AdministrationController" as Ctrl
participant "AdministrationService" as Svc
participant "AppDbContext" as DB
participant "IEmailService" as Email
database "Database" as Store

User -> Ctrl : POST /courses/{id}/professors (email, names)
activate Ctrl

Ctrl -> Svc : AddNewProfessor(staffId, courseId, request)
activate Svc

Svc -> Store : Find Course & Professor (by email)
activate Store
Store --> Svc : Data
deactivate Store

alt Professor already exists in same Institute
    Svc -> Store : Assign Professor to Course
    Svc -> Store : Create Notification
    Svc -> DB : SaveChangesAsync()
    Svc --> Ctrl : Success
else Professor exists in another Institute
    Svc -> Store : Create ProfessorInvitation
    Svc -> DB : SaveChangesAsync()
    Svc --> Ctrl : Success (Invitation Sent)
else Professor does not exist
    Svc -> Svc : Generate Password
    Svc -> Store : Create AuthIdentity (Role: Professor)
    Svc -> Store : Create Professor Record
    Svc -> Store : Create ProfessorInvitation
    Svc -> Store : Assign Professor to Course
    Svc -> Email : SendWelcomeEmail(email, password)
    activate Email
    Email --> Svc : OK
    deactivate Email
    Svc -> DB : SaveChangesAsync()
    Svc --> Ctrl : Success (New Account & Invite)
end

deactivate Svc

Ctrl --> User : 200 OK (Processed)
deactivate Ctrl
@enduml
```

---

## 3. Sequence Diagram: Student Joining a Class via Code

This diagram shows how a student joins a class using a unique 6-character class code.

```plantuml
@startuml
actor "Student" as User
participant "StudentSpaceController" as Ctrl
participant "StudentService" as Svc
database "Database" as Store

User -> Ctrl : POST /course/add?classCode=CODE12
activate Ctrl

Ctrl -> Svc : AddStudentToClass(studentId, classCode)
activate Svc

Svc -> Store : Find UniClass by ClassCode
activate Store
Store --> Svc : UniClass / Null
deactivate Store

alt Class not found
    Svc --> Ctrl : Throw InvalidOperationException
    Ctrl --> User : 400 Bad Request ("Invalid class code")
else Student already in a class
    Svc --> Ctrl : Throw InvalidOperationException
    Ctrl --> User : 400 Bad Request ("Already belongs to a class")
else Success
    Svc -> Store : Set student.UniClassId = uniClass.Id
    Svc -> Store : SaveChangesAsync()
    Svc --> Ctrl : Success
    Ctrl --> User : 200 OK ("Student added to class")
end

deactivate Svc
deactivate Ctrl
@enduml
```
