# Campus Nexus

Campus Nexus is a full-stack web application designed to connect college seniors and juniors through a platform for sharing and exchanging useful items. Seniors can list items they no longer need, while juniors can browse available items and connect with seniors to obtain them.

## Features

### For Seniors
- Register and log in securely.
- Upload items with:
  - Item Name
  - Price
  - Item Image
- Manage listed items.

### For Juniors
- Register and log in securely.
- Browse available items uploaded by seniors.
- View item details and images.
- Select an item and obtain the senior's contact information.
- Selected items are automatically removed from the listings to prevent multiple claims.

### Authentication & Authorization
- User Registration and Login.
- Role-based access control for Seniors and Juniors.
- Secure authentication system.

## Technology Stack

### Frontend
- HTML5
- CSS3
- JavaScript

### Backend
- Node.js
- Express.js

### Database
- Microsoft SQL Server

### Additional Tools
- Multer (Image Upload Handling)

## Project Workflow

1. User signs up and logs in to the platform.
2. Seniors upload item details, including name, price, and image.
3. Item information is stored in the SQL Server database.
4. Juniors browse the available items.
5. A junior selects an item of interest.
6. The system displays the senior's contact information.
7. Once selected, the item is removed from the available listings.

## Use Case

Campus Nexus promotes resource sharing within college communities by enabling students to exchange books, stationery, gadgets, and other useful items in a simple and organized manner.

## Future Enhancements

- Real-time notifications
- In-app chat functionality
- Advanced search and filtering
- Admin dashboard
- Payment gateway integration
- Multi-college support with separate databases

## Installation

### Clone the Repository

```bash
git clone <repository-url>
```

### Navigate to the Project Directory

```bash
cd Campus-Nexus
```

### Install Dependencies

```bash
npm install
```

### Configure Database

Update the SQL Server connection settings in the project configuration file with your database credentials.

### Start the Application

```bash
npm start
```

### Access the Application

Open your browser and visit:

```text
http://localhost:3000
```

## Contributors

**Ayanamahanthi Bhavani**
