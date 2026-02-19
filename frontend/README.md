# Iranda School System - Frontend

A modern React frontend for the Iranda School Spreadsheet System, providing teachers and administrators with an intuitive interface for managing student marks, generating reports, and analyzing class performance.

## Features

- **Authentication**: Secure login system with role-based access (Admin/Teacher)
- **Dashboard**: Overview of all classes with completion status and quick access
- **Spreadsheet Interface**: Excel-like marks entry with real-time validation
- **Analytics**: Comprehensive performance analysis with visualizations
- **Broadsheet**: Final examination results with export capabilities
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **React Router**: Client-side routing with protected routes
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Beautiful and consistent icons
- **Axios**: HTTP client with interceptors for API calls

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.js
│   │   └── ProtectedRoute.js
│   ├── contexts/
│   │   └── AuthContext.js
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Dashboard.js
│   │   ├── Spreadsheet.js
│   │   ├── Analytics.js
│   │   └── Broadsheet.js
│   ├── services/
│   │   └── api.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 3001

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

### Environment Variables

Create a `.env` file in the root of the frontend directory:

```
REACT_APP_API_URL=http://localhost:3001
```

## Usage

### Login

Use the following demo credentials:

- **Admin**: admin@iranda.edu / admin123
- **Teacher**: john@iranda.edu / admin123

### Dashboard

- View all classes with their completion status
- Quick access to spreadsheet, analytics, and broadsheet
- Real-time progress tracking

### Spreadsheet

- Click on cells to edit marks (if you have permission)
- Real-time validation and saving
- Progress tracking with completion percentage
- Finalize class when all marks are entered

### Analytics

- Grade distribution charts
- Top performers ranking
- Subject-wise performance analysis
- Class statistics and trends

### Broadsheet

- Final examination results in tabular format
- Search functionality for students
- Export to CSV functionality
- Position-based ranking

## API Integration

The frontend integrates with the backend API through the following endpoints:

- Authentication: `/auth/login`
- Classes: `/classes/*`
- Spreadsheet: `/classes/:id/spreadsheet`
- Analytics: `/classes/:id/analytics`
- Broadsheet: `/classes/:id/broadsheet`

## Features by Role

### Admin
- Full access to all classes and subjects
- Can finalize classes
- Can create and manage classes
- Full analytics and reporting access

### Teacher
- Access only to assigned subjects
- Can edit marks for assigned subjects
- View analytics and reports
- Cannot finalize classes

## Security Features

- JWT token-based authentication
- Protected routes
- Role-based access control
- Automatic token refresh
- Secure API communication

## Responsive Design

The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## Build for Production

To create an optimized production build:

```bash
npm run build
```

This will create a `build` folder with optimized static files ready for deployment.

## Deployment

The frontend can be deployed to any static hosting service:
- Netlify
- Vercel
- AWS S3
- GitHub Pages
- Apache/Nginx servers

Ensure the API URL is correctly configured for your production environment.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Iranda School System and is subject to the institution's licensing terms.
