## Application Setup

To set up and run the application, follow these steps:

1. **Clone the repository from GitHub:**

   ```
   git clone <repository_url>
   ```

2. **Navigate to the project directory:**

   ```
   cd Library-Management-System
   ```

3. **Install the required dependencies:**

   ```
   npm install
   ```

4. **Set up the database connection:**

   - Update the configuration file with your database credentials.

5. **Run the database migrations:**

   - In DEV
     ```
     npm run migrate-dev
     ```
   - In PROD
     ```
     npm run migrate-prod
     ```

6. **Start the application:**
   - In DEV
     ```
     npm run dev
     ```
   - In PROD
     ```
     npm start
     ```

## API Endpoints

### /api/v1/books

- **Method:** GET
- **Description:** Retrieves a list of all books in the library.
- **Expected Input:** None
- **Expected Output:** An array of book objects.

### /api/v1/books/:id

- **Method:** GET
- **Description:** Retrieves a specific book by its ID.
- **Expected Input:** The ID of the book as a URL parameter.
- **Expected Output:** The book object with the specified ID.

### /api/v1/books

- **Method:** POST
- **Description:** Creates a new book in the library.
- **Expected Input:** A JSON object containing the book details (title, author, etc.).
- **Expected Output:** The newly created book object.

### /api/v1/books/:id

- **Method:** PUT
- **Description:** Updates an existing book in the library.
- **Expected Input:** The ID of the book as a URL parameter and a JSON object containing the updated book details.
- **Expected Output:** The updated book object.

### /api/v1/books/:id

- **Method:** DELETE
- **Description:** Deletes a book from the library.
- **Expected Input:** The ID of the book as a URL parameter.
- **Expected Output:** None

### /api/v1/users

- **Method:** GET
- **Description:** Retrieves a list of all users.
- **Expected Input:** None
- **Expected Output:** An array of user objects.

---

- **Method:** POST
- **Description:** Create user.
- **Expected Input:** User Name ,User Email ,User password , User Email
- **Expected Output:** An array of user objects.

### /api/v1/users/:id

- **Method:** GET
- **Description:** Retrieves a specific user by their ID.
- **Expected Input:** The ID of the user as a URL parameter.
- **Expected Output:** The user object with the specified ID.

### /api/v1/users/me

- **Method:** GET
- **Description:** Retrieves the current user.
- **Expected Input:** None
- **Expected Output:** The user object for the authenticated user.

### /api/v1/users/me

- **Method:** PUT
- **Description:** Updates the current user.
- **Expected Input:** A JSON object containing the updated user details.
- **Expected Output:** The updated user object.

### /api/v1/users/:id

- **Method:** PUT
- **Description:** Updates an existing user by their ID.
- **Expected Input:** The ID of the user as a URL parameter and a JSON object containing the updated user details.
- **Expected Output:** The updated user object.

### /api/v1/users/:id

- **Method:** DELETE
- **Description:** Deletes a user by their ID.
- **Expected Input:** The ID of the user as a URL parameter.
- **Expected Output:** None

### /api/v1/borrowing/checkout

- **Method:** POST
- **Description:** Initiates the borrowing process to check out a book.
- **Expected Input:** A JSON object containing the book ID.
- **Expected Output:** None

### /api/v1/borrowing/return

- **Method:** PUT
- **Description:** Initiates the return process for a borrowed book.
- **Expected Input:** A JSON object containing the book ID.
- **Expected Output:** None

### /api/v1/borrowing/me

- **Method:** GET
- **Description:** Retrieves a list of books currently borrowed by the authenticated user.
- **Expected Input:** None
- **Expected Output:** An array of borrowed book objects.

### /api/v1/borrowing/overdue

- **Method:** GET
- **Description:** Retrieves a list of all overdue borrowed books.
- **Expected Input:** None
- **Expected Output:** An array of overdue borrowed book objects.

### /api/v1/borrowing/overdue/me

