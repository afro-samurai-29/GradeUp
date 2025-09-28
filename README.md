# GradeUp - Matric Rewrite & Adult Education Access Portal 🎓

A comprehensive platform designed to help South African students access matric rewrite opportunities, find study resources, connect with tutors, and track important deadlines.

## 🌟 Features

### 🏢 Rewrite Centers Directory
- **Location-based search** - Find centers by province and city
- **Detailed center information** - Contact details, fees, services, and facilities
- **Reviews and ratings** - See what other students say about each center
- **Operating hours** - Know when centers are open

### 📚 Study Resources Hub
- **Past papers** - Access previous matric exam papers with solutions
- **Study guides** - Comprehensive guides for all subjects
- **Video lessons** - Visual learning materials
- **Practice tests** - Test your knowledge with interactive quizzes
- **Free and premium content** - Mix of free resources and paid materials

### 👨‍🏫 Tutor Network
- **Qualified tutors** - Verified educators with relevant qualifications
- **Subject specialization** - Find tutors for specific subjects
- **Flexible scheduling** - Book sessions that fit your schedule
- **Rating system** - Choose tutors based on student feedback
- **Direct communication** - Chat with tutors before booking

### 📅 Deadline Tracker
- **Important dates** - Never miss registration or exam deadlines
- **Smart notifications** - Get reminded before deadlines approach
- **Progress tracking** - Monitor your preparation timeline
- **Institution contacts** - Quick access to center contact information

### 🤖 AI Study Assistant
- **24/7 help** - Get instant answers to study questions
- **Subject-specific guidance** - Tailored help for math, science, languages
- **Study tips** - Personalized learning strategies
- **Problem solving** - Step-by-step solutions to complex problems

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Lovable UI (shadcn/ui)
- **Styling**: Tailwind CSS
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GradeUp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Follow the [Firebase Setup Guide](./FIREBASE_SETUP.md)
   - Create a Firebase project
   - Enable Authentication, Firestore, and Storage
   - Update `src/lib/firebase.ts` with your config

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── Header.tsx      # Navigation header
│   ├── Hero.tsx        # Landing page hero section
│   └── AIChatbox.tsx   # AI assistant chat widget
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page
│   ├── LoginPage.tsx   # User authentication
│   ├── SignupPage.tsx  # User registration
│   ├── DashboardPage.tsx # User dashboard
│   ├── RewriteCentersPage.tsx # Centers directory
│   ├── StudyResourcesPage.tsx # Resources hub
│   ├── TutorNetworkPage.tsx # Tutor marketplace
│   └── DeadlineTrackerPage.tsx # Deadline management
├── lib/                # Utility libraries
│   ├── firebase.ts     # Firebase configuration
│   ├── firestore.ts    # Firestore operations
│   └── utils.ts        # General utilities
├── types/              # TypeScript type definitions
│   └── database.ts     # Database schema types
├── hooks/              # Custom React hooks
└── assets/             # Static assets
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file:
```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Enable Storage
5. Update security rules (see Firebase Setup Guide)

## 📱 Pages Overview

### 🏠 Home Page
- Hero section with key features
- Statistics and testimonials
- Call-to-action buttons
- Feature highlights

### 🏢 Centers Page (`/centers`)
- Search and filter centers by location
- Detailed center cards with ratings
- Contact information and services
- Map integration (future feature)

### 📚 Resources Page (`/resources`)
- Browse study materials by subject/type
- Download past papers and guides
- Watch video lessons
- Filter by difficulty and price

### 👨‍🏫 Tutors Page (`/tutors`)
- Find qualified tutors by subject
- View tutor profiles and ratings
- Book tutoring sessions
- Direct messaging with tutors

### 📅 Deadlines Page (`/deadlines`)
- Track important dates
- Set reminders
- View upcoming deadlines
- Mark completed tasks

### 🤖 AI Assistant
- Floating chat widget
- Instant study help
- Subject-specific guidance
- Available on all pages

## 🎯 Target Audience

- **Matric rewrite students** - Adults seeking to improve their matric results
- **Adult learners** - Individuals returning to education
- **Parents/Guardians** - Supporting their children's education
- **Tutors** - Educators looking to help students
- **Education centers** - Institutions offering matric rewrite programs

## 🌍 South African Context

This platform is specifically designed for the South African education system:

- **NSC (National Senior Certificate)** - Matric qualification
- **Provincial coverage** - All 9 provinces included
- **Local languages** - Support for English and Afrikaans
- **Currency** - South African Rand (ZAR)
- **Education system** - Aligned with Department of Basic Education standards

## 🚀 Future Enhancements

### Phase 2 Features
- **Mobile app** - React Native version
- **Offline support** - Download resources for offline use
- **Video calling** - Integrated tutoring sessions
- **Payment integration** - Pay for premium resources
- **Progress analytics** - Detailed learning insights

### Phase 3 Features
- **AI-powered recommendations** - Personalized study plans
- **Community features** - Student forums and study groups
- **Gamification** - Points, badges, and achievements
- **Integration with LMS** - Connect with learning management systems

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lovable UI** - For the beautiful component library
- **Firebase** - For the robust backend infrastructure
- **South African Education Community** - For insights and feedback
- **Open Source Community** - For the amazing tools and libraries

## 📞 Support

- **Email**: support@gradeup.co.za
- **Documentation**: [Firebase Setup Guide](./FIREBASE_SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)

## 🎉 Hackathon Note

This project was created for the **AI in Action Hackathon** focusing on **Access to Education**. The platform addresses the critical need for accessible matric rewrite opportunities in South Africa, combining modern technology with educational support to help students achieve their academic goals.

---

**Made with ❤️ for South African students pursuing their educational dreams.**