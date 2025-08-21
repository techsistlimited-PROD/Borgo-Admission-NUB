# University Registration & Advising System

A comprehensive student registration management system for Northern University Bangladesh, designed as a standalone application.

## 🚀 Quick Deployment on Builder.io

### Step 1: Create New Builder.io Project
1. Go to [Builder.io](https://builder.io)
2. Create a new project
3. Select "React" as your framework

### Step 2: Upload Project Files
1. Upload all files from this `registration-system-standalone` folder
2. Ensure the file structure matches exactly

### Step 3: Deploy
1. Run `npm install` to install dependencies
2. Run `npm run build` to build for production
3. Deploy using Builder.io's deployment tools

## 🎯 Features

### Three Role-Based Dashboards:

- **Student Portal**: Course registration, academic history, advisor communication
- **Advisor/Teacher Portal**: Student advising, registration approval, teaching load management
- **Admin/ACAD Portal**: Complete system administration and academic management

### Key Functionality:

- ✅ **Course Registration** with add/drop/edit capabilities
- ✅ **Advisor Approval System** with feedback mechanism
- ✅ **Academic History Tracking** with transcript view
- ✅ **Schedule Management** with automated timetable generation
- ✅ **Student Search & Information** management
- ✅ **Semester Management** with bi/tri-semester support
- ✅ **Reports & Analytics** for all roles
- ✅ **Room & Routine Management**

## 🔐 Demo Credentials

### Student Login
- **Student ID**: `2021-1-60-001`
- **Password**: `student123`

### Advisor/Teacher Login
- **Employee ID**: `ADV001`
- **Password**: `advisor123`

### Admin/ACAD Login
- **Username**: `admin`
- **Password**: `admin123`

## 🎨 Design System

The Registration System uses a modern, professional theme:

- **Primary Colors**: Deep Plum (#4A1D4A), Accent Purple (#8B4B9B)
- **Background**: Lavender (#F3F0FF)
- **Typography**: Poppins font family
- **Components**: Radix UI + Tailwind CSS
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
registration-system-standalone/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components
│   │   └── ErrorBoundary.tsx
│   ├── contexts/            # React context providers
│   │   └── RegistrationAuthContext.tsx
│   ├── pages/               # Application pages/routes
│   │   ├── Index.tsx        # Landing page
│   │   ├── StudentLogin.tsx
│   │   ├── AdvisorLogin.tsx
│   │   ├── AdminLogin.tsx
│   │   ├── StudentDashboard.tsx
│   │   └── ...
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions and configurations
│   ├── App.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── global.css           # Global styles and theme
├── public/                  # Static assets
├── package.json             # Dependencies and scripts
├── vite.config.ts           # Vite configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── README.md                # This file
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server (port 3000)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run typecheck` - Run TypeScript checks

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Context + React Query
- **Build Tool**: Vite
- **Icons**: Lucide React

## 🌐 Deployment URLs

After deployment, your system will be accessible at:
- **Production**: Your Builder.io provided URL
- **Student Portal**: `your-url/student-login`
- **Advisor Portal**: `your-url/advisor-login`
- **Admin Portal**: `your-url/admin-login`

## 🔧 Customization

### Adding New Features

1. Create new page components in `src/pages/`
2. Add routes in `src/App.tsx`
3. Update navigation menus
4. Add API integration as needed

### Theming

- Update colors in `tailwind.config.ts`
- Modify global styles in `src/global.css`
- Customize component themes in `src/components/ui/`

## 📊 Planned Features

- [ ] **Course Registration Module** with conflict detection
- [ ] **Grade Entry System** for faculty
- [ ] **Transcript Generation** with official formatting
- [ ] **Financial Integration** with fee management
- [ ] **Mobile App** companion
- [ ] **API Integration** with university systems
- [ ] **Advanced Analytics** and reporting
- [ ] **Notification System** (email/SMS)

## 🆘 Support

For technical issues or feature requests:

1. Check existing documentation
2. Contact your development team
3. Create issue with detailed description

## 📄 License

Copyright © 2024 Northern University Bangladesh. All rights reserved.

---

**Note**: This Registration System is completely independent and can be deployed on any hosting platform including Builder.io, Netlify, Vercel, or traditional hosting services.
