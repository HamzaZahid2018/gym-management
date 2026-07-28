# Gym Management System - Backend Setup

## Project Overview

This is a production-ready Django + Django REST Framework backend for a Gym Management System. It handles customer management, payment tracking, and provides analytics endpoints.

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- PostgreSQL 12+
- pip / virtualenv

### 1. Setup Virtual Environment

```bash
# Create virtual environment
python -m venv env

# Activate environment
# On Windows:
env\Scripts\activate
# On Mac/Linux:
source env/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Configuration

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Update `.env` with your configuration:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
DB_ENGINE=django.db.backends.postgresql
DB_NAME=gym_management
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

### 4. Database Setup

```bash
# Create PostgreSQL database
createdb gym_management

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser
```

### 5. Run Development Server

```bash
python manage.py runserver
```

Server will be available at: `http://localhost:8000`

---

## 📁 Project Structure

```
gym_management/
├── manage.py                 # Django management script
├── requirements.txt          # Python dependencies
├── .env.example             # Environment variables template
├── gym_management/          # Main project config
│   ├── settings.py          # Settings
│   ├── urls.py              # URL routing
│   └── wsgi.py              # WSGI config
├── users/                   # User/Customer app
│   ├── models.py            # User model
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # ViewSets
│   └── admin.py             # Admin configuration
├── payments/                # Payment tracking app
│   ├── models.py            # Payment & PaymentReminder models
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # Payment ViewSet
│   ├── signals.py           # Business logic
│   └── management/
│       └── commands/
│           ├── create_monthly_payments.py
│           └── mark_late_payments.py
└── dashboard/               # Analytics app
    ├── views.py             # Dashboard ViewSet
    └── urls.py              # Routes
```

---

## 📡 API Endpoints

### Authentication

- `POST /api/auth/token/` - Get JWT access token
- `POST /api/auth/token/refresh/` - Refresh access token

### Users/Customers

- `GET /api/users/` - List all customers (paginated)
- `POST /api/users/` - Create new customer
- `GET /api/users/{id}/` - Get customer details
- `PUT /api/users/{id}/` - Update customer
- `DELETE /api/users/{id}/` - Delete customer
- `GET /api/users/active_members/` - Get active members
- `GET /api/users/inactive_members/` - Get inactive members
- `GET /api/users/me/` - Get current user profile
- `POST /api/users/login/` - Custom login endpoint
- `POST /api/users/register/` - User registration

### Payments

- `GET /api/payments/` - List all payments (paginated)
- `POST /api/payments/` - Create payment
- `GET /api/payments/{id}/` - Get payment details
- `PUT /api/payments/{id}/` - Update payment
- `DELETE /api/payments/{id}/` - Delete payment
- `GET /api/payments/unpaid/` - Get unpaid payments
- `GET /api/payments/overdue/` - Get overdue payments
- `GET /api/payments/by_customer/?customer_id=1` - Get payments by customer
- `GET /api/payments/by_month/?month=1&year=2024` - Get payments by month
- `POST /api/payments/{id}/mark_paid/` - Mark payment as paid
- `POST /api/payments/bulk_create/` - Bulk create payments
- `POST /api/payments/send_reminders/` - Send payment reminders

### Dashboard

- `GET /api/dashboard/stats/` - Overall statistics
- `GET /api/dashboard/membership_breakdown/` - Members by membership type
- `GET /api/dashboard/revenue_stats/` - Monthly revenue data
- `GET /api/dashboard/payment_status_breakdown/` - Payment status breakdown
- `GET /api/dashboard/recent_payments/` - 10 recent payments
- `GET /api/dashboard/new_members/` - New members (last 30 days)
- `GET /api/dashboard/due_payments/` - Due payments (next 7 days)

---

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication:

1. **Login** to get tokens:

```bash
curl -X POST http://localhost:8000/api/auth/token/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

2. **Include token** in requests:

```bash
curl -H "Authorization: Bearer {access_token}" \
  http://localhost:8000/api/users/
```

3. **Refresh token** when expired:

```bash
curl -X POST http://localhost:8000/api/auth/token/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"{refresh_token}"}'
```

---

## 🗄️ Database Models

### User Model

- Extends Django's AbstractUser
- Fields: email, phone_number, profile_picture, address, join_date, membership_type, status
- Supports custom admin users

### Payment Model

- Customer (FK)
- Month, Year, Amount
- Payment Status (Paid, Unpaid, Late)
- Payment Method (Cash, Card, Online, Cheque)
- Due Date (auto-calculated)
- Timestamps

### PaymentReminder Model

- Payment (FK)
- Customer (FK)
- Reminder Type (Email, SMS, WhatsApp)
- Status (Sent, Failed, Delivered)

---

## 📊 Business Logic

### Auto-Create Monthly Payments

```bash
python manage.py create_monthly_payments
```

Creates payment records for all active members for the current month.

### Mark Late Payments

```bash
python manage.py mark_late_payments
```

Automatically marks unpaid payments as late if past due date.

---

## 🧪 Testing

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users

# Run with coverage
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

---

## 📦 Admin Panel

Access Django admin at: `http://localhost:8000/admin`

Default credentials (after createsuperuser):

- Username: admin
- Password: (as set during createsuperuser)

---

## 🚀 Production Deployment

### 1. Environment Variables

Set `DEBUG=False` and configure real database

### 2. Static Files

```bash
python manage.py collectstatic --noinput
```

### 3. Database Migrations

```bash
python manage.py migrate
```

### 4. Security Settings

- Set `SECRET_KEY` to a random value
- Configure `ALLOWED_HOSTS`
- Enable HTTPS
- Set `SECURE_SSL_REDIRECT=True`

### 5. Gunicorn Server

```bash
pip install gunicorn
gunicorn gym_management.wsgi --bind 0.0.0.0:8000
```

---

## 📝 Sample Data

Create sample data for testing:

```bash
# Create admin user
python manage.py createsuperuser

# Create test customers
python manage.py shell
>>> from users.models import User
>>> User.objects.create_user(
...     username='john_doe',
...     email='john@example.com',
...     password='pass123',
...     first_name='John',
...     last_name='Doe',
...     phone_number='+1234567890',
...     membership_type='monthly',
...     status='active'
... )
```

---

## 🔧 Configuration

### CORS Settings

Configure allowed origins in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
]
```

### JWT Configuration

Tokens expire after:

- Access: 1 hour
- Refresh: 7 days

Modify in `settings.py` if needed.

---

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
psql -U postgres

# Create database manually
createdb gym_management
```

### Migration Issues

```bash
# Make migrations
python manage.py makemigrations

# Show pending migrations
python manage.py showmigrations
```

### Port Already in Use

```bash
# Use different port
python manage.py runserver 8001
```

---

## 📚 API Documentation

API documentation available at `/api/docs` (install drf-spectacular):

```bash
pip install drf-spectacular
```

Add to `INSTALLED_APPS` and configure URLs.

---

## 📧 Support

For issues or questions:

1. Check the [Django Docs](https://docs.djangoproject.com/)
2. Check [DRF Docs](https://www.django-rest-framework.org/)
3. Check existing issues in project repository

---

## 📄 License

This project is provided as-is for educational purposes.
