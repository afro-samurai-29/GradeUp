# AI Tutor Plugin - Setup Guide

This guide will walk you through setting up the AI Tutor Plugin in your React application.

## Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Cloud Functions enabled
- DeepSeek API key
- Google AI API key (for embeddings)

## Step 1: Firebase Project Setup

### 1.1 Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Follow the setup wizard
4. Enable Google Analytics (optional)

### 1.2 Enable Required Services

1. **Firestore Database**:
   - Go to Firestore Database
   - Click "Create database"
   - Choose "Start in test mode" (we'll secure it later)
   - Select a location

2. **Cloud Functions**:
   - Go to Functions
   - Click "Get started"
   - Follow the setup wizard

### 1.3 Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click "Add app" → Web app
4. Register your app
5. Copy the Firebase configuration object

## Step 2: Deploy Firebase Functions

### 2.1 Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2.2 Login to Firebase

```bash
firebase login
```

### 2.3 Initialize Firebase Functions

```bash
cd ai-tutor-plugin/firebase-functions
firebase init functions
```

### 2.4 Configure Environment Variables

Create a `.env` file in the `firebase-functions` directory:

```env
DEEPSEEK_API_KEY=your-deepseek-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

### 2.5 Deploy Functions

```bash
cd ai-tutor-plugin/firebase-functions
npm install
npm run build
firebase deploy --only functions
```

## Step 3: Install Plugin Dependencies

### 3.1 Install Core Dependencies

```bash
npm install ai-tutor-plugin
```

### 3.2 Install Peer Dependencies

```bash
npm install react react-dom firebase lucide-react react-syntax-highlighter react-katex katex
```

### 3.3 Install UI Dependencies (if not using a UI library)

```bash
npm install @radix-ui/react-avatar @radix-ui/react-scroll-area @radix-ui/react-select class-variance-authority clsx tailwind-merge
```

## Step 4: Configure Your Application

### 4.1 Environment Variables

Create a `.env` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
VITE_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 4.2 Basic Integration

```tsx
import React from 'react';
import { AITutorPlugin, FirebaseProvider } from 'ai-tutor-plugin';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
  measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

const topics = [
  {
    id: "probability",
    name: "Probability",
    path: "notes/content/mathematics/probability",
    icon: TrendingUp,
    description: "Probability theory and statistics"
  }
];

function App() {
  return (
    <FirebaseProvider config={firebaseConfig}>
      <AITutorPlugin 
        topics={topics}
        onMessageSent={(message) => console.log('Message sent:', message)}
        onResponseReceived={(response) => console.log('Response received:', response)}
      />
    </FirebaseProvider>
  );
}

export default App;
```

## Step 5: Prepare Content Data

### 5.1 Create Embeddings Documents

You need to create Firestore documents with embeddings for each topic. The structure should be:

```json
{
  "metadata": {
    "title": "Probability Theory",
    "source_file": "probability_notes.md",
    "processed_at": "2024-01-01T00:00:00Z",
    "total_characters": 50000,
    "total_chunks": 100
  },
  "chunks": [
    {
      "chunk_id": "chunk_1",
      "chunk_index": 0,
      "content": "Probability is a measure of the likelihood that an event will occur...",
      "embedding": [0.1, 0.2, 0.3, ...] // 768-dimensional vector
    }
  ]
}
```

### 5.2 Document Paths

Create documents at these paths in Firestore:
- `notes/content/mathematics/probability`
- `notes/content/mathematics/functions`
- `notes/content/physics/mechanics`
- `notes/content/chemistry/organic`
- `notes/content/computer-science/programming`
- `notes/content/history/world`
- `notes/content/general/knowledge`

## Step 6: Configure Firestore Security Rules

Update your Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write access to conversations for authenticated users
    match /conversations/{conversationId} {
      allow read, write: if request.auth != null;
      
      // Allow read/write access to messages within conversations
      match /messages/{messageId} {
        allow read, write: if request.auth != null;
      }
    }
    
    // Allow read access to notes content for all users
    match /notes/{document=**} {
      allow read: if true;
    }
  }
}
```

## Step 7: Test the Integration

### 7.1 Basic Test

```tsx
import { AITutorPlugin } from 'ai-tutor-plugin';

function TestPage() {
  const handleMessageSent = (message) => {
    console.log('User sent:', message.content);
  };

  const handleResponseReceived = (response) => {
    console.log('AI responded:', response.content);
  };

  return (
    <AITutorPlugin
      topics={topics}
      onMessageSent={handleMessageSent}
      onResponseReceived={handleResponseReceived}
      debugMode={true}
    />
  );
}
```

### 7.2 Health Check

The plugin will automatically check the RAG system health. Look for:
- ✅ RAG Connected (green indicator)
- ⚡ Context Loaded (blue indicator)

## Step 8: Customization

### 8.1 Custom Topics

```tsx
const customTopics = [
  {
    id: "custom-topic",
    name: "Custom Topic",
    path: "notes/content/custom/topic",
    icon: CustomIcon,
    description: "Your custom topic description"
  }
];
```

### 8.2 Custom Styling

```tsx
<AITutorPlugin
  topics={topics}
  className="my-custom-ai-tutor"
  style={{
    '--ai-tutor-primary': '#your-color',
    '--ai-tutor-secondary': '#your-color'
  }}
/>
```

### 8.3 Advanced Configuration

```tsx
<AITutorPlugin
  topics={topics}
  userId="user-123"
  defaultTopic="probability"
  enableQuickPrompts={true}
  enableFileUpload={false}
  maxMessages={15}
  debugMode={false}
/>
```

## Troubleshooting

### Common Issues

1. **Firebase Functions not responding**:
   - Check deployment: `firebase functions:log`
   - Verify API keys in environment variables
   - Check Firestore security rules

2. **RAG context not loading**:
   - Verify embeddings documents exist in Firestore
   - Check document structure matches expected format
   - Verify topic paths are correct

3. **LaTeX not rendering**:
   - Ensure katex CSS is imported: `import 'katex/dist/katex.min.css'`
   - Check for CSS conflicts

4. **Conversation history not persisting**:
   - Check Firestore rules allow read/write
   - Verify user authentication
   - Check browser console for errors

### Debug Mode

Enable debug mode for detailed logging:

```tsx
import { setDebugMode } from 'ai-tutor-plugin/utils';

setDebugMode(true);
```

### Health Check

Test the RAG system:

```tsx
import { firebaseRagApi } from 'ai-tutor-plugin';

const testRAG = async () => {
  try {
    const health = await firebaseRagApi.healthCheck('probability');
    console.log('RAG Health:', health);
  } catch (error) {
    console.error('RAG Error:', error);
  }
};
```

## Next Steps

1. **Add Authentication**: Integrate with your auth system
2. **Customize UI**: Modify components to match your design
3. **Add Analytics**: Track user interactions
4. **Scale Content**: Add more topics and content
5. **Optimize Performance**: Monitor and optimize RAG queries

## Support

For additional help:
- Check the [README.md](./README.md) for detailed API documentation
- Review the [examples](./examples/) folder
- Create an issue on GitHub
- Check Firebase Functions logs: `firebase functions:log`
