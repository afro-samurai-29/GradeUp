import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    startAfter,
    DocumentSnapshot,
    QueryConstraint,
} from 'firebase/firestore';
import { db } from './firebase';
import {
    User,
    RewriteCenter,
    StudyResource,
    Tutor,
    TutoringSession,
    Deadline,
    UserDeadline,
    ChatMessage,
    Progress,
    Review,
} from '../types/database';

// Generic CRUD operations
export const createDocument = async <T>(
    collectionName: string,
    data: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> => {
    const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    return docRef.id;
};

export const getDocument = async <T>(
    collectionName: string,
    id: string
): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
    }
    return null;
};

export const updateDocument = async (
    collectionName: string,
    id: string,
    data: Partial<any>
): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
        ...data,
        updatedAt: new Date(),
    });
};

export const deleteDocument = async (
    collectionName: string,
    id: string
): Promise<void> => {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
};

export const getDocuments = async <T>(
    collectionName: string,
    constraints: QueryConstraint[] = []
): Promise<T[]> => {
    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    })) as T[];
};

// Rewrite Centers
export const getRewriteCenters = async (
    province?: string,
    city?: string
): Promise<RewriteCenter[]> => {
    const constraints: QueryConstraint[] = [
        where('isActive', '==', true),
        orderBy('rating', 'desc'),
    ];

    if (province) {
        constraints.push(where('address.province', '==', province));
    }
    if (city) {
        constraints.push(where('address.city', '==', city));
    }

    return getDocuments<RewriteCenter>('rewriteCenters', constraints);
};

export const getRewriteCenterById = async (id: string): Promise<RewriteCenter | null> => {
    return getDocument<RewriteCenter>('rewriteCenters', id);
};

export const createRewriteCenter = async (data: Omit<RewriteCenter, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return createDocument<RewriteCenter>('rewriteCenters', data);
};

// Study Resources
export const getStudyResources = async (
    subject?: string,
    type?: string,
    isFree?: boolean
): Promise<StudyResource[]> => {
    const constraints: QueryConstraint[] = [
        where('isApproved', '==', true),
        orderBy('downloadCount', 'desc'),
    ];

    if (subject) {
        constraints.push(where('subject', '==', subject));
    }
    if (type) {
        constraints.push(where('type', '==', type));
    }
    if (isFree !== undefined) {
        constraints.push(where('isFree', '==', isFree));
    }

    return getDocuments<StudyResource>('studyResources', constraints);
};

export const getStudyResourceById = async (id: string): Promise<StudyResource | null> => {
    return getDocument<StudyResource>('studyResources', id);
};

export const createStudyResource = async (data: Omit<StudyResource, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return createDocument<StudyResource>('studyResources', data);
};

// Tutors
export const getTutors = async (
    subject?: string,
    province?: string,
    minRating?: number
): Promise<Tutor[]> => {
    const constraints: QueryConstraint[] = [
        where('isActive', '==', true),
        where('isVerified', '==', true),
        orderBy('rating', 'desc'),
    ];

    if (subject) {
        constraints.push(where('subjects', 'array-contains', subject));
    }
    if (minRating) {
        constraints.push(where('rating', '>=', minRating));
    }

    return getDocuments<Tutor>('tutors', constraints);
};

export const getTutorById = async (id: string): Promise<Tutor | null> => {
    return getDocument<Tutor>('tutors', id);
};

export const createTutor = async (data: Omit<Tutor, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return createDocument<Tutor>('tutors', data);
};

// Tutoring Sessions
export const getTutoringSessions = async (userId: string, role: 'student' | 'tutor'): Promise<TutoringSession[]> => {
    const field = role === 'student' ? 'studentId' : 'tutorId';
    const constraints: QueryConstraint[] = [
        where(field, '==', userId),
        orderBy('scheduledDate', 'desc'),
    ];

    return getDocuments<TutoringSession>('tutoringSessions', constraints);
};

export const createTutoringSession = async (data: Omit<TutoringSession, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return createDocument<TutoringSession>('tutoringSessions', data);
};

// Deadlines
export const getDeadlines = async (): Promise<Deadline[]> => {
    const constraints: QueryConstraint[] = [
        orderBy('dueDate', 'asc'),
    ];

    return getDocuments<Deadline>('deadlines', constraints);
};

export const getUserDeadlines = async (userId: string): Promise<UserDeadline[]> => {
    const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
    ];

    return getDocuments<UserDeadline>('userDeadlines', constraints);
};

// Chat Messages
export const getChatMessages = async (sessionId: string): Promise<ChatMessage[]> => {
    const constraints: QueryConstraint[] = [
        where('sessionId', '==', sessionId),
        orderBy('timestamp', 'asc'),
    ];

    return getDocuments<ChatMessage>('chatMessages', constraints);
};

export const createChatMessage = async (data: Omit<ChatMessage, 'id'>): Promise<string> => {
    return createDocument<ChatMessage>('chatMessages', data);
};

// Progress Tracking
export const getUserProgress = async (userId: string, subject?: string): Promise<Progress[]> => {
    const constraints: QueryConstraint[] = [
        where('userId', '==', userId),
        orderBy('completedAt', 'desc'),
    ];

    if (subject) {
        constraints.push(where('subject', '==', subject));
    }

    return getDocuments<Progress>('progress', constraints);
};

export const createProgress = async (data: Omit<Progress, 'id'>): Promise<string> => {
    return createDocument<Progress>('progress', data);
};

// Reviews
export const getReviews = async (targetId: string, targetType: 'center' | 'tutor'): Promise<Review[]> => {
    const constraints: QueryConstraint[] = [
        where('targetId', '==', targetId),
        where('targetType', '==', targetType),
        orderBy('createdAt', 'desc'),
    ];

    return getDocuments<Review>('reviews', constraints);
};

export const createReview = async (data: Omit<Review, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    return createDocument<Review>('reviews', data);
};
