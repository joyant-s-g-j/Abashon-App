# Abashon - Real Estate Mobile App 🏠📱

🚀 **Abashon** is a full-stack real estate mobile application that allows users to browse, search, and book properties seamlessly. Built with **React Native (Expo)** for the frontend and **Node.js/Express** for the backend, this application provides a complete property rental/purchase experience with real-time messaging and secure payment processing.

## ✨ Features

🏡 **Property Listings** – Browse comprehensive property listings with images, specifications, and details.  
🔍 **Advanced Search & Filters** – Filter properties by category, price range, bedrooms, bathrooms, and more.  
💬 **Real-time Messaging** – Chat with property owners/agents using Socket.IO-powered messaging.  
 **Secure Payments** – Process property bookings with Stripe payment integration.  
🗺️ **Interactive Maps** – View property locations on integrated maps with React Native Maps.  
⭐ **Ratings & Reviews** – Rate and review properties to help other users.  
👤 **User Authentication** – Secure JWT-based authentication with Google OAuth support.  
🛡️ **Role-based Access** – Customer, Agent, and Admin roles with specific permissions.  
📱 **Responsive Design** – Beautiful UI with NativeWind (TailwindCSS) styling.  
☁️ **Cloud Storage** – Property images stored securely on Cloudinary.  

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native with Expo SDK 54
- **Navigation**: Expo Router (File-based routing)
- **Styling**: NativeWind (TailwindCSS)
- **State Management**: React Hooks & Context API
- **Real-time**: Socket.IO Client
- **Maps**: React Native Maps
- **Payments**: Stripe React Native SDK

### Backend
- **Runtime**: Node.js with Express.js 5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & Google Auth Library
- **Real-time**: Socket.IO
- **File Storage**: Cloudinary
- **Payments**: Stripe API
- **Security**: bcrypt, CORS, Cookie Parser

## 📋 Core Modules

| Module | Description |
|--------|-------------|
| **Properties** | CRUD operations, search, filtering, and featured listings |
| **Categories** | Property type management (Apartment, House, Villa, etc.) |
| **Facilities** | Amenities management (WiFi, Parking, Pool, etc.) |
| **Users** | Authentication, profiles, and role management |
| **Messages** | Real-time chat with image/video support |
| **Payments** | Stripe checkout and booking management |

## 📁 Project Structure

```
abashon-app/
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── package.json              # Backend dependencies
│   ├── controllers/              # Request handlers
│   │   ├── auth.controller.js
│   │   ├── property.controller.js
│   │   ├── message.controller.js
│   │   ├── payment.controller.js
│   │   └── ...
│   ├── models/                   # Mongoose schemas
│   │   ├── user.model.js
│   │   ├── property.model.js
│   │   ├── booking.model.js
│   │   └── ...
│   ├── routes/                   # API routes
│   ├── middleware/               # Auth middleware
│   └── lib/                      # Utilities (DB, Socket, Cloudinary, Stripe)
│
├── frontend/
│   ├── app/                      # Expo Router pages
│   │   ├── _layout.tsx           # Root layout
│   │   ├── index.tsx             # Home screen
│   │   ├── (auth)/               # Authentication screens
│   │   ├── (root)/               # Main app screens
│   │   │   ├── (tabs)/           # Tab navigation
│   │   │   ├── messages/         # Chat screens
│   │   │   └── properties/       # Property details
│   │   └── admin-dashboard/      # Admin management
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React Context providers
│   ├── services/                 # API service functions
│   ├── utils/                    # Utility functions
│   ├── constants/                # App constants & configs
│   ├── assets/                   # Fonts, icons, images
│   └── package.json              # Frontend dependencies
│
└── README.md                     # Project documentation
```

## 🔐 User Roles

| Role | Permissions |
|------|-------------|
| **Customer** | Browse, search, book properties, chat, rate |
| **Agent** | All customer permissions + list properties |
| **Admin** | Full access + user/category/facility management |

## 🙏 Acknowledgements

- **[Expo](https://expo.dev/)** – For the amazing React Native development platform
- **[NativeWind](https://www.nativewind.dev/)** – For bringing TailwindCSS to React Native
- **[Socket.IO](https://socket.io/)** – For real-time communication
- **[Stripe](https://stripe.com/)** – For secure payment processing
- **[Cloudinary](https://cloudinary.com/)** – For image storage and optimization
- **[MongoDB](https://www.mongodb.com/)** – For the flexible NoSQL database

---

Made with ❤️ by **[Joyant Sheikhar Gupta Joy](https://joyant.me)** | Real Estate Mobile Application 🏠
