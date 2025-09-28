# AI Tutor Plugin

A comprehensive, production-ready AI tutor plugin that can be integrated into any React application. This plugin provides intelligent tutoring capabilities with RAG (Retrieval-Augmented Generation), conversation management, and advanced UI components.

## Features

- 🤖 **Intelligent AI Tutoring** with RAG-powered responses
- 💬 **Smart Conversation Management** with sliding window pattern
- 🔥 **Firebase Integration** with Cloud Functions
- 📝 **Advanced Markdown Rendering** with LaTeX and syntax highlighting
- ⚡ **Cold Start Optimization** for faster responses
- 🎯 **Topic-based Learning** with configurable subjects
- 📊 **Real-time Analytics** and metadata tracking
- 🎨 **Modern UI Components** with dark/light mode support

## Quick Start

### 1. Installation

```bash
npm install ai-tutor-plugin
```

### 2. Firebase Setup

1. Create a Firebase project
2. Enable Firestore and Cloud Functions
3. Deploy the provided Firebase functions
4. Configure your Firebase config

### 3. Basic Usage

```tsx
import { AITutorPlugin } from 'ai-tutor-plugin';
import { FirebaseProvider } from 'ai-tutor-plugin/providers';

function App() {
  return (
    <FirebaseProvider config={firebaseConfig}>
      <AITutorPlugin 
        topics={availableTopics}
        onMessageSent={(message) => console.log('Message sent:', message)}
      />
    </FirebaseProvider>
  );
}
```

## Architecture

### Core Components

- **AITutorPlugin**: Main plugin component with chat interface
- **ConversationService**: Manages conversation state and history
- **FirebaseRAGApiService**: Handles RAG queries and AI responses
- **MarkdownFormatter**: Renders markdown with LaTeX and code highlighting

### Firebase Functions

- **ragQuery**: Main RAG query function with embeddings and similarity search
- **testEmbeddings**: Health check and embeddings validation

### Smart Features

- **Sliding Window**: Maintains only last 10 messages for optimal performance
- **Cold Start Optimization**: Loads RAG context on first query, then uses conversation history
- **Metadata Tracking**: Tracks chunks used, similarity scores, and query times
- **Error Handling**: Comprehensive error handling with fallback responses

## Configuration

### Topics Configuration

```typescript
const availableTopics = [
  {
    id: "probability",
    name: "Probability",
    path: "notes/content/mathematics/probability",
    icon: TrendingUp,
    description: "Probability theory, conditional probability, and statistics"
  },
  {
    id: "functions", 
    name: "Functions",
    path: "notes/content/mathematics/functions",
    icon: Zap,
    description: "Mathematical functions, calculus, and analysis"
  }
];
```

### Firebase Configuration

```typescript
const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-app-id"
};
```

## API Reference

### AITutorPlugin Props

| Prop | Type | Description |
|------|------|-------------|
| `topics` | `Topic[]` | Available learning topics |
| `onMessageSent` | `(message: Message) => void` | Callback when message is sent |
| `onResponseReceived` | `(response: Message) => void` | Callback when AI responds |
| `initialMessages` | `Message[]` | Initial conversation messages |
| `className` | `string` | Additional CSS classes |

### ConversationService Methods

- `createConversation(userId, title, topic)`: Create new conversation
- `addMessage(conversationId, content, role, metadata)`: Add message with sliding window
- `getMessagesForContext(conversationId)`: Get conversation history
- `injectRAGContext(conversationId, ragResponse, userQuery, topics)`: Inject RAG context

### FirebaseRAGApiService Methods

- `queryRAG(request)`: Query RAG system with full response
- `queryRAGSimplified(request)`: Get simplified response format
- `healthCheck(topic)`: Check RAG system health
- `testEmbeddings(topic)`: Test embeddings document structure

## Deployment

### Firebase Functions Deployment

```bash
# Install dependencies
cd functions
npm install

# Build and deploy
npm run build
firebase deploy --only functions
```

### Frontend Integration

1. Copy the plugin files to your project
2. Install required dependencies
3. Configure Firebase
4. Import and use the plugin components

## Dependencies

### Required Dependencies

```json
{
  "react": "^18.0.0",
  "firebase": "^10.0.0",
  "lucide-react": "^0.263.0",
  "react-syntax-highlighter": "^15.5.0",
  "react-katex": "^3.0.0",
  "katex": "^0.16.0"
}
```

### Firebase Functions Dependencies

```json
{
  "firebase-admin": "^12.0.0",
  "firebase-functions": "^4.8.0",
  "@google/generative-ai": "^0.2.1"
}
```

## Environment Variables

### Frontend

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=your-app-id
```

### Firebase Functions

```env
DEEPSEEK_API_KEY=your-deepseek-api-key
GOOGLE_AI_API_KEY=your-google-ai-api-key
```

## Advanced Usage

### Custom Topics

```typescript
const customTopics = [
  {
    id: "physics",
    name: "Physics",
    path: "notes/content/physics/mechanics",
    icon: Atom,
    description: "Classical mechanics and quantum physics"
  }
];
```

### Custom Styling

```tsx
<AITutorPlugin 
  className="custom-ai-tutor"
  topics={topics}
  style={{
    '--ai-tutor-primary': '#your-color',
    '--ai-tutor-secondary': '#your-color'
  }}
/>
```

### Event Handling

```typescript
const handleMessageSent = (message: Message) => {
  // Track user engagement
  analytics.track('ai_tutor_message_sent', {
    topic: message.topic,
    length: message.content.length
  });
};

const handleResponseReceived = (response: Message) => {
  // Track AI performance
  analytics.track('ai_tutor_response_received', {
    chunks_used: response.metadata?.chunks_used,
    similarity: response.metadata?.similarity
  });
};
```

## Troubleshooting

### Common Issues

1. **Firebase Functions not responding**: Check deployment and API keys
2. **RAG context not loading**: Verify embeddings documents exist in Firestore
3. **LaTeX not rendering**: Ensure katex CSS is imported
4. **Conversation history not persisting**: Check Firestore rules and permissions

### Debug Mode

Enable debug logging:

```typescript
import { setDebugMode } from 'ai-tutor-plugin/utils';

setDebugMode(true);
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the examples in the `/examples` folder
