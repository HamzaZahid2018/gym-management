# Quick Start Checklist

Complete this checklist to get the system up and running.

## ✅ Pre-Setup

- [ ] Python 3.9+ installed
- [ ] Node.js 16+ installed
- [ ] PostgreSQL 12+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## ✅ Backend Setup (5-10 minutes)

```bash
# 1. Navigate to backend
cd "d:/gym management/backend"

# 2. Create virtual environment
python -m venv env
env\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Setup PostgreSQL
# Create database: gym_management
# User: postgres

# 5. Configure environment
# Copy .env.example to .env
# Update with your database credentials

# 6. Run migrations
python manage.py migrate

# 7. Create superuser
python manage.py createsuperuser
# Email: admin@example.com
# Password: admin@123

# 8. Create sample data
python manage.py shell < fixtures/populate_db.py

# 9. Start server
python manage.py runserver
# Backend at: http://localhost:8000
```

## ✅ Frontend Setup (3-5 minutes)

```bash
# 1. Open new terminal, navigate to frontend
cd "d:/gym management/frontend"

# 2. Install dependencies
npm install

# 3. Configure environment
# Copy .env.example to .env.local
# NEXT_PUBLIC_API_URL=http://localhost:8000/api

# 4. Start development server
npm run dev
# Frontend at: http://localhost:3000
```

## ✅ First Login

1. Open http://localhost:3000
2. Click "Login"
3. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin@123`
4. Explore the dashboard!

## ✅ Test Features

### Dashboard

- [ ] View statistics
- [ ] Check charts
- [ ] View recent payments
- [ ] See new members

### Customers

- [ ] View all customers
- [ ] Search customers
- [ ] Add new customer
- [ ] Edit customer details
- [ ] Delete customer

### Payments

- [ ] View all payments
- [ ] Filter by status
- [ ] Record new payment
- [ ] Mark payment as paid
- [ ] View payment details

## ✅ Common Tasks

### Create Monthly Payments

```bash
python manage.py create_monthly_payments
```

### Mark Late Payments

```bash
python manage.py mark_late_payments
```

### Run Tests

```bash
python manage.py test
```

### Access Admin Panel

```
http://localhost:8000/admin
Login with: admin@example.com / admin@123
```

## ✅ Troubleshooting

| Issue                   | Solution                                                    |
| ----------------------- | ----------------------------------------------------------- |
| Port 8000 in use        | `python manage.py runserver 8001`                           |
| Database error          | Check PostgreSQL is running and .env is correct             |
| CORS error              | Ensure backend is running                                   |
| API connection fails    | Check NEXT_PUBLIC_API_URL in .env.local                     |
| Build errors (frontend) | `rm -rf .next node_modules && npm install && npm run build` |

## ✅ Documentation Files

Read these in order:

1. [README.md](README.md) - Overview
2. [backend/README.md](backend/README.md) - Backend guide
3. [frontend/README.md](frontend/README.md) - Frontend guide
4. [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
5. [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) - Advanced setup

## ✅ Project Structure

```
gym management/
├── README.md                 (Start here!)
├── API_DOCUMENTATION.md      (API reference)
├── DEVELOPMENT_GUIDE.md      (Advanced setup)
├── backend/                  (Django API)
│   ├── manage.py
│   ├── requirements.txt
│   ├── gym_management/
│   ├── users/
│   ├── payments/
│   ├── dashboard/
│   ├── fixtures/
│   └── README.md
└── frontend/                 (React/Next.js)
    ├── package.json
    ├── pages/
    ├── components/
    ├── context/
    ├── lib/
    ├── styles/
    └── README.md
```

## ✅ Useful Commands

### Backend

```bash
# Run migrations
python manage.py migrate

# Create migrations
python manage.py makemigrations

# Open Django shell
python manage.py shell

# Run tests
python manage.py test

# Create superuser
python manage.py createsuperuser

# Access admin
python manage.py createsuperuser
# Then visit http://localhost:8000/admin

# Collect static files
python manage.py collectstatic --noinput

# Backup database
python manage.py dumpdata > backup.json

# Restore database
python manage.py loaddata backup.json
```

### Frontend

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## ✅ Next Steps

1. **Explore the API**
   - Use Postman or cURL to test endpoints
   - Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md)

2. **Customize for Your Gym**
   - Update colors/branding
   - Modify payment amounts
   - Add your gym's information

3. **Deploy to Production**
   - Read [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md)
   - Choose hosting platform (Heroku, AWS, DigitalOcean, etc.)
   - Configure environment variables
   - Setup database backups

4. **Add Features**
   - Email/SMS notifications
   - Attendance tracking
   - Membership expiry alerts
   - Export to CSV/Excel
   - Payment gateway integration

## ✅ Getting Help

1. Check [README.md](README.md) for overview
2. Read relevant documentation file
3. Check [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API issues
4. Review [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md) for setup issues
5. Check framework documentation:
   - [Django Docs](https://docs.djangoproject.com/)
   - [Next.js Docs](https://nextjs.org/docs)

## ✅ Security Reminder

Before production:

- [ ] Change `SECRET_KEY` in backend
- [ ] Set `DEBUG=False`
- [ ] Update `ALLOWED_HOSTS`
- [ ] Use strong admin password
- [ ] Configure HTTPS/SSL
- [ ] Setup environment variables properly
- [ ] Enable backup system
- [ ] Configure monitoring

---

**Ready to start?** Begin with [README.md](README.md)! 🚀
