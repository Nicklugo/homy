# Homy - AI-Powered Household Management System

**Homy** is an intelligent household management and inventory tracking system that helps you manage your home inventory, track expenses, and get smart meal suggestions.

## Features

- 🏠 **Smart Inventory Management**: Track pantry items and household supplies
- 📷 **Receipt Scanning**: Automatically extract items from receipts (OCR ready)
- 🛒 **Shopping Lists**: Create and manage shopping lists
- 🍽️ **Meal Suggestions**: Get meal recommendations based on your inventory
- 📊 **Expense Tracking**: Track takeout orders and household spending
- 💬 **AI Chat Interface**: Interactive chat interface for household management
- 🔐 **User Authentication**: Secure login with NextAuth

## Project Structure

```
homy_consolidated/
├── src/                    # Next.js frontend
│   ├── app/               # Next.js app router pages
│   ├── components/        # React components
│   └── types/             # TypeScript type definitions
├── backend/               # Flask API backend
│   ├── app.py            # Main Flask application
│   ├── templates/        # HTML templates
│   └── static/           # CSS, JS, images
├── prisma/               # Database schema (PostgreSQL)
└── public/              # Static assets
```

## Tech Stack

### Frontend
- **Next.js 14.1.0** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **NextAuth** - Authentication
- **Prisma** - Database ORM

### Backend
- **Flask** - Python web framework
- **PostgreSQL** - Database
- **SQLAlchemy** - Database toolkit

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.8+
- PostgreSQL database

### Installation

1. **Clone the repository** (or use this consolidated version):
   ```bash
   cd homy_consolidated
   ```

2. **Install Frontend Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up Database**:
   ```bash
   # Create a .env file with your database URL
   echo "DATABASE_URL=postgresql://user:password@localhost:5432/homy" > .env
   
   # Run Prisma migrations
   npx prisma generate
   npx prisma migrate dev
   ```

5. **Set up Environment Variables**:
   Create a `.env.local` file in the root:
   ```env
   # Database
   DATABASE_URL=postgresql://user:password@localhost:5432/homy
   
   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   
   # OpenAI (optional, for AI features)
   OPENAI_API_KEY=your-openai-key-here
   ```

### Running the Application

1. **Start the Flask Backend** (Terminal 1):
   ```bash
   cd backend
   python app.py
   ```
   Backend runs on `http://localhost:5001`

2. **Start the Next.js Frontend** (Terminal 2):
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

3. **Open your browser**:
   Navigate to `http://localhost:3000`

## API Endpoints

### Inventory Management
- `GET /api/inventory` - Get all inventory items
- `POST /api/inventory` - Add item to inventory
- `DELETE /api/inventory/<category>/<id>` - Remove item from inventory

### Receipt Processing
- `POST /api/scan-receipt` - Upload and process receipt image

### Shopping List
- `GET /api/shopping-list` - Get shopping list
- `POST /api/shopping-list` - Add item to shopping list
- `DELETE /api/shopping-list` - Remove item or clear list

### Meal Suggestions
- `GET /api/meal-suggestions?type=available` - Get meal suggestions based on inventory

### Takeout Tracking
- `POST /api/takeout` - Track a takeout order

## Development

### Frontend Development
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Database Management
```bash
npx prisma studio    # Open Prisma Studio (database GUI)
npx prisma migrate   # Run database migrations
```

## Project Status

✅ **Completed Features:**
- Next.js frontend with authentication
- Flask backend API
- Inventory management
- Shopping list functionality
- Receipt scanning API structure
- Meal suggestion endpoints
- Database schema with Prisma

🚧 **In Progress:**
- OCR integration for receipt scanning
- AI chat interface integration
- Marketplace features
- Order tracking

## Contributing

This is a personal project, but suggestions and improvements are welcome!

## License

See LICENSE file for details.

## Notes

This is a consolidated version of the Homy project, combining:
- Next.js frontend (from root and `/homy/` subdirectory)
- Flask backend
- Removed duplicate files and unused React Native components
- Fixed requirements.txt (was incorrectly using FastAPI dependencies)

