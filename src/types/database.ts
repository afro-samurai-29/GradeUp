// Database types for GradeUp Matric Rewrite Portal

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'tutor' | 'admin';
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
  };
  subjects?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RewriteCenter {
  id: string;
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    province: string;
    postalCode: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contactInfo: {
    phone: string;
    email: string;
    website?: string;
  };
  services: string[];
  fees: {
    registrationFee: number;
    subjectFee: number;
    currency: string;
  };
  operatingHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  facilities: string[];
  rating: number;
  reviewCount: number;
  images: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Subject document in resources collection
export interface Subject {
  id: string;
  name: string;
  grade: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

// Note document in resources/{subjectId}/notes subcollection
export interface Note {
  id: string;
  title: string;
  description?: string;
  format?: string;
  url?: string;
  content?: string;
  topic?: string;
  videoRef?: string;
  uploadedAt?: string;

  // Metadata
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  downloadCount?: number;
  isFree: boolean;
  price?: number;
  currency: string;
  uploadedBy: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Past paper document in resources/{subjectId}/pastPapers subcollection
export interface PastPaper {
  id: string;
  title?: string;
  year: number;
  exam: string;
  subject: string;
  url: string;

  // Metadata
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  downloadCount?: number;
  isFree: boolean;
  price?: number;
  currency: string;
  uploadedBy: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Question document in resources/{subjectId}/questions subcollection
export interface Question {
  id: string;
  topic: string;
  questionText: string;
  options?: string[];
  correctAnswer?: string;
  solution?: string;
  videoRef?: string;

  // Metadata
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  isFree: boolean;
  uploadedBy: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Video document in resources/{subjectId}/videos subcollection
export interface Video {
  id: string;
  title: string;
  url: string;
  description?: string;
  thumbnailUrl?: string;
  duration?: number; // minutes
  uploadedAt?: string;

  // Metadata
  tags?: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  downloadCount?: number;
  isFree: boolean;
  price?: number;
  currency: string;
  uploadedBy: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
}


export interface Tutor {
  id: string;
  userId: string; // reference to User
  bio: string;
  qualifications: string[];
  subjects: string[];
  hourlyRate: number;
  currency: string;
  experience: number; // years
  rating: number;
  reviewCount: number;
  availability: {
    [key: string]: {
      start: string;
      end: string;
      isAvailable: boolean;
    };
  };
  languages: string[];
  teachingMethods: string[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TutoringSession {
  id: string;
  studentId: string;
  tutorId: string;
  subject: string;
  scheduledDate: Date;
  duration: number; // in minutes
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string;
  notes?: string;
  rating?: number;
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Deadline {
  id: string;
  title: string;
  description: string;
  type: 'registration' | 'exam' | 'application' | 'payment';
  dueDate: Date;
  subject?: string;
  centerId?: string; // reference to RewriteCenter
  isImportant: boolean;
  reminderDays: number[]; // days before deadline to send reminders
  createdAt: Date;
  updatedAt: Date;
}

export interface UserDeadline {
  id: string;
  userId: string;
  deadlineId: string;
  isCompleted: boolean;
  completedAt?: Date;
  reminderSent: boolean[];
  createdAt: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  isAI: boolean;
  timestamp: Date;
  sessionId: string;
}

export interface Progress {
  id: string;
  userId: string;
  subject: string;
  topic: string;
  score: number;
  maxScore: number;
  completedAt: Date;
  resourceId?: string; // reference to StudyResource
}

export interface Review {
  id: string;
  userId: string;
  targetId: string; // centerId or tutorId
  targetType: 'center' | 'tutor';
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

