# GBM School Website - README

## Gomendra Birta Model English School Official Website

A premium, modern, award-winning school website built with vanilla HTML, CSS, JavaScript and Firebase.

---

## 🚀 Features

### Public Website
- **Modern Hero Section** with Three.js 3D background
- **Responsive Navigation** with mobile menu
- **Animated Statistics** counters
- **Programs/Academics** section
- **Notice Board** with pinned notices
- **Photo Gallery** with lightbox
- **News & Events** sections
- **Testimonials** from parents
- **Contact Information** with map integration
- **FAQ Section**
- **Smooth Animations** using GSAP and AOS

### Admin Dashboard
- **Secure Authentication** with Firebase Auth
- **Beautiful Glassmorphism Design**
- **Dashboard Statistics** overview
- **News Management** (Create, Edit, Delete)
- **Event Management** with calendar
- **Gallery Management** with Firebase Storage
- **Teacher Profiles** management
- **Student Records** management
- **Admission Applications** viewer
- **Homepage Content** editor
- **Settings** configuration

---

## 📁 Project Structure

```
/workspace/
├── index.html              # Homepage
├── about.html              # About page
├── academics.html          # Academics page
├── admissions.html         # Admissions page
├── gallery.html            # Gallery page
├── news.html               # News page
├── events.html             # Events page
├── contact.html            # Contact page
├── faq.html                # FAQ page
├── admin/
│   ├── login.html          # Admin login
│   ├── dashboard.html      # Admin dashboard
│   ├── news.html           # News management
│   ├── gallery.html        # Gallery management
│   ├── teachers.html       # Teachers management
│   ├── students.html       # Students management
│   ├── admissions.html     # Admissions management
│   └── settings.html       # Settings
├── css/
│   ├── style.css           # Main styles
│   ├── responsive.css      # Responsive styles
│   ├── animations.css      # Animation styles
│   └── admin.css           # Admin styles
├── js/
│   ├── firebase.js         # Firebase configuration
│   ├── main.js             # Main JavaScript
│   ├── slider.js           # Slider functionality
│   ├── counter.js          # Counter animation
│   ├── contact.js          # Contact form
│   ├── theme.js            # Theme toggle
│   ├── admin.js            # Admin functionality
│   ├── news.js             # News management
│   └── gallery-admin.js    # Gallery admin
└── assets/
    ├── images/
    ├── videos/
    ├── logo/
    └── icons/
```

---

## 🔧 Setup Instructions

### 1. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable the following services:
   - **Authentication** (Email/Password)
   - **Firestore Database**
   - **Storage**

4. Get your Firebase config:
   - Project Settings → General → Your apps → SDK setup and configuration

5. Update `js/firebase.js` with your config:

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};
```

### 2. Firestore Security Rules

Set up security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to read
    match /{document=**} {
      allow read: if true;
    }
    
    // Only authenticated admins can write
    match /{document=**} {
      allow write: if request.auth != null;
    }
  }
}
```

### 3. Create Admin User

In Firebase Console → Authentication:
1. Click "Add user"
2. Enter email: `admin@gbm.edu.np`
3. Set a secure password
4. Save

### 4. Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 🎨 Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Custom styles with CSS variables
- **TailwindCSS CDN** - Utility-first styling
- **Vanilla JavaScript** - No frameworks
- **Firebase** - Backend as a service
  - Authentication
  - Firestore Database
  - Storage
- **GSAP** - Advanced animations
- **AOS** - Scroll animations
- **Three.js** - 3D hero background
- **Font Awesome** - Icons
- **Google Fonts** - Poppins & Playfair Display

---

## 🌐 Deployment

### Option 1: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting

# Deploy
firebase deploy
```

### Option 2: Any Static Host

Upload all files to:
- Netlify
- Vercel
- GitHub Pages
- Apache/Nginx server

---

## 📱 Responsive Breakpoints

- Desktop: 1400px+
- Laptop: 992px - 1399px
- Tablet: 768px - 991px
- Mobile: 320px - 767px

---

## 🔒 Security Features

- Firebase Authentication for admin access
- Firestore Security Rules
- Input validation
- XSS protection
- CSRF protection via Firebase
- Secure file uploads

---

## 📊 Firestore Collections

| Collection | Description |
|------------|-------------|
| `users` | Admin users |
| `news` | News articles |
| `events` | School events |
| `gallery` | Gallery images |
| `teachers` | Teacher profiles |
| `students` | Student records |
| `notices` | Notice board items |
| `programs` | Academic programs |
| `testimonials` | Parent testimonials |
| `homepage` | Homepage content |
| `settings` | Site settings |
| `contact` | Contact messages |
| `faq` | FAQ items |
| `downloads` | Downloadable files |

---

## 🛠️ Admin Features

### Dashboard
- Quick statistics overview
- Recent activity log
- Quick action buttons

### News Management
- Create/Edit/Delete news
- Rich text editor support
- Image upload
- Publish/Draft status
- Categories

### Gallery Management
- Upload multiple images
- Create albums/categories
- Delete/Replace images
- Automatic compression

### Teacher Management
- Add teacher profile
- Upload photo
- Qualifications
- Social links

### Settings
- Update contact info
- Modify homepage content
- Change counters
- Update social links

---

## 🎯 Performance Optimizations

- Lazy loading images
- Minified CSS/JS in production
- CDN for libraries
- Optimized image formats
- Efficient database queries
- Caching strategies

---

## 📝 Content Management

All content is editable through the admin panel:

1. Login to admin panel
2. Navigate to relevant section
3. Click "Edit" or "Add New"
4. Fill in details
5. Upload images if needed
6. Save/Publish

Changes reflect immediately on the website.

---

## 🆘 Support

For issues or questions:
1. Check Firebase Console for errors
2. Review browser console logs
3. Verify Firebase configuration
4. Check security rules

---

## 📄 License

This project is proprietary software for GBM School.

---

## 👨‍💻 Developer Notes

- All JavaScript is vanilla ES6+
- No build process required
- Direct CDN imports for libraries
- Firebase handles all backend needs
- Easy to extend and maintain

---

## 🔄 Updates

To update the website:
1. Login to admin panel
2. Make changes through UI
3. OR edit source files directly
4. Deploy changes

---

**Built with ❤️ for Gomendra Birta Model English School**

*Version 1.0 - 2024*
