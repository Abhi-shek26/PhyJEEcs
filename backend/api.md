# 👇API Documentation

#### 🌐BASE_URL : http://localhost:PORT

(PORT at which your backend server is running)

## User's API

### 1. SignUp User

#### Request

```
  POST -   BASE_URL/api/user/signup
```

```
{
  "email": "user@example.com",
  "password": "StrongPassword123!",
  "name": "John Doe",
  "year": "12"
}
```

#### ✅ Success Response

```
{
    "email": "user@example.com",
    "token": "your-generated-token",
    "name": "John Doe",
    "year": "12"
}
```

#### ❌Errors

##### i. If email already used

```
{
    "error": "Email already in use"
}
```

##### ii. Password is not strong

```
{
    "error": "Password is not strong enough"
}
```

##### iii. Any Field missing

```
{
    "error": "All fields must be filled"
}
```

### 2. Login User

#### Request

```
POST -  Base_URL/api/user/login
```

```
{
  "email": "user@example.com",
  "password": "StrongPassword123!"
}
```

#### ✅ Success Response

```
{
    "id": "67e84fb57d0aca56e1ee6242",
    "email": "user@example.com",
    "name": "John Doe",
    "year": "12",
    "token": "your-generated-token"
}
```

#### ❌Errors

##### i. Incorrect Password

```
{
    "error": "Incorrect password"
}
```

##### ii. User doesn't exist

```
{
    "error": "Incorrect email"
}
```

##### iii. Any Field missing

```
{
    "error": "All fields must be filled"
}
```

## Question's API

### 1. Upload Question

#### Request

```
  POST -  BASE_URL/api/upload

  Headers-  Authorization: Bearer <token>
```

| Key             | Type   | Value                                                         |
| :-------------- | :----- | :------------------------------------------------------------ |
| `image`         | `File` | **Required**. (upload an image)                               |
| `title`         | `Text` | **Required**. (Question Code)                                 |
| `category`      | `Text` | **Required**. (JEE Mains / JEE Advanced)                      |
| `type`          | `Text` | **Required**. (Single Correct / Multiple Correct / Numerical) |
| `chapter`       | `Text` | **Required**. (eg. Kinematics)                                |
| `correctAnswer` | `Text` | **Required**. (string / array / number)                       |

#### ✅ Success Response

```
{
    "message": "Question uploaded successfully",
    "question": {
        "title": "Ques1",
        "imageUrl": "cloudinary-link of the question image",
        "category": "JEE Mains",
        "type": "Single Correct",
        "chapter": "Kinematics",
        "correctAnswer": "A",
        "_id": "67e85fbd7d0aca56e1ee624c",
        "createdAt": "2025-03-29T21:01:49.188Z",
        "__v": 0
    }
}
```

#### ❌Errors

##### i. No Token

```
{
    "error": "Authorization token required"
}
```

##### ii. Forget to upload Image

```
{
    "error": "Image file is required"
}
```

##### iii. Missed required fields

```
{
    "error": "All fields are required"
}
```

##### iv. Didn't enter correctAnswer a valid number (for numerical type)

```
{
    "error": "Numerical answer must be a valid number"
}
```

##### v. Invalid token

```
{
  "error": "Request is not authorized"
}
```

#### TODO for me

##### I have to work on type of correctAnswer of Single Correct and Multiple Correct .

### 2. Fetch All Questions

#### Request

```
GET -  BASE_URL/api/questions

Headers-  Authorization: Bearer <token>
```

#### ✅ Success Response

```
[
    {
        "_id": "67e86473bf19ab631c839ae5",
        "title": "KMJM1",
        "imageUrl": "cloudinary-link",
        "category": "JEE Mains",
        "type": "Single Correct",
        "chapter": "Kinematics",
        "correctAnswer": "2.5",
        "createdAt": "2025-03-29T21:21:55.872Z",
        "__v": 0
    },
    {
        "_id": "67e862257d0aca56e1ee6258",
        "title": "KMJM2",
        "imageUrl": "Cloudinary-link",
        "category": "JEE Mains",
        "type": "Multiple Correct",
        "chapter": "Kinematics",
        "correctAnswer": [
            "A",
            "B"
        ],
        "createdAt": "2025-03-29T21:12:05.734Z",
        "__v": 0
    },
    .
    .
    .  (All the questions)
]
```

#### ❌Errors

##### i. No Token

```
{
    "error": "Authorization token required"
}
```

##### ii. Invalid token

```
{
  "error": "Request is not authorized"
}
```

### 3. Fetch Questions based on filters

#### Request

```
GET -  BASE_URL/api/questions?chapter=Kinematics&level=JEE Mains&type=Single Correct

Headers-  Authorization: Bearer <token>
```

#### ✅ Success Response

