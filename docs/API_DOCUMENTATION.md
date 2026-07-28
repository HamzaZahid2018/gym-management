# API Documentation

## Base URL

```
http://localhost:8000/api
```

## Authentication

All endpoints (except `/auth/` and `/users/login/`, `/users/register/`) require JWT authentication.

### Getting Started

1. **Register or Login**

   ```bash
   curl -X POST http://localhost:8000/api/users/login/ \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@example.com",
       "password": "password"
     }'
   ```

2. **Response**

   ```json
   {
     "user": {
       /* user object */
     },
     "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
   }
   ```

3. **Use Access Token**

   ```bash
   curl -H "Authorization: Bearer {access_token}" \
     http://localhost:8000/api/users/
   ```

4. **Refresh Token When Expired**
   ```bash
   curl -X POST http://localhost:8000/api/auth/token/refresh/ \
     -H "Content-Type: application/json" \
     -d '{"refresh": "refresh_token_here"}'
   ```

---

## Authentication Endpoints

### Login

```
POST /auth/token/
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}

Response (200):
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Refresh Token

```
POST /auth/token/refresh/
Content-Type: application/json

{
  "refresh": "refresh_token_here"
}

Response (200):
{
  "access": "new_access_token"
}
```

### Custom Login with Email

```
POST /users/login/
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

Response (200):
{
  "user": { /* user object */ },
  "access": "access_token",
  "refresh": "refresh_token"
}
```

---

## User/Customer Endpoints

### List Customers

```
GET /users/?page=1
Authorization: Bearer {token}

Response (200):
{
  "count": 100,
  "next": "http://localhost:8000/api/users/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "phone_number": "+1234567890",
      "profile_picture": null,
      "address": "123 Street",
      "join_date": "2024-01-01",
      "membership_type": "monthly",
      "status": "active",
      "is_admin": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### Get Customer Details

```
GET /users/{id}/
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "phone_number": "+1234567890",
  "profile_picture": null,
  "address": "123 Street",
  "join_date": "2024-01-01",
  "membership_type": "monthly",
  "status": "active",
  "is_admin": false,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

### Create Customer

```
POST /users/
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "new_user",
  "email": "new@example.com",
  "password": "securepass123",
  "first_name": "New",
  "last_name": "User",
  "phone_number": "+1111111111",
  "address": "456 Avenue",
  "membership_type": "monthly",
  "status": "active"
}

Response (201):
{
  "id": 2,
  "username": "new_user",
  "email": "new@example.com",
  "first_name": "New",
  "last_name": "User",
  "phone_number": "+1111111111",
  "address": "456 Avenue",
  "membership_type": "monthly",
  "status": "active",
  "created_at": "2024-01-02T00:00:00Z",
  "updated_at": "2024-01-02T00:00:00Z"
}
```

### Update Customer

```
PUT /users/{id}/
Authorization: Bearer {token}
Content-Type: application/json

{
  "first_name": "Updated",
  "phone_number": "+2222222222",
  "status": "inactive"
}

Response (200):
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "first_name": "Updated",
  "last_name": "Doe",
  "phone_number": "+2222222222",
  "status": "inactive",
  "updated_at": "2024-01-03T00:00:00Z"
}
```

### Delete Customer

```
DELETE /users/{id}/
Authorization: Bearer {token}

Response (204): No Content
```

### Get Active Members

```
GET /users/active_members/
Authorization: Bearer {token}

Response (200):
[
  { /* active user objects */ }
]
```

### Get Current User Profile

```
GET /users/me/
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "username": "admin",
  "email": "admin@example.com",
  ...
}
```

---

## Payment Endpoints

### List Payments

```
GET /payments/?page=1&search=email@example.com&ordering=-payment_date
Authorization: Bearer {token}

Query Parameters:
- page: int (page number, default: 1)
- search: string (search by email, first_name, last_name)
- ordering: string (field to order by)

