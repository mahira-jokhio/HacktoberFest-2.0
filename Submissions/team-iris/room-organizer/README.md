# 🏠 AI Room Organizer

## 🤖 AI-Powered Room Organization Tool

An intelligent room organization application that uses AI to analyze unorganized room images and provides organized layouts with practical tips for different room types.

### ✨ Features

- **Image Upload**: Drag & drop or click to upload room images
- **AI-Powered Analysis**: Analyzes room layout and suggests improvements
- **Room Type Selection**: Supports multiple room types (living room, bedroom, kitchen, office, etc.)
- **Organization Tips**: Provides specific, actionable organization suggestions
- **Visual Results**: Shows organized room concepts
- **Downloadable Results**: Download organized room images

### 🚀 Getting Started

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Run Development Server**

   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to `http://localhost:3000`

### 🛠️ Technology Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern styling
- **React Dropzone** - File upload handling
- **Lucide React** - Beautiful icons
- **AI SDK** - AI integration framework

### 📁 Project Structure

```
room-organizer/
├── app/
│   ├── api/organize-room/route.ts    # API endpoint for room organization
│   ├── page.tsx                      # Main room organizer interface
│   ├── layout.tsx                    # App layout
│   └── globals.css                   # Global styles
├── public/                           # Static assets
└── README.md                         # Project documentation
```

### 🎯 How It Works

1. **Upload Image**: Users upload a photo of their unorganized room
2. **Select Room Type**: Choose from 8 different room types
3. **AI Processing**: The system analyzes the room and generates organization suggestions
4. **Get Results**: View organized room concepts and practical tips

### 🏡 Supported Room Types

- **Living Room** - Furniture placement and zoning
- **Bedroom** - Storage and layout optimization
- **Kitchen** - Cabinet organization and workflow
- **Home Office** - Productivity-focused arrangements
- **Bathroom** - Storage and functionality
- **Dining Room** - Space utilization
- **Garage** - Storage solutions
- **Closet/Wardrobe** - Organization systems

### 🔧 API Endpoints

#### POST `/api/organize-room`

Analyzes room images and provides organization suggestions.

**Request Body:**

```json
{
  "image": "base64-encoded-image",
  "roomType": "living_room"
}
```

**Response:**

```json
{
  "success": true,
  "organizedImage": "organized-room-image-url",
  "organizationTips": [
    "Place the sofa against the longest wall to create a focal point",
    "Use area rugs to define different zones in the room",
    "Install floating shelves for books and decorative items"
  ],
  "roomType": "living_room",
  "description": "Here's how to organize your living room..."
}
```

### 🎨 Features in Detail

#### **Smart Upload**

- Drag & drop interface
- Multiple image format support (JPG, PNG, WebP)
- File size validation
- Real-time upload feedback

#### **AI-Powered Analysis**

- Room layout analysis
- Furniture placement suggestions
- Storage solution recommendations
- Space optimization tips

#### **Interactive Results**

- Before/after image comparison
- Numbered organization tips
- Downloadable organized images
- Room-specific advice

### 🚀 Deployment

The application is ready for deployment on:

- **Vercel** (recommended)
- **Netlify**
- **Railway**
- **Self-hosted servers**

### 🔮 Future Enhancements

- **Real Image Generation**: Integration with actual image generation APIs
- **3D Room Visualization**: Interactive 3D room models
- **AR Integration**: Augmented reality room preview
- **Social Features**: Share organized room designs
- **Room Scanning**: Mobile app for room scanning

### 👥 Team

**Team IRIS**

- **Shayan Ali** - Team Lead & AI Integration
- **Dua Fatima** - UI/UX Design & Testing
- **Sanobar** - Quality Assurance & Documentation

---

_Built with ❤️ by Team IRIS for intelligent room organization_
