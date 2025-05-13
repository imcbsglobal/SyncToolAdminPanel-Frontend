# Database Synchronization Tool - Administration Panel

A web-based admin interface for managing database synchronization clients built with React, TypeScript, and Vite.

## 🌟 Overview

This application serves as an administrative panel for a database synchronization system designed to help manage client configurations for synchronizing SQL Anywhere databases with a central server. The admin panel allows system administrators to:

- View all registered sync clients
- Add new client configurations
- Edit existing client settings
- Generate and download client configuration files
- Generate Windows batch files for client-side use
- Remove client configurations
- View synchronization logs

## 🔧 Technology Stack

- **Frontend**:

  - React (with Hooks)
  - TypeScript
  - Tailwind CSS for styling
  - Vite as build tool

- **Backend** (API integration):
  - RESTful API integration with the sync service backend
  - Environment-based configuration

## 📋 Features

- **User Management**:

  - Create, read, update, and delete client configurations
  - Securely manage database credentials
  - Store client contact information

- **Configuration Management**:

  - Generate client-specific configuration files
  - Create Windows batch files for easy client deployment
  - Display configuration details in a user-friendly format

- **Monitoring**:
  - View synchronization logs
  - Track client activity

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or later recommended)
- npm or yarn package manager
- Access to the backend synchronization service

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/KRISHNAKUMARPS2002/Sync-Hub-Frontend.git
   cd db-sync-admin
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create an environment file:

   ```bash
   cp .env.example .env
   ```

4. Edit the `.env` file and set the appropriate API URL:

   ```
   VITE_API_URL=https://synctool.imcbs.com
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## 🔍 Project Structure

```
src/
├── components/
│   └── Users/
│       ├── UserConfig.tsx    # Client configuration component
│       ├── UserForm.tsx      # Form for adding/editing users
│       └── UserList.tsx      # Table view of all clients
├── interfaces/              # TypeScript interfaces
├── services/
│   └── api.ts               # API service for backend communication
├── App.tsx                  # Main application component
└── main.tsx                 # Application entry point
```

## 🔄 Client Synchronization Flow

1. Admin creates a new client configuration through the admin panel
2. System generates client ID and access token
3. Admin downloads configuration JSON and batch file
4. Files are sent to client for installation
5. Client runs the batch file to start synchronization
6. Synchronization logs are viewable in the admin panel

## 📦 Deployment

For production build:

```bash
npm run build
# or
yarn build
```

This will generate optimized assets in the `dist/` directory that can be deployed to any static hosting service.

## 🛠️ Environment Variables

| Variable     | Description                    | Default                  |
| ------------ | ------------------------------ | ------------------------ |
| VITE_API_URL | URL of the backend API service | https://your-backend-url |

## 📄 License

[License information goes here]

## 👥 Contributing

[Contributing guidelines go here]

## 📞 Support

For support or questions, please contact [contact information]
