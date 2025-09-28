import { db } from './firebase';
import { doc, setDoc, collection, addDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid'; // for generating ids

// ----------------------
// Seed Data
// ----------------------

const seedData = {
  rewriteCenters: {
    center1: {
      id: 'center1',
      name: 'Johannesburg Rewrite Center',
      description: 'Helping learners prepare for their matric rewrites.',
      address: {
        street: '123 Main St',
        city: 'Johannesburg',
        province: 'Gauteng',
        postalCode: '2000',
      },
      contactInfo: {
        phone: '+27 82 123 4567',
        email: 'info@jhbcenter.org',
      },
      services: ['Tutoring', 'Exam Preparation', 'Study Material'],
      fees: {
        registrationFee: 500,
        subjectFee: 250,
        currency: 'ZAR',
      },
      operatingHours: {
        monday: { open: '08:00', close: '17:00', isOpen: true },
        saturday: { open: '09:00', close: '13:00', isOpen: true },
      },
      facilities: ['Library', 'Computer Lab'],
      rating: 4.5,
      reviewCount: 10,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    center2: {
      id: 'center2',
      name: 'Durban Success Academy',
      description: 'Focused on matric rewrite support with a strong track record in sciences and languages.',
      address: {
        street: '45 Beach Rd',
        city: 'Durban',
        province: 'KwaZulu-Natal',
        postalCode: '4001',
      },
      contactInfo: {
        phone: '+27 83 987 6543',
        email: 'contact@dsacademy.co.za',
      },
      services: ['Tutoring', 'Exam Preparation', 'Workshops', 'Career Guidance'],
      fees: {
        registrationFee: 450,
        subjectFee: 300,
        currency: 'ZAR',
      },
      operatingHours: {
        monday: { open: '08:30', close: '17:30', isOpen: true },
        saturday: { open: '08:00', close: '14:00', isOpen: true },
      },
      facilities: ['Library', 'Study Rooms', 'Cafeteria'],
      rating: 4.7,
      reviewCount: 25,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    center3: {
      id: 'center3',
      name: 'Cape Town Matric Academy',
      description: 'Specialising in helping learners with humanities and technical subjects for matric rewrites.',
      address: {
        street: '78 Long St',
        city: 'Cape Town',
        province: 'Western Cape',
        postalCode: '8000',
      },
      contactInfo: {
        phone: '+27 72 111 2233',
        email: 'info@ctmatric.org',
      },
      services: ['Tutoring', 'Exam Preparation', 'Study Skills Training'],
      fees: {
        registrationFee: 600,
        subjectFee: 280,
        currency: 'ZAR',
      },
      operatingHours: {
        monday: { open: '09:00', close: '18:00', isOpen: true },
        saturday: { open: '09:00', close: '15:00', isOpen: true },
      },
      facilities: ['Computer Lab', 'Library', 'Resource Center'],
      rating: 4.3,
      reviewCount: 18,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },

    center4: {
      id: 'center4',
      name: 'Pretoria Academic Hub',
      description: 'A professional center supporting learners with intensive revision programs for matric rewrite.',
      address: {
        street: '56 Union Ave',
        city: 'Pretoria',
        province: 'Gauteng',
        postalCode: '0002',
      },
      contactInfo: {
        phone: '+27 84 222 8899',
        email: 'support@pretoriahub.co.za',
      },
      services: ['Intensive Revision', 'Tutoring', 'Workshops', 'Study Material'],
      fees: {
        registrationFee: 550,
        subjectFee: 320,
        currency: 'ZAR',
      },
      operatingHours: {
        monday: { open: '08:00', close: '17:00', isOpen: true },
        saturday: { open: '08:30', close: '14:30', isOpen: true },
      },
      facilities: ['Library', 'Cafeteria', 'Computer Lab'],
      rating: 4.6,
      reviewCount: 22,
      images: [],
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
  deadlines: {
    deadline1: {
      id: 'deadline1',
      title: 'Matric Rewrite June 2025',
      description: 'Final exam session for June 2025',
      type: 'exam',
      dueDate: new Date('2025-06-15'),
      isImportant: true,
      reminderDays: [30, 7, 1],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    deadline2: {
      id: 'deadline2',
      title: 'Application Deadline – June 2025 Rewrite',
      description: 'Applications close for June 2025 exams',
      type: 'application',
      dueDate: new Date('2025-03-01'),
      isImportant: true,
      reminderDays: [14, 7, 1],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },

  resources: {
    Mathematics: {
      id: 'Mathematics',
      name: 'Mathematics',
      grade: '12',
      description: 'Matric Mathematics resources',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    Isizulu: {
      id: 'Isizulu',
      name: 'IsiZulu FAL',
      grade: '12',
      description: 'Matric IsiZulu resources',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },

  // Mathematics subcollections
  mathematicsNotes: [
    {
      id: 'note1',
      title: 'Algebra Basics',
      format: 'PDF',
      url: 'https://example.com/algebra.pdf',
      uploadedAt: new Date().toISOString(),
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['algebra', 'basics'],
      difficulty: 'beginner',
      downloadCount: 0,
    },
  ],

  mathematicsPastPapers: [
    {
      id: 'paper1',
      title: 'Maths June 2023',
      year: 2023,
      exam: 'June',
      subject: 'Mathematics',
      url: 'https://example.com/maths-2023-june.pdf',
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['past paper', '2023'],
      difficulty: 'intermediate',
      downloadCount: 0,
    },
  ],

  mathematicsQuestions: [
    {
      id: 'q1',
      topic: 'Calculus',
      questionText: 'Differentiate x² + 3x',
      solution: '2x + 3',
      difficulty: 'intermediate',
      isFree: true,
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['calculus', 'differentiation'],
    },
  ],

  mathematicsVideos: [
    {
      id: 'vid1',
      title: 'Intro to Trigonometry',
      url: 'https://youtube.com/example',
      description: 'An introduction to trigonometric concepts',
      duration: 15,
      uploadedAt: new Date().toISOString(),
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user1',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['trigonometry', 'intro'],
      difficulty: 'beginner',
      downloadCount: 0,
    },
  ],

  // IsiZulu subcollections
  isizuluNotes: [
    {
      id: 'note1',
      title: 'Amabizo (Nouns) – IsiZulu FAL',
      topic: 'Nouns',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      uploadedAt: new Date().toISOString(),
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['nouns', 'amabizo'],
      difficulty: 'beginner',
      downloadCount: 0,
    },
  ],

  isizuluQuestions: [
    {
      id: 'question1',
      topic: 'Amabizo (Nouns)',
      questionText: 'Kuyini ibizo?',
      options: [
        'Igama elichaza isenzo',
        'Igama elichaza umuntu, into, indawo noma umqondo',
        'Igama elichaza umbala',
        'Igama elichaza isikhathi',
      ],
      correctAnswer: 'Igama elichaza umuntu, into, indawo noma umqondo',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'definition'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question2',
      topic: 'Amabizo (Nouns)',
      questionText: 'Yimaphi amabizo akwiqembu le-umu-/aba-?',
      options: [
        'umuntu/abantu',
        'isihlalo/izihlalo',
        'inja/izinja',
        'ulimi/izilimi',
      ],
      correctAnswer: 'umuntu/abantu',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'classes'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question3',
      topic: 'Amabizo (Nouns)',
      questionText: 'Yiliphi ibizo eliyibizoqoqo (collective noun)?',
      options: ['umfana', 'isihlalo', 'isizwe', 'inja'],
      correctAnswer: 'isizwe',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'collective'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question4',
      topic: 'Amabizo (Nouns)',
      questionText: 'Guqula ibizo: isihlalo → ?',
      options: ['abantu', 'izihlalo', 'abahlalo', 'imihlalo'],
      correctAnswer: 'izihlalo',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'plural'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question5',
      topic: 'Amabizo (Nouns)',
      questionText: 'Yisiphi isabizwana sokukhomba kule nkulumo: "Laba bafana bayadlala."',
      options: ['mina', 'wonke', 'laba', 'bona'],
      correctAnswer: 'laba',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['pronouns', 'nouns'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question6',
      topic: 'Amabizo (Nouns)',
      questionText: 'Yibaphi amabizo akwiqembu le-isi-/izi-?',
      options: [
        'isihlalo/izihlalo',
        'umuntu/abantu',
        'indlu/izindlu',
        'umlimi/abalimi',
      ],
      correctAnswer: 'isihlalo/izihlalo',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'classes'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question7',
      topic: 'Amabizo (Nouns)',
      questionText: 'Yiliphi ibizo elincishisiwe (diminutive)?',
      options: ['umfanyana', 'umfanandoda', 'umuntu', 'isizwe'],
      correctAnswer: 'umfanyana',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'diminutive'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question8',
      topic: 'Amabizo (Nouns)',
      questionText: 'Yiliphi ibizo elikhulisisiwe (augmentative)?',
      options: ['indlwana', 'umfanyana', 'umfanandoda', 'umntwana'],
      correctAnswer: 'umfanandoda',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'augmentative'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question9',
      topic: 'Amabizo (Nouns)',
      questionText: 'Igama elithi umfundi lisuselwa kusiphi isenzo?',
      options: ['-dansa', '-funda', '-hamba', '-phuza'],
      correctAnswer: '-funda',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'derived'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'question10',
      topic: 'Amabizo (Nouns)',
      questionText: 'Yimaphi amabizo aqamba imizwa?',
      options: [
        'injabulo, usizi, ulaka',
        'itiye, ikhofi, ubisi',
        'umfana, intombazane, indoda',
        'inyoka, ikati, inja',
      ],
      correctAnswer: 'injabulo, usizi, ulaka',
      videoRef: '/resources/isizulu/videos/amabizo/lesson1',
      difficulty: 'beginner',
      tags: ['nouns', 'emotions'],
      isFree: true,
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ],

  isizuluVideos: [
    {
      id: 'lesson1',
      title: 'IsiZulu Lesson 1: Amabizo (Nouns)',
      url: 'https://www.youtube.com/watch?v=yPXD8Uin3DI',
      description: 'A comprehensive lesson on IsiZulu nouns',
      duration: 10,
      uploadedAt: new Date().toISOString(),
      isFree: true,
      currency: 'ZAR',
      uploadedBy: 'user2',
      isApproved: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['isizulu', 'nouns'],
      difficulty: 'beginner',
      downloadCount: 0,
    },
  ],

  tutors: {
    tutor1: {
      id: 'tutor1',
      userId: 'user1',
      bio: 'Passionate maths tutor with 5 years of experience',
      qualifications: ['BSc Mathematics'],
      subjects: ['Mathematics'],
      hourlyRate: 200,
      currency: 'ZAR',
      experience: 5,
      rating: 4.7,
      reviewCount: 12,
      availability: {
        saturday: { start: '09:00', end: '13:00', isAvailable: true },
      },
      languages: ['English', 'Zulu'],
      teachingMethods: ['Online', 'In-person'],
      isVerified: true,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  },
};

// ----------------------
// Import Function
// ----------------------

async function importData() {
  try {
    // Import rewrite centers
    for (const [docId, data] of Object.entries(seedData.rewriteCenters)) {
      await setDoc(doc(db, 'rewriteCenters', docId), data);
      console.log(`✅ Added rewriteCenters/${docId}`);
    }

    // Import deadlines
    for (const [docId, data] of Object.entries(seedData.deadlines)) {
      await setDoc(doc(db, 'deadlines', docId), data);
      console.log(`✅ Added deadlines/${docId}`);
    }

    // Import tutors
    for (const [docId, data] of Object.entries(seedData.tutors)) {
      await setDoc(doc(db, 'tutors', docId), data);
      console.log(`✅ Added tutors/${docId}`);
    }

    // Import subjects and their subcollections
    for (const [docId, data] of Object.entries(seedData.resources)) {
      await setDoc(doc(db, 'resources', docId), data);
      console.log(`✅ Added resources/${docId}`);

      // Add subcollections based on subject
      if (docId === 'Mathematics') {
        // Add Mathematics notes
        for (const note of seedData.mathematicsNotes) {
          await addDoc(collection(db, 'resources', docId, 'notes'), note);
          console.log(`✅ Added resources/${docId}/notes/${note.id}`);
        }

        // Add Mathematics past papers
        for (const paper of seedData.mathematicsPastPapers) {
          await addDoc(collection(db, 'resources', docId, 'pastPapers'), paper);
          console.log(`✅ Added resources/${docId}/pastPapers/${paper.id}`);
        }

        // Add Mathematics questions
        for (const question of seedData.mathematicsQuestions) {
          await addDoc(collection(db, 'resources', docId, 'questions'), question);
          console.log(`✅ Added resources/${docId}/questions/${question.id}`);
        }

        // Add Mathematics videos
        for (const video of seedData.mathematicsVideos) {
          await addDoc(collection(db, 'resources', docId, 'videos'), video);
          console.log(`✅ Added resources/${docId}/videos/${video.id}`);
        }
      } else if (docId === 'Isizulu') {
        // Add IsiZulu notes
        for (const note of seedData.isizuluNotes) {
          await addDoc(collection(db, 'resources', docId, 'notes'), note);
          console.log(`✅ Added resources/${docId}/notes/${note.id}`);
        }

        // Add IsiZulu questions
        for (const question of seedData.isizuluQuestions) {
          await addDoc(collection(db, 'resources', docId, 'questions'), question);
          console.log(`✅ Added resources/${docId}/questions/${question.id}`);
        }

        // Add IsiZulu videos
        for (const video of seedData.isizuluVideos) {
          await addDoc(collection(db, 'resources', docId, 'videos'), video);
          console.log(`✅ Added resources/${docId}/videos/${video.id}`);
        }
      }
    }

    console.log('🎉 Import completed successfully!');
  } catch (error) {
    console.error('❌ Import failed:', error);
  }
}

if (require.main === module) {
  importData();
}

export { importData, seedData };
