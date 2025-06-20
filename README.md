
# ChainView - Blockchain Explorer & Management Platform

A comprehensive blockchain visualization and management platform built with React and Node.js. This application provides an intuitive interface to interact with a custom blockchain implementation, offering real-time monitoring, transaction management, and mining capabilities.

## 🌟 Features

### Core Blockchain Functionality
- **Complete Blockchain Network**: Implements a full blockchain with linked blocks and hash verification
- **Transaction Management**: Add, view, and track transactions in the mempool
- **Mining Interface**: Mine pending transactions into new blocks with proof-of-work
- **Chain Validation**: Verify blockchain integrity and detect tampering
- **Real-time Updates**: Live data refresh every 5 seconds

### Frontend Capabilities
- **Dashboard**: Overview of blockchain statistics and recent activity
- **Explorer**: Complete blockchain visualization with block and transaction details
- **Transaction Manager**: Create and submit new transactions
- **Mining Interface**: Interactive mining with real-time feedback
- **Block Search**: Find specific blocks by hash
- **Validation Tools**: Check blockchain integrity and individual block validity

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory and install dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Start the blockchain server**:
   ```bash
   npm start
   ```
   The API will be running on `http://localhost:3005`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```
   
3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

## 🔧 API Endpoints

### Transaction Management
- **POST** `/addTransaction` - Add a new transaction to mempool
- **POST** `/mine` - Mine pending transactions into a new block

### Blockchain Data
- **GET** `/getChain` - Retrieve the complete blockchain
- **GET** `/getLatestBlock` - Get the most recent block
- **GET** `/block/:hash` - Find a specific block by hash

### Utilities
- **GET** `/isValid` - Validate blockchain integrity
- **GET** `/stats` - Get blockchain statistics
- **GET** `/` - API health check

## 🏗️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** component library
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Lucide React** for icons

### Backend
- **Node.js** with Express
- **Custom Blockchain Implementation** with SHA256 hashing
- **CORS** enabled for cross-origin requests
- **Object-Oriented Design** with Block and Chain classes

## 📱 Pages & Navigation

- **Dashboard** (`/`) - Blockchain overview and statistics
- **Explorer** (`/explorer`) - Complete chain visualization
- **Transactions** (`/transactions`) - Transaction management
- **Mining** (`/mining`) - Interactive mining interface
- **Block Search** (`/blocks`) - Search blocks by hash
- **Validation** (`/validation`) - Blockchain integrity tools

## 🎨 Design Features

- **Dark Theme** with gradient backgrounds
- **Responsive Design** for mobile and desktop
- **Real-time Data Updates** with loading states
- **Interactive Components** with hover effects
- **Error Handling** with user-friendly messages
- **Professional UI** with modern card layouts

## 🔒 Blockchain Implementation

### Block Structure
```javascript
{
  index: number,
  timestamp: number,
  transactions: Array,
  previousHash: string,
  hash: string,
  nonce: number
}
```

### Security Features
- **SHA256 Hashing** for block integrity
- **Proof of Work** mining algorithm
- **Chain Validation** to prevent tampering
- **Immutable Blocks** once added to chain

## 🚀 Deployment

The application can be deployed using any modern hosting platform:

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Deploy the backend** to your preferred Node.js hosting service

3. **Update API endpoints** in the frontend to point to your deployed backend

## 🤝 Contributing

This project demonstrates blockchain fundamentals and modern web development practices. Feel free to:

- Enhance the UI/UX design
- Add new blockchain features
- Implement additional validation methods
- Create new visualization components
- Optimize performance and security

## 📄 License

This project is open source and available under the MIT License.

---

**ChainView** - Making blockchain technology accessible and visual 🔗✨
