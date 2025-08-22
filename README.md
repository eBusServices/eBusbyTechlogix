# e-Bus Services by TechLogix Solutions Ltd.

A modern, responsive bus booking and transportation management system built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

### For Passengers
- **Modern Booking System**: Easy-to-use trip search and seat selection
- **Real-time Availability**: Live seat availability and pricing
- **User Authentication**: Secure registration and login system
- **Booking Management**: View booking history and download tickets
- **Mobile Responsive**: Optimized for all devices (mobile, tablet, desktop, TV)
- **Trip Tracking**: Find tickets using booking reference

### For Administrators
- **Dashboard**: Comprehensive admin panel for system management
- **Trip Management**: Create, update, and manage bus trips
- **User Management**: Handle passenger registrations and accounts
- **Analytics**: View booking statistics and performance metrics
- **Driver Management**: Assign and manage driver accounts

### For Drivers
- **Driver Portal**: Dedicated login and dashboard for drivers
- **Trip Assignment**: View assigned trips and schedules
- **Route Management**: Access route information and passenger lists

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: JWT-based authentication system
- **API**: RESTful API with Next.js API routes
- **Database**: Mock data (easily replaceable with real database)
- **Icons**: Heroicons
- **Deployment**: Vercel-ready configuration

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile Phones**: 320px - 767px
- **Tablets**: 768px - 1023px
- **Laptops**: 1024px - 1439px
- **Desktops**: 1440px - 1919px
- **Large Screens/TVs**: 1920px+

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eBusbyTechlogix
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:3000
   ```

### Build for Production

```bash
npm run build
npm start
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Demo Accounts

**Admin Login:**
- Email: `admin@techlogix.com`
- Password: `admin123`

**Driver Login:**
- Driver ID: `DRV001`
- Password: `driver123`

## 📚 API Documentation

### Trips API
- `GET /api/trips` - Get all trips with optional filters
- `POST /api/trips` - Create new trip (admin only)
- `GET /api/trips/[id]` - Get specific trip details
- `PATCH /api/trips/[id]` - Update trip details

### Bookings API
- `POST /api/bookings` - Create new booking
- `GET /api/bookings` - Get bookings (with filters)

### Authentication API
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/driver` - Driver login

### Branches API
- `GET /api/branches` - Get all branch offices
- `POST /api/branches` - Add new branch (admin only)

## 🎨 Design System

### Colors
- **Primary**: Blue gradient (#3b82f6 to #2563eb)
- **Secondary**: Gray tones
- **Success**: Green (#10b981)
- **Warning**: Yellow (#f59e0b)
- **Error**: Red (#ef4444)

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold weights with proper hierarchy
- **Body**: Regular weight with good readability

### Components
- **Cards**: Elevated design with hover effects
- **Buttons**: Primary, secondary, and ghost variants
- **Forms**: Clean inputs with proper validation
- **Navigation**: Responsive with mobile menu

## 📱 Performance Optimizations

- **Image Optimization**: Next.js Image component with lazy loading
- **Code Splitting**: Automatic route-based code splitting
- **Caching**: Smart API response caching
- **Bundle Optimization**: Tree shaking and minification
- **Responsive Images**: Multiple sizes for different devices

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Comprehensive form validation
- **CSRF Protection**: Built-in Next.js CSRF protection
- **XSS Prevention**: Sanitized inputs and outputs

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📦 Project Structure

```
eBusbyTechlogix/
├── app/
│   ├── api/                 # API routes
│   ├── auth/               # Authentication pages
│   ├── components/         # Reusable components
│   ├── lib/               # Utility functions
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx          # Homepage
├── public/
│   └── images/           # Static images
├── styles/
│   └── tailwind.css     # Tailwind imports
├── package.json
├── tailwind.config.js
├── next.config.js
└── README.md
```

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect to Vercel**
   ```bash
   npx vercel
   ```

2. **Set Environment Variables**
   - Add JWT_SECRET in Vercel dashboard
   - Configure any other environment variables

3. **Deploy**
   ```bash
   vercel --prod
   ```

### Other Platforms

The application is compatible with:
- Netlify
- Railway
- Heroku
- DigitalOcean App Platform

## 🔄 Future Enhancements

- [ ] Real database integration (PostgreSQL/MongoDB)
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Real-time chat support

## 🐛 Known Issues

- Mock data is used instead of real database
- Payment integration is placeholder
- PDF generation needs implementation
- Email sending needs SMTP configuration

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@techlogix.com or call +234 810 733 8827.

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Heroicons for the beautiful icons
- Vercel for deployment platform

---

**Made with ❤️ by TechLogix Solutions Ltd.**