- **Method:** GET
- **Description:** Retrieves a list of overdue borrowed books for the authenticated user.
- **Expected Input:** None
- **Expected Output:** An array of overdue borrowed book objects.

### /api/v1/borrowing/inPeriod

- **Method:** GET
- **Description:** Retrieves a list of borrowed books within a specified period.
- **Expected Input:** A JSON object containing start and end dates.
- **Expected Output:** An array of borrowed book objects.

### /api/v1/borrowing/inPeriodxlsx

- **Method:** GET
- **Description:** Retrieves a list of borrowed books within a specified period.
- **Expected Input:** A JSON object containing start and end dates.
- **Expected Output:** An Xlsx file borrowed book.

### /api/v1/borrowing/lastMonth

- **Method:** GET
- **Description:** Retrieves a list of borrowed books from the last month.
- **Expected Input:** None
- **Expected Output:** An array of borrowed book objects.

### /api/v1/borrowing/lastMonth

- **Method:** GET
- **Description:** Retrieves a list of borrowed books from the last month.
- **Expected Input:** None
- **Expected Output:** An Xlsx file borrowed book.

### /api/v1/borrowing/overdue/lastMonth

- **Method:** GET
- **Description:** Retrieves a list of overdue borrowed books from the last month.
- **Expected Input:** None
- **Expected Output:** An array of overdue borrowed book objects.

### /api/v1/borrowing/overdue/lastMonth

- **Method:** GET
- **Description:** Retrieves a list of overdue borrowed books from the last month.
- **Expected Input:** None
- **Expected Output:** An Xlsx file of overdue borrowed book .

### /api/v1/borrowing/overdue/:id

- **Method:** GET
- **Description:** Retrieves overdue borrowed books by user ID.
- **Expected Input:** The user ID as a URL parameter.
- **Expected Output:** An array of overdue borrowed book objects for the specified user.

### /api/v1/borrowing/:id

- **Method:** GET
- **Description:** Retrieves borrowed books by user ID.
- **Expected Input:** The user ID as a URL parameter.
- **Expected Output:** An array of borrowed book objects for the specified user.

## Authentication
### /api/v1/auth
### Email

#### Signup
### /api/v1/auth/signup

- **Method:** POST
- **Description:** Registers a new user.
- **Expected Input:** A JSON object containing user details (name, email, password).
- **Expected Output:** None

#### Signin
### /api/v1/auth/signin

- **Method:** POST
- **Description:** Logs in a user.
- **Expected Input:** A JSON object containing user credentials (email, password).
- **Expected Output:** None

#### Signout
### /api/v1/auth/signout

- **Method:** POST
- **Description:** Logs out the authenticated user.
- **Expected Input:** None
- **Expected Output:** None

#### Change Password
### /api/v1/auth/changePassword

- **Method:** PUT
- **Description:** Changes the password for the authenticated user.
- **Expected Input:** A JSON object containing the old and new passwords.
- **Expected Output:** None

### Forget Password

#### Forget Password
### /api/v1/auth/forgetPassword

- **Method:** POST
- **Description:** Initiates the forget password process by sending a reset code to the user's email.
- **Expected Input:** A JSON object containing the user's email.
- **Expected Output:** None

#### Reset Password
### /api/v1/auth/resetPassword

- **Method:** PATCH
- **Description:** Resets the user's password using the provided reset code.
- **Expected Input:** A JSON object containing the reset code and new password.
- **Expected Output:** None

Please note that these endpoints and their expected inputs/outputs are subject to change based on the development progress and requirements.

## Copyright 2024 oa147

- Licensed under the Apache License, Version 2.0 (the "License");
- you may not use this file except in compliance with the License.
- You may obtain a copy of the License at  http://www.apache.org/licenses/LICENSE-2.0 

- Unless required by applicable law or agreed to in writing, software
- distributed under the License is distributed on an "AS IS" BASIS,
- WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
- See the License for the specific language governing permissions and
- limitations under the License.