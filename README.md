# Northern University Admission Portal - Frontend Only

A complete frontend-only university admission portal built with React, TypeScript, and Tailwind CSS. This application includes all features working with mock data, ready for backend integration.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Application Features

### 🎓 Public Application Flow

- **Home Page** (`/`) - Choose admission type (Regular/Credit Transfer)
- **Program Selection** (`/program-selection`) - Select program, department, campus, semester
- **Personal Information** (`/personal-information`) - Enter personal details
- **Academic History** (`/academic-history`) - Upload transcripts and academic records
- **Application Review** (`/application-review`) - Review and submit application
- **Application Success** (`/application-success`) - Get Applicant ID and password

### 👤 Applicant Portal

- **Login** (`/applicant-portal`) - Secure login with generated credentials
- **Payment Portal** (`/payment-portal`) - Multiple payment methods (bKash, Rocket, Card, Offline)
- **Dashboard** - View application status and make payments

### 👨‍💼 Admin Portal

- **Admin Login** (`/admin`) - Staff login
- **Applications List** (`/admin/admissions`) - View and manage all applications
- **Application Details** (`/admin/applicant/:id`) - Review individual applications
- **Admission Settings** (`/admin/settings`) - Configure admission parameters

## 🔧 Technology Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS + Radix UI Components
- **Routing**: React Router v6
- **State Management**: React Context API
- **Forms**: React Hook Form + Zod validation
- **Data Fetching**: TanStack Query (React Query)
- **Build Tool**: Vite
- **Icons**: Lucide React

## 📁 Project Structure

```
client/
├── components/          # Reusable UI components
│   ├── ui/             # Radix UI components (buttons, cards, etc.)
│   ├─�� Header.tsx      # Main navigation header
│   ├── Sidebar.tsx     # Admin sidebar navigation
│   └── ...
├── contexts/           # React Context providers
│   ├── AuthContext.tsx      # Authentication state
│   └── ApplicationContext.tsx # Application form state
├── lib/               # Utility libraries
│   ├── api.ts         # Mock API client
│   ├── mockApi.ts     # Mock data service
│   ├── paymentService.ts # Payment gateway simulation
│   └── utils.ts       # Helper functions
├── pages/             # Route components
│   ├── Index.tsx           # Home/landing page
│   ├── ProgramSelection.tsx # Program selection form
│   ├── PersonalInformation.tsx # Personal details form
│   ├── AcademicHistory.tsx     # Academic records form
│   ├── ApplicationReview.tsx   # Review and submit
│   ├── ApplicationSuccess.tsx  # Success page with credentials
│   ├── ApplicantLogin.tsx      # Applicant portal login
│   ├── PaymentPortal.tsx       # Payment interface
│   ├── AdminLogin.tsx          # Admin login
│   ├── AdminAdmissionList.tsx  # Admin applications list
│   ├── ApplicantDetail.tsx     # Admin application details
│   └── ...
└── App.tsx            # Main application component
```

## 🔐 Demo Credentials

### Applicant Portal

- **Applicant ID**: `APP123456`
- **Password**: `temp123456`

### Admin Portal

- **Email**: `admin@nu.edu.bd`
- **Password**: `admin123`

## 🎨 Design System

The application uses a cohesive design system with:

- **Primary Colors**: Deep Plum, Accent Purple
- **Secondary Colors**: Lavender, Mint Green, Pink Accent
- **Typography**: Poppins (headings), Inter (body)
- **Components**: Consistent spacing, shadows, and border radius
- **Responsive**: Mobile-first design approach

## 🔧 Mock Data System

All application data is simulated using a comprehensive mock API system:

### Mock Services (`client/lib/mockApi.ts`)

- **Authentication**: User login/logout simulation
- **Applications**: CRUD operations for applications
- **Programs**: University programs and departments data
- **Payments**: Payment processing simulation
- **Referrers**: Faculty referrer system

### Features Included

