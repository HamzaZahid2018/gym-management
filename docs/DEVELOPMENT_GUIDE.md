# Development & Deployment Guide

## 📋 Prerequisites

Before starting, ensure you have:

- Python 3.9+ (`python --version`)
- Node.js 16+ (`node --version`)
- npm/yarn (`npm --version`)
- PostgreSQL 12+ (`psql --version`)
- Git (`git --version`)

---

## 🏗️ Development Environment Setup

### Part 1: Backend Setup

#### Step 1: Create Virtual Environment

```bash
cd gym\ management/backend
python -m venv env

# Activate environment
# Windows:
env\Scripts\activate
# macOS/Linux:
source env/bin/activate
```

#### Step 2: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### Step 3: Configure Environment

```bash
cp .env.example .env
```

Edit `.env`:

```
DEBUG=True
SECRET_KEY=your-secret-key-here-change-in-production-to-random-string
DB_ENGINE=django.db.backends.postgresql
DB_NAME=gym_management
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
ALLOWED_HOSTS=localhost,127.0.0.1
```

#### Step 4: Setup PostgreSQL

**Windows:**

```bash
# Open PostgreSQL command line
psql -U postgres

# Create database
CREATE DATABASE gym_management;

# Exit
\q
```

**macOS:**

```bash
createdb gym_management
```

**Linux:**

```bash
sudo -u postgres createdb gym_management
```

#### Step 5: Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

#### Step 6: Create Superuser

```bash
python manage.py createsuperuser
```

Follow prompts:

```
Username: admin
Email: admin@example.com
Password: admin@123
Password (again): admin@123
```

#### Step 7: Create Sample Data

```bash
python manage.py shell < fixtures/populate_db.py
```

#### Step 8: Start Backend Server

```bash
python manage.py runserver
```

Server at: **http://localhost:8000**

---

### Part 2: Frontend Setup

#### Step 1: Install Dependencies

```bash
cd gym\ management/frontend
npm install
```

#### Step 2: Configure Environment

```bash
cp .env.example .env.local
```

Content of `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Step 3: Start Development Server

```bash
npm run dev
```

Frontend at: **http://localhost:3000**

---

## 🧪 Testing the Application

### Test Backend API

```bash
# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin@123"}'

# Get customers
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/users/
```

### Test Frontend

1. Open http://localhost:3000
2. Login with:
   - Email: admin@example.com
   - Password: admin@123
3. Navigate through:
   - Dashboard
   - Customers
   - Payments

---

## 🔄 Running Both Servers

### Option 1: Terminal Tabs

**Tab 1 - Backend:**

```bash
cd backend
env\Scripts\activate  # or source env/bin/activate
python manage.py runserver
```

**Tab 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### Option 2: Background Services

**Windows:**

```bash
# Backend
start cmd /k "cd backend && env\Scripts\activate && python manage.py runserver"

# Frontend
start cmd /k "cd frontend && npm run dev"
```

**macOS/Linux:**

```bash
# Backend
cd backend && source env/bin/activate && python manage.py runserver &

# Frontend
cd frontend && npm run dev &
```

---

## 📦 Management Commands

### Backend Commands

```bash
# Create monthly payments
python manage.py create_monthly_payments

# Mark late payments
python manage.py mark_late_payments

# Run tests
python manage.py test

# Create admin user
python manage.py createsuperuser

# Database migrations
python manage.py makemigrations
python manage.py migrate

# Django shell
python manage.py shell

# Collect static files (production)
python manage.py collectstatic --noinput

# Export data
python manage.py dumpdata > backup.json

# Import data
python manage.py loaddata backup.json
```

---

## 🚀 Production Deployment

### Backend Deployment

#### Option 1: Heroku

```bash
# Install Heroku CLI
# https://devcenter.heroku.com/articles/heroku-cli

# Create Procfile
echo "web: gunicorn gym_management.wsgi --log-file -" > Procfile

# Create runtime.txt
echo "python-3.9.0" > runtime.txt

# Create app
heroku create your-app-name

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate
```

#### Option 2: AWS (EB)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
eb init -p python-3.9 gym-management

# Create environment
eb create production

# Deploy
eb deploy

# Run migrations
eb ssh
python manage.py migrate
```

#### Option 3: DigitalOcean/VPS

```bash
# Install dependencies
sudo apt-get update
sudo apt-get install python3.9 python3-pip postgresql nginx

# Clone repository
git clone <repo-url>
cd backend

# Virtual environment
python3.9 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Configure .env
nano .env

# Migrate database
python manage.py migrate

# Collect static
python manage.py collectstatic --noinput

# Install Gunicorn & Supervisor
pip install gunicorn supervisor

# Create Gunicorn service file
sudo nano /etc/systemd/system/gunicorn.service

# Content:
[Unit]
Description=Gunicorn service for Gym Management
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/gunicorn \
    --workers 4 \
    --bind unix:/run/gunicorn.sock \
    gym_management.wsgi:application

[Install]
WantedBy=multi-user.target

# Start service
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Configure Nginx
sudo nano /etc/nginx/sites-available/default

# Configure SSL (Let's Encrypt)
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### Frontend Deployment

#### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel deploy

# Production
vercel deploy --prod
```

#### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy

# Build and deploy
npm run build
netlify deploy --prod --dir=.next
```

#### Option 3: AWS S3 + CloudFront

```bash
# Build
npm run build && npm run export

