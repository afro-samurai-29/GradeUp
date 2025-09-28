# Firebase Setup Guide for GradeUp Matric Rewrite Portal

## 1. Firebase Project Setup

### Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `gradeup-matric-portal`
4. Enable Google Analytics (optional)
5. Create project

### Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Optionally enable "Google" provider

### Enable Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location (choose closest to your users)
5. Click "Done"

### Enable Storage (for file uploads)
1. Go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode"
4. Select same location as Firestore
5. Click "Done"

## 2. Firebase Configuration

### Get Firebase Config
1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register app with nickname: `gradeup-web`
5. Copy the config object

### Update Firebase Config
Replace the placeholder values in `src/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## 3. Firestore Security Rules

### Development Rules (Test Mode)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

### Production Rules (Recommended)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public data - anyone can read
    match /rewriteCenters/{centerId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    match /studyResources/{resourceId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'tutor'];
    }
    
    match /tutors/{tutorId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role in ['admin', 'tutor'];
    }
    
    match /deadlines/{deadlineId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // User-specific data
    match /userDeadlines/{userDeadlineId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /tutoringSessions/{sessionId} {
      allow read, write: if request.auth != null && 
        (resource.data.studentId == request.auth.uid || 
         resource.data.tutorId == request.auth.uid);
    }
    
    match /chatMessages/{messageId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /progress/{progressId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /reviews/{reviewId} {
      allow read: if true;
      allow write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## 4. Sample Data Structure

### Users Collection
```json
{
  "users": {
    "user1": {
      "email": "student@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "student",
      "phoneNumber": "+27123456789",
      "address": {
        "street": "123 Main St",
        "city": "Johannesburg",
        "province": "Gauteng",
        "postalCode": "2000"
      },
      "subjects": ["Mathematics", "Physical Sciences"],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Rewrite Centers Collection
```json
{
  "rewriteCenters": {
    "center1": {
      "name": "Johannesburg Adult Education Center",
      "description": "Premier adult education facility specializing in matric rewrite programs",
      "address": {
        "street": "456 Education Ave",
        "city": "Johannesburg",
        "province": "Gauteng",
        "postalCode": "2001",
        "coordinates": {
          "lat": -26.2041,
          "lng": 28.0473
        }
      },
      "contactInfo": {
        "phone": "+27111234567",
        "email": "info@jhb-adult-ed.co.za",
        "website": "https://jhb-adult-ed.co.za"
      },
      "services": [
        "Matric Rewrite Registration",
        "Subject-specific Tutoring",
        "Past Paper Practice",
        "Exam Preparation",
        "Career Guidance"
      ],
      "fees": {
        "registrationFee": 500,
        "subjectFee": 1200,
        "currency": "ZAR"
      },
      "operatingHours": {
        "monday": { "open": "08:00", "close": "17:00", "isOpen": true },
        "tuesday": { "open": "08:00", "close": "17:00", "isOpen": true },
        "wednesday": { "open": "08:00", "close": "17:00", "isOpen": true },
        "thursday": { "open": "08:00", "close": "17:00", "isOpen": true },
        "friday": { "open": "08:00", "close": "15:00", "isOpen": true },
        "saturday": { "open": "09:00", "close": "13:00", "isOpen": true },
        "sunday": { "open": "09:00", "close": "13:00", "isOpen": false }
      },
      "facilities": [
        "Computer Lab",
        "Library",
        "Study Rooms",
        "Parking",
        "Cafeteria"
      ],
      "rating": 4.5,
      "reviewCount": 127,
      "images": ["image1.jpg", "image2.jpg"],
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Study Resources Collection
```json
{
  "studyResources": {
    "resource1": {
      "title": "Mathematics Paper 1 - November 2023",
      "description": "Complete past paper with detailed solutions and marking guidelines",
      "type": "past_paper",
      "subject": "Mathematics",
      "grade": "12",
      "year": 2023,
      "fileUrl": "https://storage.googleapis.com/gradeup-resources/math-paper1-2023.pdf",
      "thumbnailUrl": "https://storage.googleapis.com/gradeup-resources/math-paper1-2023-thumb.jpg",
      "tags": ["algebra", "calculus", "trigonometry", "functions"],
      "difficulty": "intermediate",
      "downloadCount": 1247,
      "isFree": true,
      "currency": "ZAR",
      "uploadedBy": "admin-user-id",
      "isApproved": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Tutors Collection
```json
{
  "tutors": {
    "tutor1": {
      "userId": "tutor-user-id",
      "bio": "Experienced mathematics teacher with 8 years of experience helping students achieve their matric goals",
      "qualifications": [
        "BSc Mathematics",
        "PGCE Education",
        "TEFL Certificate"
      ],
      "subjects": ["Mathematics", "Physical Sciences"],
      "hourlyRate": 250,
      "currency": "ZAR",
      "experience": 8,
      "rating": 4.8,
      "reviewCount": 45,
      "availability": {
        "monday": { "start": "14:00", "end": "20:00", "isAvailable": true },
        "tuesday": { "start": "14:00", "end": "20:00", "isAvailable": true },
        "wednesday": { "start": "14:00", "end": "20:00", "isAvailable": true },
        "thursday": { "start": "14:00", "end": "20:00", "isAvailable": true },
        "friday": { "start": "14:00", "end": "18:00", "isAvailable": true },
        "saturday": { "start": "09:00", "end": "15:00", "isAvailable": true },
        "sunday": { "start": "09:00", "end": "15:00", "isAvailable": false }
      },
      "languages": ["English", "Afrikaans"],
      "teachingMethods": [
        "Visual Learning",
        "Problem-solving Approach",
        "Interactive Sessions",
        "Past Paper Practice"
      ],
      "isVerified": true,
      "isActive": true,
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### Deadlines Collection
```json
{
  "deadlines": {
    "deadline1": {
      "title": "Matric Rewrite Registration Deadline",
      "description": "Final deadline for registering for the June 2024 matric rewrite examinations",
      "type": "registration",
      "dueDate": "2024-03-31T23:59:59Z",
      "subject": "All Subjects",
      "centerId": "center1",
      "isImportant": true,
      "reminderDays": [30, 14, 7, 1],
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

## 5. Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

## 6. Testing the Setup

### Test Authentication
1. Run your app: `npm run dev`
2. Try signing up with a test email
3. Check Firebase Console → Authentication to see the user

### Test Firestore
1. Try accessing the centers page
2. Check Firebase Console → Firestore to see if data is being read
3. Add some sample data manually in the console

### Test Storage
1. Try uploading a file (if implemented)
2. Check Firebase Console → Storage

## 7. Deployment Considerations

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Build and deploy: `npm run build && firebase deploy`

### Environment Configuration
- Use different Firebase projects for development and production
- Update security rules for production
- Set up proper user roles and permissions
- Configure CORS settings if needed

## 8. Next Steps

1. **Authentication Integration**: Connect Firebase Auth with your login/signup forms
2. **Real Data**: Replace mock data with actual South African matric rewrite centers
3. **File Upload**: Implement file upload for study resources
4. **Notifications**: Set up Firebase Cloud Messaging for deadline reminders
5. **Analytics**: Add Firebase Analytics to track user engagement
6. **Performance**: Optimize Firestore queries and implement caching

## Support

For Firebase-specific issues:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Support](https://firebase.google.com/support)
- [Firebase Community](https://firebase.community/)
