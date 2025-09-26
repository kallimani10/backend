# Course Registration Backend API

A Node.js/Express backend for course registration with payment processing.

## Features

- Course registration with MongoDB storage
- Cashfree payment gateway integration
- Email notifications (registration & payment confirmation)
- RESTful API endpoints
- CORS enabled for frontend integration

## API Endpoints

- `POST /api/register` - Register for a course
- `POST /api/create-order` - Create payment order
- `GET /api/order-status/:order_id` - Check payment status
- `POST /api/check-payment-status` - Manual payment status check
- `POST /api/webhook/cashfree` - Cashfree webhook handler

## Environment Variables

Create a `.env` file with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_API_VERSION=2023-08-01
CASHFREE_BASE=https://sandbox.cashfree.com/pg
CLIENT_ORIGIN=http://localhost:3000
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Production

```bash
npm start
```

## Deployment

This backend is configured for deployment on Render.com:

1. Set Root Directory to `server`
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Add all environment variables in Render dashboard