# Upload to S3
aws s3 sync out/ s3://your-bucket/

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id XXXXX --paths "/*"
```

#### Option 4: Self-hosted (Node.js)

```bash
# Build
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "gym-frontend" -- start

# Manage
pm2 status
pm2 logs
pm2 restart gym-frontend
```

---

## 🔒 Security Checklist

### Backend

- [ ] Set `DEBUG=False` in production
- [ ] Change `SECRET_KEY` to random value
- [ ] Configure `ALLOWED_HOSTS` with your domain
- [ ] Enable HTTPS/SSL certificates
- [ ] Setup CORS properly (only allow frontend URL)
- [ ] Configure secure password hashing
- [ ] Setup database backups
- [ ] Enable logging and monitoring
- [ ] Use environment variables for secrets
- [ ] Setup rate limiting
- [ ] Enable CSRF protection
- [ ] Configure secure cookies

### Frontend

- [ ] Use HTTPS URLs only
- [ ] Secure token storage (review if using localStorage)
- [ ] Input validation on all forms
- [ ] Error handling without exposing sensitive data
- [ ] Content Security Policy headers
- [ ] Hide API URLs in frontend (use environment variables)

---

## 🔧 Environment Variables

### Backend (.env)

```
# Django
DEBUG=False
SECRET_KEY=your-random-secret-key-min-50-chars
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=gym_management_prod
DB_USER=postgres
DB_PASSWORD=strong-password-here
DB_HOST=db.example.com
DB_PORT=5432

# Email (optional)
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=app-password

# AWS S3 (optional for media files)
USE_S3=True
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_STORAGE_BUCKET_NAME=your-bucket
AWS_S3_REGION_NAME=us-east-1
```

### Frontend (.env.production)

```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=Gym Management System
```

---

## 📊 Monitoring & Logging

### Backend Logging

```python
# settings.py
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'INFO',
            'propagate': True,
        },
    },
}
```

### Frontend Error Tracking (Sentry)

```bash
npm install @sentry/next

# pages/_app.js
import * as Sentry from "@sentry/next";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production",
});
```

---

## 🔄 CI/CD Pipeline (GitHub Actions)

### Backend Tests (.github/workflows/backend.yml)

```yaml
name: Backend Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:12
        env:
          POSTGRES_DB: test_gym
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v2

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.9

      - name: Install dependencies
        run: |
          pip install -r backend/requirements.txt

      - name: Run migrations
        run: |
          cd backend
          python manage.py migrate

      - name: Run tests
        run: |
          cd backend
          python manage.py test
```

### Frontend Build (.github/workflows/frontend.yml)

```yaml
name: Frontend Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Set up Node
        uses: actions/setup-node@v2
        with:
          node-version: 16

      - name: Install dependencies
        run: |
          cd frontend
          npm install

      - name: Build
        run: |
          cd frontend
          npm run build

      - name: Deploy
        run: |
          cd frontend
          npm run build
          # Add your deployment command here
```

---

## 📈 Performance Optimization

### Backend Optimization

1. **Database Indexing**

   ```python
   class Payment(models.Model):
       class Meta:
           indexes = [
               models.Index(fields=['customer', 'year', 'month']),
               models.Index(fields=['payment_status']),
           ]
   ```

2. **Caching**

   ```python
   from django.views.decorators.cache import cache_page

   @cache_page(60 * 5)
   def stats(request):
       # Cached for 5 minutes
   ```

3. **Query Optimization**

   ```python
   # Use select_related for ForeignKey
   Payment.objects.select_related('customer')

   # Use prefetch_related for reverse relations
   User.objects.prefetch_related('payments')
   ```

### Frontend Optimization

1. **Code Splitting**
2. **Image Optimization**
3. **Lazy Loading**
4. **CSS/JS Minification** (automatic with Next.js)

---

## 🐛 Debugging

### Backend

```bash
# Django shell
python manage.py shell
>>> from users.models import User
>>> User.objects.all()

# Django debug toolbar
pip install django-debug-toolbar
# Add to settings.py INSTALLED_APPS and MIDDLEWARE

# Logging
import logging
logger = logging.getLogger(__name__)
logger.info("Message")
```

### Frontend

```bash
# Browser DevTools
# React DevTools Extension
# Redux DevTools (if using Redux)

# Console logging
console.log(data)
console.error(error)

# Network tab
# View API requests and responses
```

---

## 🆘 Troubleshooting

### Common Issues

**Port Already in Use**

```bash
# Find process using port
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>
# or use different port
python manage.py runserver 8001
```

**Database Connection Error**

```bash
# Check PostgreSQL is running
psql -U postgres

# Verify .env configuration
cat .env

# Test connection
python -c "import psycopg2; psycopg2.connect('dbname=gym_management user=postgres')"
```

**Migration Issues**

```bash
# Show migration status
python manage.py showmigrations

# Revert migration
python manage.py migrate <app> <migration_number>

# Create new migration
python manage.py makemigrations
```

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [DRF Documentation](https://www.django-rest-framework.org/)
- [Next.js Documentation](https://nextjs.org/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [JWT.io](https://jwt.io/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 📞 Support

For development issues:

1. Check error messages carefully
2. Review logs in `logs/` directory
3. Check browser console for frontend errors
4. Refer to framework documentation
5. Search Stack Overflow for similar issues

---

**Last Updated:** January 2024
**Version:** 1.0.0