```
[
    {
        "_id": "67e86473bf19ab631c839ae5",
        "title": "KMJM1",
        "imageUrl": "cloudinary-link",
        "category": "JEE Mains",
        "type": "Single Correct",
        "chapter": "Kinematics",
        "correctAnswer": "A",
        "createdAt": "2025-03-29T21:21:55.872Z",
        "__v": 0
    },
    {
        "_id": "67e862257d0aca56e1ee6258",
        "title": "KMJM2",
        "imageUrl": "Cloudinary-link",
        "category": "JEE Mains",
        "type": "Single Correct",
        "chapter": "Kinematics",
        "correctAnswer": "B",
        "createdAt": "2025-03-29T21:12:05.734Z",
        "__v": 0
    },
    .
    .
    . (All questions based on filter)
]
```

#### ❌Errors

##### i. No Token

```
{
    "error": "Authorization token required"
}
```

##### ii. Invalid token

```
{
  "error": "Request is not authorized"
}
```

##### iii. No Questions Found for the Given Filters

```
[]
```

### 4. Attempt Question

#### Request

```
POST - BASE_URL/api/attempt

Headers-  Authorization: Bearer <token>
```

```
{
    "questionId": "67e85fbd7d0aca56e1ee624c",
    "userAnswer": "A",
    "timeTaken": 15 (optional)
}
```

#### ✅ Success Response

```
{
    "message": "Correct Answer!",
    "isCorrect": true
}
```

#### ❌Errors

##### i. No Token

```
{
    "error": "Authorization token required"
}
```

##### ii. User Already Attempted the Question

```
{
    "error": "You have already attempted this question"
}
```

##### iii. If questionId is not correct

```
{
    "error": "Question not found"
}
```

##### iv. Missing Fields (questionID, userAnswer)

```
{
    "error": "Question ID and user answer are required"
}
```

##### v. Invalid Format for Multiple Correct Question

```
{
  "error": "Multiple correct answers must be an array"
}
```

##### vi. Invalid token

```
{
  "error": "Request is not authorized"
}
```

## GET Attempted Questions' API

#### Request

```
GET - BASE_URL/api/attempts/

Headers-  Authorization: Bearer <token>
```

#### ✅ Success Response

```
[
    {
        "_id": "67e70e24350eff0e08d9cc2a",
        "userId": "67e7086d350eff0e08d9cc00",
        "questionId": {
            "_id": "67e70a0d350eff0e08d9cc0c",
            "type": "Multiple Correct",
            "correctAnswer": [
                "A",
                "B"
            ]
        },
        "userAnswer": [
            "B",
            "A"
        ],
        "isCorrect": true,
        "timeTaken": 0,
        "attemptedAt": "2025-03-28T21:01:24.377Z",
        "__v": 0
    },
    {
        "_id": "67e70e5a350eff0e08d9cc34",
        "userId": "67e7086d350eff0e08d9cc00",
        "questionId": {
            "_id": "67e709b9350eff0e08d9cc09",
            "type": "Single Correct",
            "correctAnswer": "A"
        },
        "userAnswer": "D",
        "isCorrect": false,
        "timeTaken": 0,
        "attemptedAt": "2025-03-28T21:02:18.606Z",
        "__v": 0
    },
    .
    .
    . (All attempted Questions by User)

]
```

#### ❌Errors

##### i. No Token

```
{
    "error": "Authorization token required"
}
```

##### ii. Invalid token

```
{
  "error": "Request is not authorized"
}
```

##### iii. No attempts found

```
[]
```

##### will add more APIs ( if required)

## Analytics / Product / AI APIs (merged-domain layer)

All require `Authorization: Bearer <token>`.

```
GET /api/analytics/summary          -> KPIs (accuracy, avgTime, streak), byChapter, byType, byDifficulty, 14-day trend, weakestChapters
GET /api/analytics/funnel           -> me {activated, powerUser, activeDays}; global {users, activationRate, byYear} if isAdmin
GET /api/analytics/recommendations  -> weakestChapters + recommended (un-attempted in weak chapters) + reviewDue (incorrect >3d) + strategy
GET /api/analytics/export.csv       -> CSV download for EDA (attemptedAt, code, chapter, category, type, difficulty, isCorrect, timeTaken)
GET /api/bookmarks / POST /api/bookmarks {questionId}   -> toggle/list bookmarks (product engagement)
GET /api/feedback[?questionId] / POST /api/feedback {questionId, rating 1-5, text} -> quality/NPS signal
GET /api/explain/:id                -> stored solutionText or LLM prompt template (no key committed)
PATCH /api/questions/:id/solution   -> admin stores curated/LLM solution
GET /api/health                     -> { ok: true }
```

Pagination: `GET /api/questions?page&limit&includeAnswers=1&difficulty=` and
`GET /api/attempts?page&limit` return `{ data, page, limit, total }`.
Upload (`POST /api/upload`) is now admin-only (`isAdmin`), accepts `difficulty` + `solutionText`.
