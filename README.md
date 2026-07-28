# 💪 Gym Management System

A production-ready, full-stack web application for managing gym customers, tracking monthly payments, and providing analytics through an intuitive admin dashboard.

## 🎯 Features

### Backend (Django + DRF)

- ✅ User/Customer management with custom user model
- ✅ JWT-based authentication with token refresh
- ✅ Payment tracking and status management
- ✅ Automatic monthly payment creation
- ✅ Auto-mark late payments system
- ✅ Payment reminders
- ✅ Comprehensive analytics and dashboards
- ✅ Role-based access control
- ✅ Admin panel with full CRUD operations
- ✅ PostgreSQL database with proper indexing

### Frontend (Next.js + React)

- ✅ Modern, responsive admin dashboard
- ✅ JWT token management with auto-refresh
- ✅ Customer management (CRUD)
- ✅ Payment recording and tracking
- ✅ Interactive charts (Revenue, Payment status)
- ✅ Real-time search and filtering
- ✅ Mobile-responsive design
- ✅ Tailwind CSS styling
- ✅ Context API for state management
- ✅ Error handling and loading states

---

## 📋 System Architecture

```
┌─────────────────┐
│  React/Next.js  │
│  Admin Dashboard│
│   (Port 3000)   │
└────────┬────────┘
         │ HTTP/HTTPS
         │ JWT Token
         │
┌────────▼────────────────┐
│   Django REST API       │
│   (Port 8000)           │
│  ├─ Authentication      │
│  ├─ Users/Customers     │
│  ├─ Payments            │
│  └─ Analytics Dashboard │
└────────┬────────────────┘
         │
         │
┌────────▼────────────────┐
│   PostgreSQL Database   │
│                         │
│  ├─ Users              │
│  ├─ Payments           │
│  ├─ PaymentReminders   │
│  └─ Historical Data    │
└─────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+ (Backend)
- Node.js 16+ (Frontend)
- PostgreSQL 12+
- Git

### 1️⃣ Clone & Setup Backend

```bash
cd gym\ management/backend

# Create virtual environment
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Create database
createdb gym_management

# Run migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Start backend server
python manage.py runserver
```

Backend will be running at: **http://localhost:8000**

### 2️⃣ Setup Frontend

```bash
cd gym\ management/frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Update NEXT_PUBLIC_API_URL if backend is on different URL

