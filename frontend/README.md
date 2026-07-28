# Gym Management System - Frontend Setup

## Project Overview

This is a production-ready Next.js/React frontend for the Gym Management System. It provides a modern, responsive admin dashboard for managing customers, payments, and viewing analytics.

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn package manager

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Environment Configuration

Create a `.env.local` file:

```bash
cp .env.example .env.local
```

Configure the API URL:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3. Run Development Server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
frontend/
├── pages/                   # Next.js pages
│   ├── index.js            # Home redirect
│   ├── login.js            # Login page
│   ├── dashboard.js        # Main dashboard
│   ├── customers.js        # Customer management
│   ├── payments.js         # Payment management
│   ├── _app.js             # App wrapper
│   └── _document.js        # HTML template
├── components/             # Reusable components
│   ├── Navbar.jsx          # Navigation bar
│   ├── Pagination.jsx      # Pagination
│   ├── StatCard.jsx        # Stats card
│   ├── StatusBadge.jsx     # Status indicator
│   ├── Modal.jsx           # Modal dialog
│   ├── Alert.jsx           # Alert message
│   └── index.js            # Export all components
├── context/                # React context
│   └── AuthContext.jsx     # Authentication context
├── lib/                    # Utilities
│   ├── api.js              # Axios configuration
│   └── services.js         # API services
├── styles/                 # CSS
│   └── globals.css         # Global styles
├── public/                 # Static files
├── package.json            # Dependencies
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS config
└── tsconfig.json           # TypeScript config
```

---

## 🎨 Features

### Pages

#### Login Page

- Email/password authentication
- JWT token storage
- Error handling
- Redirect to dashboard on success

#### Dashboard

- Overview statistics (Total customers, Active members, Unpaid, Overdue)
- Monthly revenue chart
- Payment status breakdown (Pie chart)
- Recent payments table
- New members list (last 30 days)
- Quick links to other sections

#### Customers Page

- List all customers with pagination
- Search by name or email
- View customer details
- Add new customer
- Edit customer information
- Delete customer
- Filter by status/membership type

#### Payments Page

- List all payments with pagination
- Search by customer
- Filter by payment status
- Record new payment
- Mark payment as paid
- View payment details
- Track due dates

---

## 🔐 Authentication

### Login Flow

1. User enters email and password
2. Backend returns JWT tokens (access & refresh)
3. Tokens stored in localStorage
4. Access token sent with every API request
5. Auto-refresh when token expires

### Protected Routes

All routes except login require authentication. Unauthenticated users are redirected to login.

---

## 📡 API Integration

### Services

API calls are organized in `lib/services.js`:

```javascript
import { userService, paymentService, dashboardService } from "@/lib/services";

// Get all customers
const response = await userService.getAll();

// Create new payment
await paymentService.create({ ...data });

// Get dashboard stats
const stats = await dashboardService.getStats();
```

### Error Handling

Automatic token refresh on 401 errors. Manual logout on refresh failure.

---

## 🎨 UI Components

### StatCard

Displays key metrics with icons and optional trend:

```jsx
<StatCard title="Total Customers" value={100} icon={FiUsers} color="blue" />
```

### StatusBadge

Visual status indicator:

```jsx
<StatusBadge status="paid" />  // Green badge
<StatusBadge status="unpaid" /> // Red badge
```

### Modal

Reusable modal dialog:

```jsx
<Modal
  isOpen={showModal}
  title="Add Customer"
  onClose={handleClose}
  onSubmit={handleSubmit}
>
  {/* Modal content */}
</Modal>
```

### Alert

Notification messages:

```jsx
<Alert type="success" message="Saved successfully!" />
```

---

## 🎯 State Management

### AuthContext

Manages global authentication state:

- User info
- Login/Logout
- Error handling

```jsx
const { user, loading, error, login, logout } = useAuth();
```

### Component State

Using React hooks for component-level state:

```javascript
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
```

---

## 📊 Charts

Using Recharts for data visualization:

- LineChart: Monthly revenue
- PieChart: Payment status breakdown
- BarChart: Custom charts

---

## 🎨 Styling

### Tailwind CSS

Utility-first CSS framework for rapid UI development.

Custom utilities defined in `styles/globals.css`:

- `.btn-primary` - Blue button
- `.btn-danger` - Red button
- `.card` - Card container
- `.badge-*` - Status badges

---

## 🔍 Search & Filter

### Search Features

- Customer search by name/email
- Payment search by customer
- Real-time filtering

### Filters

- Payment status (Paid, Unpaid, Late)
- Customer status (Active, Inactive)
- Membership type (Monthly, Quarterly, Yearly)

---

## 📱 Responsive Design

Mobile-first responsive layout:

- Mobile: Single column layout
- Tablet: 2-column grid
- Desktop: 3-4 column grid

Responsive components:

- Hamburger menu on mobile
- Collapsed sidebar
- Stacked forms

---

## 🚀 Production Build

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm start
```

Server will run on `http://localhost:3000`

### Environment Variables

Set proper API URL for production:

```
NEXT_PUBLIC_API_URL=https://api.example.com/api
```

---

## 📦 Dependencies

### Core

- `next` - React framework
- `react` - UI library
- `react-dom` - DOM rendering

### API & State

- `axios` - HTTP client
- Context API - State management

### UI

- `tailwindcss` - CSS framework
- `recharts` - Charts library
- `react-icons` - Icon library

### DevTools

- `eslint` - Code linting
- `prettier` - Code formatting (optional)

---

## 🔧 Configuration

### API URL

Update in `.env.local` or `.env`:

```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Tailwind CSS

Customize in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#3b82f6',
    },
  },
}
```

---

## 🧪 Development Tips

### Hot Reload

Next.js automatically reloads on file changes.

### Browser DevTools

React DevTools: Inspect components, state, props

### Console Errors

Check browser console for API errors and authentication issues.

---

## 🐛 Troubleshooting

### CORS Errors

Ensure backend has correct CORS settings:

```python
CORS_ALLOWED_ORIGINS = ['http://localhost:3000']
```

### API Connection Failed

- Check backend is running on `http://localhost:8000`
- Update `NEXT_PUBLIC_API_URL` in `.env.local`
- Check network tab in DevTools

### Login Fails

- Verify credentials in backend
- Check backend is running
- Clear localStorage and try again

### Build Errors

```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

---

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Axios](https://axios-http.com)

---

## 📄 License

This project is provided as-is for educational purposes.

---

## 🤝 Contributing

1. Create a feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

---

## 📧 Support

For issues or questions, check project documentation or contact support.