Response (200):
{
  "count": 50,
  "results": [
    {
      "id": 1,
      "customer": 1,
      "customer_details": { /* user object */ },
      "month": 1,
      "month_display": "January",
      "year": 2024,
      "amount": "50.00",
      "payment_status": "paid",
      "payment_method": "cash",
      "payment_date": "2024-01-15T00:00:00Z",
      "due_date": "2024-01-31",
      "notes": "",
      "is_overdue": false,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### Get Payment Details

```
GET /payments/{id}/
Authorization: Bearer {token}

Response (200):
{
  "id": 1,
  "customer": 1,
  "customer_details": { /* user object */ },
  "month": 1,
  "month_display": "January",
  "year": 2024,
  "amount": "50.00",
  "payment_status": "paid",
  "payment_status_display": "Paid",
  "payment_method": "cash",
  "payment_method_display": "Cash",
  "payment_date": "2024-01-15T00:00:00Z",
  "due_date": "2024-01-31",
  "notes": "Payment received",
  "is_overdue": false,
  "days_overdue": 0,
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-15T00:00:00Z"
}
```

### Create Payment

```
POST /payments/
Authorization: Bearer {token}
Content-Type: application/json

{
  "customer": 1,
  "month": 1,
  "year": 2024,
  "amount": "50.00",
  "payment_status": "unpaid",
  "payment_method": "cash",
  "notes": ""
}

Response (201):
{
  "id": 2,
  "customer": 1,
  "month": 1,
  "year": 2024,
  "amount": "50.00",
  "payment_status": "unpaid",
  "payment_method": "cash",
  "payment_date": null,
  "due_date": "2024-01-31",
  "created_at": "2024-01-02T00:00:00Z"
}
```

### Mark Payment as Paid

```
POST /payments/{id}/mark_paid/
Authorization: Bearer {token}
Content-Type: application/json

{
  "payment_method": "card",
  "notes": "Paid online"
}

Response (200):
{
  "id": 1,
  "payment_status": "paid",
  "payment_method": "card",
  "payment_date": "2024-01-03T10:30:00Z",
  "notes": "Paid online",
  "updated_at": "2024-01-03T10:30:00Z"
}
```

### Get Unpaid Payments

```
GET /payments/unpaid/
Authorization: Bearer {token}

Response (200):
[
  { /* unpaid and late payment objects */ }
]
```

### Get Overdue Payments

```
GET /payments/overdue/
Authorization: Bearer {token}

Response (200):
[
  { /* payments past due date */ }
]
```

### Get Payments by Customer

```
GET /payments/by_customer/?customer_id=1
Authorization: Bearer {token}

Response (200):
[
  { /* all payments for customer */ }
]
```

### Get Payments by Month

```
GET /payments/by_month/?month=1&year=2024
Authorization: Bearer {token}

Response (200):
[
  { /* payments for January 2024 */ }
]
```

### Bulk Create Payments

```
POST /payments/bulk_create/
Authorization: Bearer {token}
Content-Type: application/json

{
  "month": 1,
  "year": 2024,
  "amount": "50.00",
  "customer_ids": [1, 2, 3]
}

Response (201):
{
  "created_count": 3,
  "payments": [
    { /* created payment objects */ }
  ]
}
```

### Send Payment Reminders

```
POST /payments/send_reminders/
Authorization: Bearer {token}
Content-Type: application/json

{
  "reminder_type": "email"
}

Response (201):
{
  "count": 5,
  "reminders": [
    {
      "id": 1,
      "payment": 1,
      "customer": 1,
      "customer_email": "john@example.com",
      "reminder_type": "email",
      "sent_at": "2024-01-03T10:30:00Z",
      "status": "sent"
    }
  ]
}
```

---

## Dashboard Endpoints

### Get Overall Statistics

```
GET /dashboard/stats/
Authorization: Bearer {token}

Response (200):
{
  "total_customers": 50,
  "active_members": 40,
  "inactive_members": 10,
  "total_paid_this_month": 2000.00,
  "total_unpaid": 15,
  "overdue_payments": 5
}
```

### Get Membership Breakdown

```
GET /dashboard/membership_breakdown/
Authorization: Bearer {token}

Response (200):
{
  "monthly": 30,
  "quarterly": 15,
  "yearly": 5
}
```

### Get Revenue Statistics

```
GET /dashboard/revenue_stats/
Authorization: Bearer {token}

Response (200):
{
  "total_revenue": 15000.00,
  "monthly_revenue": [
    {
      "month": 1,
      "revenue": 2000.00
    },
    {
      "month": 2,
      "revenue": 2500.00
    }
  ]
}
```

### Get Payment Status Breakdown

```
GET /dashboard/payment_status_breakdown/
Authorization: Bearer {token}

Response (200):
[
  {
    "status": "paid",
    "count": 100,
    "total_amount": 5000.00
  },
  {
    "status": "unpaid",
    "count": 20,
    "total_amount": 1000.00
  },
  {
    "status": "late",
    "count": 5,
    "total_amount": 250.00
  }
]
```

### Get Recent Payments

```
GET /dashboard/recent_payments/
Authorization: Bearer {token}

Response (200):
[
  { /* 10 most recent payments */ }
]
```

### Get New Members

```
GET /dashboard/new_members/
Authorization: Bearer {token}

Response (200):
[
  { /* members joined in last 30 days */ }
]
```

### Get Due Payments

```
GET /dashboard/due_payments/
Authorization: Bearer {token}

Response (200):
[
  { /* payments due in next 7 days */ }
]
```

---

## Error Handling

### Error Response Format

```json
{
  "detail": "Error message",
  "code": "error_code"
}
```

### Common Status Codes

| Code | Meaning                                 |
| ---- | --------------------------------------- |
| 200  | OK - Request successful                 |
| 201  | Created - Resource created successfully |
| 204  | No Content - Successful deletion        |
| 400  | Bad Request - Invalid data              |
| 401  | Unauthorized - Invalid/missing token    |
| 403  | Forbidden - Permission denied           |
| 404  | Not Found - Resource not found          |
| 409  | Conflict - Duplicate entry              |
| 500  | Server Error - Internal error           |

### Example Error Responses

**Invalid Token**

```json
{
  "detail": "Invalid token."
}
```

**Missing Field**

```json
{
  "email": ["This field is required."],
  "password": ["This field is required."]
}
```

**Not Found**

```json
{
  "detail": "Not found."
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, implement:

- 100 requests per minute per user
- 1000 requests per hour per IP

---

## Filtering & Searching

### Search Parameters

```
GET /users/?search=john&ordering=-created_at
GET /payments/?search=email@example.com&ordering=amount
```

### Ordering Options

```
- created_at: Order by creation date
- updated_at: Order by last update
- amount: Order by payment amount
- payment_date: Order by payment date
```

Prefix with `-` for descending order:

```
-created_at: Newest first
-amount: Highest amount first
```

---

## Pagination

Default page size: 10 items

```
GET /users/?page=1
GET /users/?page=2
```

Response includes:

- `count`: Total number of items
- `next`: URL for next page
- `previous`: URL for previous page
- `results`: Array of items

---

## File Upload

### Profile Picture

```
POST /users/
Content-Type: multipart/form-data

{
  "username": "user",
  "email": "user@example.com",
  "profile_picture": <binary_image_data>
}
```

Supported formats: JPG, PNG, GIF, WebP
Max size: 5MB

---

## Best Practices

1. **Always include Authorization header**

   ```
   Authorization: Bearer {access_token}
   ```

2. **Handle token expiration**
   - Check for 401 responses
   - Refresh token automatically
   - Redirect to login if refresh fails

3. **Validate input data**
   - Check field requirements
   - Validate email format
   - Validate phone number format

4. **Handle errors gracefully**
   - Display user-friendly error messages
   - Log errors for debugging
   - Retry on temporary failures

5. **Use proper HTTP methods**
   - GET: Retrieve data
   - POST: Create data
   - PUT: Update data
   - DELETE: Delete data

---

## Example cURL Commands

### Login

```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

### Get Customers

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/users/
```

### Create Payment

```bash
curl -X POST http://localhost:8000/api/payments/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "customer": 1,
    "month": 1,
    "year": 2024,
    "amount": "50.00",
    "payment_status": "unpaid",
    "payment_method": "cash"
  }'
```

### Get Dashboard Stats

```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/dashboard/stats/
```

---

## Version History

| Version | Date       | Changes         |
| ------- | ---------- | --------------- |
| 1.0.0   | 2024-01-01 | Initial release |

---

## Support

For API issues or questions:

1. Check this documentation
2. Review backend README
3. Check error messages and logs
4. Contact development team
