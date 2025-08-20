# University Registration & Advising System

A comprehensive student registration management system for Northern University Bangladesh, built as a standalone application separate from the admission system.

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

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Navigate to registration system directory:**

   ```bash
   cd registration-system
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser:**
   ```
   http://localhost:3001
   ```

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

The Registration System uses the same visual theme as the admission system:

- **Primary Colors**: Deep Plum (#4A1D4A), Accent Purple (#8B4B9B)
- **Background**: Lavender (#F3F0FF)
- **Typography**: Poppins font family
- **Components**: Radix UI + Tailwind CSS
- **Responsive Design**: Mobile-first approach

## 📁 Project Structure

```
registration-system/
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (buttons, cards, etc.)
│   └── ErrorBoundary.tsx
├── contexts/            # React context providers
│   └── RegistrationAuthContext.tsx
├── pages/               # Application pages/routes
│   ├── Index.tsx        # Landing page
│   ├── StudentLogin.tsx
│   ├── AdvisorLogin.tsx
│   ├── AdminLogin.tsx
│   ├── StudentDashboard.tsx
│   └── ...
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and configurations
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── global.css           # Global styles and theme
└── package.json         # Dependencies and scripts
```

## 🛠 Development

### Available Scripts

- `npm run dev` - Start development server (port 3001)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **Routing**: React Router v6
- **Styling**: Tailwind CSS + Radix UI
- **State Management**: React Context + React Query
- **Build Tool**: Vite
- **Icons**: Lucide React

## �� Deployment

### Build for Production

```bash
npm run build
```

### Deploy Options

- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag & drop `dist` folder or connect repo
- **Traditional Hosting**: Upload `dist` folder contents

### Environment Variables

Create `.env` file for production configurations:

```env
VITE_API_URL=your_api_endpoint
VITE_APP_NAME=University Registration System
```

## 🔧 Customization

### Adding New Features

1. Create new page components in `pages/`
2. Add routes in `App.tsx`
3. Update navigation menus
4. Add API integration as needed

### Theming

- Update colors in `tailwind.config.ts`
- Modify global styles in `global.css`
- Customize component themes in `components/ui/`

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
2. Search GitHub issues
3. Create new issue with detailed description

## 📄 License

Copyright © 2024 Northern University Bangladesh. All rights reserved.

---

**Note**: This Registration System is completely independent of the admission system and runs on a separate port (3001) with its own authentication and data management.