- Realistic data simulation with proper delays
- Form validation and error handling
- File upload simulation (transcripts, payslips)
- Multi-step form state management
- Payment gateway integration (demo mode)

## 🌐 Available Routes

### Public Routes

- `/` - Home page (admission type selection)
- `/program-selection` - Program selection form
- `/personal-information` - Personal details form
- `/academic-history` - Academic records form
- `/application-review` - Review and submit
- `/application-success` - Success page with credentials

### Applicant Portal

- `/applicant-portal` - Applicant login
- `/payment-portal` - Payment interface (redirects from `/dashboard`)

### Admin Portal

- `/admin` - Admin login
- `/admin/admissions` - Applications management
- `/admin/applicant/:id` - Application details
- `/admin/settings` - Admission configuration

## 🔧 Backend Integration Guide

### API Endpoints to Implement

#### Authentication

```typescript
POST / api / auth / login;
POST / api / auth / logout;
GET / api / auth / me;
```

#### Applications

```typescript
GET    /api/applications
POST   /api/applications
GET    /api/applications/:id
PATCH  /api/applications/:id/status
POST   /api/applications/:id/generate-ids
GET    /api/applications/stats/dashboard
```

#### Programs & Departments

```typescript
GET / api / programs;
GET / api / programs / departments;
POST / api / programs / calculate - cost;
```

#### Referrers

```typescript
GET  /api/referrers
POST /api/referrers/validate
GET  /api/referrers/:id/stats
```

### Data Models

#### User Model

```typescript
interface User {
  id: number;
  uuid: string;
  name: string;
  email: string;
  type: "applicant" | "admin";
  university_id?: string;
  department?: string;
  designation?: string;
}
```

#### Application Model

```typescript
interface Application {
  id: string;
  uuid: string;
  status: "pending" | "approved" | "rejected" | "payment_pending";
  applicant_name: string;
  university_id?: string;
  student_id?: string;
  email: string;
  phone: string;
  admission_type: "regular" | "credit_transfer";
  program_code: string;
  program_name: string;
  department_code: string;
  department_name: string;
  campus: string;
  semester: string;
  semester_type: string;
  created_at: string;
  personal_info?: any;
  academic_history?: any;
  documents?: any;
  payment_info?: any;
}
```

### Environment Variables

Create a `.env` file for production backend integration:

```env
VITE_API_URL=https://your-backend-api.com/api
VITE_PAYMENT_GATEWAY_URL=https://payment-gateway.com
VITE_FILE_UPLOAD_URL=https://your-file-storage.com
```

## 🚀 Deployment

### Option 1: Netlify (Recommended)

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Option 2: Vercel

```bash
npm run build
# Deploy using Vercel CLI or GitHub integration
```

### Option 3: Any Static Host

```bash
npm run build
# Upload dist/ folder to your hosting service
```

## 🔄 Converting to Backend Integration

1. **Replace Mock API**: Update `client/lib/api.ts` to make real HTTP requests
2. **Environment Config**: Set `VITE_API_URL` to your backend URL
3. **File Uploads**: Implement real file upload endpoints
4. **Authentication**: Replace mock tokens with real JWT implementation
5. **Payment Integration**: Connect to real payment gateways
6. **Database**: Implement the data models as described above

## 🎯 Features Included

### ✅ Complete Application Flow

- Multi-step application form with validation
- File upload handling (transcripts, documents)
- Application review and submission
- Success page with generated credentials

### ✅ Applicant Portal

- Secure login system
- Payment portal with multiple methods
- Application status tracking

### ✅ Admin Portal

- Application management dashboard
- Individual application review
- Status update functionality
- Statistics and reporting

### ✅ Technical Features

- Responsive design (mobile-first)
- Form validation with error handling
- Loading states and user feedback
- Mock data system for development
- TypeScript for type safety
- Component-based architecture

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please contact:

- Email: support@nu.edu.bd
- Phone: +880-XXX-XXXXXX

---

**Note**: This is a frontend-only application using mock data. All backend integration points are documented above for easy implementation by your backend team.
