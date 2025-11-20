Subscription Tracking API

A simple REST API to manage user subscriptions:
•  User signup / login / logout (JWT)
•  CRUD for subscriptions
•  Basic user management
•  Daily cron job to send renewal reminders

1. Tech Stack
•  Node.js, Express
•  MongoDB (Mongoose)
•  JWT for authentication
•  Node-cron for daily reminder jobs
•  Nodemailer / Resend for emails

2. Getting Started
2.1 Install
   npm install
   
2.2 Environment Variables
Create a .env file in the project root (or update the one you have).  
At minimum, you’ll need:
PORT=3000
MONGO_URI=mongodb://localhost:27017/subscription-tracker
JWT_SECRET=your_jwt_secret
COOKIE_SECRET=your_cookie_secret

# Email config (example – adjust to your provider)
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...

2.3 Run the Server(with nodemon):
npm run dev

3. Authentication
Base path: /api/v1/auth
All protected routes use Authorization: Bearer <JWT_TOKEN>.

3.1 Sign Up

•  POST /api/v1/auth/sign-up
•  Body (JSON example):
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "secret123"
  }

  3.2 Sign In

•  POST /api/v1/auth/sign-in
•  Body:
  {
    "email": "john@example.com",
    "password": "secret123"
  }

  •  Returns a JWT (used for other protected routes).

3.3 Logout

•  POST /api/v1/auth/logout
•  Headers: Authorization: Bearer <token>

4. User Routes

Base path: /api/v1/user

4.1 Get All Users

•  GET /api/v1/user/
•  Typically used for admin or debugging.

4.2 Get Single User

•  GET /api/v1/user/:userId
•  Protected: requires JWT
•  Returns user info for the given userId.

4.3 Delete User

•  DELETE /api/v1/user/:userId
•  Protected: requires JWT
•  Deletes the specified user.

4.4 Edit User

•  PATCH /api/v1/user/:userId
•  Protected: requires JWT
•  Body: any fields you allow to update (e.g. name, email).

5. Subscription Routes

Base path: /api/v1/subscriptions  
All subscription routes use authMiddleware (JWT required).

5.1 Get All Subscriptions for a User

•  GET /api/v1/subscriptions/user/:userId
•  Returns all subscriptions of that user.

5.2 Create Subscription for a User

•  POST /api/v1/subscriptions/user/:userId
•  Body (example):
  {
    "name": "Netflix",
    "price": 9.99,
    "billingCycle": "monthly",
    "nextRenewalDate": "2025-12-01"
  }

  5.3 Get / Update / Delete Subscription by ID

•  GET /api/v1/subscriptions/user/:userId
•  (You may be using this to fetch a specific subscription along with user ID.)
•  PATCH /api/v1/subscriptions/:subscriptionId
•  Update subscription fields (price, date, etc.).
•  DELETE /api/v1/subscriptions/:subscriptionId
•  Delete a subscription.

5.4 Cancel Subscription

•  PATCH /api/v1/subscriptions/:subscriptionId/cancel
•  Marks a subscription as cancelled (exact behavior defined in controller).

5.5 Test Renewal Reminder Job

•  GET /api/v1/subscriptions/test-remainder
•  Protected: uses authMiddleware
•  Manually triggers the renewal reminder job (for testing emails / logs).

6. Cron Job (Renewal Reminder)

A daily cron job runs inside app.js:

•  Time: every day at 09:00 UTC
•  Task: sendRenewalRemainders():
•  Finds subscriptions close to renewal date
•  Sends reminder emails

You can adjust schedule and timezone in app.js if needed.
This is the minimal documentation: how to install, run, and the main API routes.  
