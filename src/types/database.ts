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

export interface StudyResource {
    id: string;
    title: string;
    description: string;
    type: 'past_paper' | 'study_guide' | 'video' | 'practice_test' | 'textbook';
    subject: string;
    grade: string;
    year?: number;
    fileUrl?: string;
    videoUrl?: string;
    thumbnailUrl?: string;
    tags: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    duration?: number; // in minutes for videos
    downloadCount: number;
    isFree: boolean;
    price?: number;
    currency: string;
    uploadedBy: string; // user ID
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