# Start development server
npm run dev
```

Frontend will be running at: **http://localhost:3000**

### 3️⃣ Access the Application

1. Open **http://localhost:3000** in your browser
2. Login with credentials created in superuser step
3. Explore the dashboard!

---

## 📖 Documentation

### Backend

See [backend/README.md](backend/README.md) for:

- Detailed API endpoints
- Database schema
- Authentication details
- Management commands
- Deployment instructions

### Frontend

See [frontend/README.md](frontend/README.md) for:

- Page structure
- Component documentation
- Styling guide
- State management
- Production build

---

## 🔐 Default Credentials

After setup, use the credentials you created with `createsuperuser`:

**Example:**

```
Email: admin@example.com
Password: admin@123
```

---

## 📊 API Endpoints Reference

### Authentication

```
POST   /api/auth/token/              - Get access token
POST   /api/auth/token/refresh/      - Refresh token
```

### Users

```
GET    /api/users/                   - List customers
POST   /api/users/                   - Create customer
GET    /api/users/{id}/              - Get customer
PUT    /api/users/{id}/              - Update customer
DELETE /api/users/{id}/              - Delete customer
POST   /api/users/login/             - Login
POST   /api/users/register/          - Register
GET    /api/users/active_members/    - Get active members
```

### Payments

```
GET    /api/payments/                - List payments
POST   /api/payments/                - Create payment
GET    /api/payments/{id}/           - Get payment
PUT    /api/payments/{id}/           - Update payment
DELETE /api/payments/{id}/           - Delete payment
GET    /api/payments/unpaid/         - Get unpaid payments
GET    /api/payments/overdue/        - Get overdue payments
POST   /api/payments/{id}/mark_paid/ - Mark as paid
POST   /api/payments/bulk_create/    - Bulk create
POST   /api/payments/send_reminders/ - Send reminders
```

### Dashboard

```
GET    /api/dashboard/stats/                   - Overall stats
GET    /api/dashboard/membership_breakdown/    - Member types
GET    /api/dashboard/revenue_stats/           - Revenue data
GET    /api/dashboard/payment_status_breakdown/- Payment status
GET    /api/dashboard/recent_payments/        - Recent payments
GET    /api/dashboard/new_members/            - New members
```

---

## 🗄️ Database Models

### User Model

```python
- id (PK)
- username
- email
- password (hashed)
- first_name
- last_name
- phone_number
- profile_picture (optional)
- address
- join_date
- membership_type (monthly, quarterly, yearly)
- status (active, inactive, suspended)
- is_admin
- created_at
- updated_at
```

### Payment Model

```python
- id (PK)
- customer (FK to User)
- month (1-12)
- year
- amount
- payment_status (paid, unpaid, late, pending)
- payment_method (cash, card, online, cheque)
- payment_date
- due_date
- notes
- created_at
- updated_at
```

### PaymentReminder Model

```python
- id (PK)
- payment (FK to Payment)
- customer (FK to User)
- reminder_type (email, sms, whatsapp)
- sent_at
- status (sent, failed, delivered)
```

---

## 🔧 Management Commands

### Create Monthly Payments

Automatically creates payment records for all active members:

```bash
python manage.py create_monthly_payments
```

### Mark Late Payments

Auto-mark unpaid payments as late if past due date:

```bash
python manage.py mark_late_payments
```

### Schedule with Celery (Optional)

```python
# celery.py - Add periodic tasks
from celery.schedules import crontab

app.conf.beat_schedule = {
    'create-monthly-payments': {
        'task': 'payments.tasks.create_monthly_payments',
        'schedule': crontab(hour=0, minute=0, day_of_month=1),
    },
}
```

---

## 📁 Project Structure

```
gym-management/
├── backend/                    ← Django REST API
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── gym_management/         (Main Django project)
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── users/                  (Customer management)
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── urls.py
│   │   └── admin.py
│   ├── payments/               (Payment tracking)
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── views.py
│   │   ├── signals.py
│   │   ├── urls.py
│   │   ├── admin.py
│   │   └── management/commands/
│   ├── dashboard/              (Analytics)
│   │   ├── views.py
│   │   └── urls.py
│   └── fixtures/               (Sample data scripts)
│
├── frontend/                   ← Next.js Admin Dashboard
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   ├── .env.example
│   ├── pages/
│   │   ├── index.js            (Home redirect)
│   │   ├── login.js            (Login page)
│   │   ├── dashboard.js        (Main dashboard)
│   │   ├── customers.js        (Customer management)
│   │   ├── payments.js         (Payment management)
│   │   ├── _app.js             (App wrapper)
│   │   └── _document.js        (HTML template)
│   ├── components/
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── lib/
│   │   ├── api.js              (Axios setup)
│   │   └── services.js         (API calls)
│   └── styles/
│
├── frontend_legacy/            ← Static HTML/JS (fallback frontend)
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── customers.html
│   ├── payments.html
│   ├── register.html
│   ├── css/
│   └── js/
│
├── docs/                       ← All documentation
│   ├── API_DOCUMENTATION.md
│   ├── DEVELOPMENT_GUIDE.md
│   ├── QUICK_START.md
│   └── ...
│
├── scripts/                    ← Utility scripts
│   ├── START_GYM_SYSTEM.bat
│   └── CHECK_SYSTEM.bat
│
├── .gitignore
├── install.sh
└── README.md
```

---

## 🔒 Security Features

### Backend

- ✅ Django security middleware
- ✅ CSRF protection
- ✅ SQL injection prevention (ORM)
- ✅ XSS protection
- ✅ JWT token-based authentication
- ✅ Password hashing (PBKDF2)
- ✅ CORS configuration
- ✅ HTTPS support (production)
- ✅ Secret key management

### Frontend

- ✅ JWT token in localStorage
- ✅ Auto-logout on token expiry
- ✅ Protected routes
- ✅ Error boundary handling
- ✅ Input validation
- ✅ XSS protection

---

## 📦 Production Deployment

### Backend (Gunicorn + Nginx)

```bash
# Install production dependencies
pip install gunicorn whitenoise

# Collect static files
python manage.py collectstatic --noinput

# Run with Gunicorn
gunicorn --workers 4 --bind 0.0.0.0:8000 gym_management.wsgi
```

### Frontend (Vercel or Self-hosted)

#### Option 1: Vercel (Recommended)

```bash
npm install -g vercel
vercel deploy
```

#### Option 2: Self-hosted (Node.js)

```bash
npm run build
npm start
```

### Environment Variables for Production

**Backend (.env)**

```
DEBUG=False
SECRET_KEY=<random-secure-key>
DB_HOST=<production-db-host>
DB_NAME=<production-db-name>
DB_USER=<production-db-user>
DB_PASSWORD=<strong-password>
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
```

**Frontend (.env.production)**

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

---

## 🧪 Testing

### Backend Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test users

# With coverage report
pip install coverage
coverage run --source='.' manage.py test
coverage report
```

### Frontend Tests

```bash
# Install testing libraries
npm install --save-dev @testing-library/react

# Run tests
npm test
```

---

## 🐛 Troubleshooting

### Backend Issues

#### PostgreSQL Connection Error

```bash
# Check if PostgreSQL is running
psql -U postgres

# Create database if not exists
createdb gym_management
```

#### Migration Issues

```bash
# Show pending migrations
python manage.py showmigrations

# Make new migrations
python manage.py makemigrations

# Migrate specific app
python manage.py migrate users
```

#### Port Already in Use

```bash
# Use different port
python manage.py runserver 8001
```

### Frontend Issues

#### CORS Errors

- Ensure backend has correct CORS settings
- Check `CORS_ALLOWED_ORIGINS` in Django settings
- Verify frontend URL is in the list

#### API Connection Failed

- Check backend is running
- Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- Check network tab in browser DevTools

#### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
npm install

# Rebuild
npm run build
```

---

## 📚 Learning Resources

### Django & DRF

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Django ORM Guide](https://docs.djangoproject.com/en/stable/topics/db/)

### React & Next.js

- [React Documentation](https://react.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

### Database

- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [SQL Tutorial](https://www.w3schools.com/sql/)

### Security

- [OWASP Security](https://owasp.org/)
- [JWT.io](https://jwt.io/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is provided as-is for educational and commercial purposes.

---

## ✅ Checklist for Production

- [ ] Update SECRET_KEY in production
- [ ] Set DEBUG=False
- [ ] Configure ALLOWED_HOSTS
- [ ] Setup PostgreSQL production database
- [ ] Configure HTTPS/SSL certificates
- [ ] Setup email backend for notifications
- [ ] Configure backup strategy
- [ ] Setup monitoring and logging
- [ ] Configure payment gateway (optional)
- [ ] Setup automated backups
- [ ] Configure CDN for static files
- [ ] Setup monitoring alerts
- [ ] Document deployment process

---

## 📧 Support & Contact

For issues, questions, or suggestions:

1. Check documentation in [backend/README.md](backend/README.md) and [frontend/README.md](frontend/README.md)
2. Review project structure and code comments
3. Check troubleshooting section above

---

## 🎉 Welcome!

Thank you for using the Gym Management System! Start managing your gym more efficiently today.

**Happy coding! 💻**
