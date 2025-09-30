"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEmbeddings = exports.ragQuery = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
// Initialize Firebase Admin
admin.initializeApp();
// Using DeepSeek for AI responses
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || 'PLACE API KEY HERE';
const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
// Google AI for embeddings (this works)
const GOOGLE_AI_API_KEY = process.env.GOOGLE_AI_API_KEY || 'AIzaSyAQxWPIUjQSgNrj39gcZWoqAXml-C7zm-s';
// Initialize Google AI for embeddings
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(GOOGLE_AI_API_KEY);
// Topic to document path mapping
const TOPIC_PATHS = {
    'probability': 'notes/content/mathematics/probability',
    'functions': 'notes/content/mathematics/functions',
    'physics': 'notes/content/physics/mechanics',
    'chemistry': 'notes/content/chemistry/organic',
    'programming': 'notes/content/computer-science/programming',
    'history': 'notes/content/history/world',
    'general': 'notes/content/general/knowledge'
};
/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(vecA, vecB) {
    if (vecA.length !== vecB.length) {
        throw new Error('Vectors must have the same length');
    }
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    normA = Math.sqrt(normA);
    normB = Math.sqrt(normB);
    if (normA === 0 || normB === 0) {
        return 0;
    }
    return dotProduct / (normA * normB);
}
/**
 * Generate embedding for text using Google's text-embedding-004 model
 */
async function generateEmbedding(text) {
    try {
        console.log('Generating embedding for text:', text.substring(0, 100) + '...');
        const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
        const result = await model.embedContent(text);
        console.log('Embedding generated successfully, length:', result.embedding.values.length);
        return result.embedding.values;
    }
    catch (error) {
        console.error('Error generating embedding:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        throw new Error(`Failed to generate embedding: ${errorMessage}`);
    }
}
/**
 * Get top K most similar chunks based on cosine similarity
 */
function getTopSimilarChunks(queryEmbedding, chunks, topK = 4) {
    const similarities = [];
    for (const chunk of chunks) {
        const similarity = cosineSimilarity(queryEmbedding, chunk.embedding);
        similarities.push({ chunk, similarity });
    }
    // Sort by similarity in descending order and return top K
    return similarities
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, topK);
}
/**
 * Generate AI response using DeepSeek with context and conversation history
 */
async function generateAIResponse(userQuery, contextChunks, systemPrompt, conversationHistory) {
    try {
        console.log('Initializing Gemini model...');
        // Combine context chunks
        const context = contextChunks
            .map((chunk, index) => `Context ${index + 1}:\n${chunk.content}`)
            .join('\n\n');
        // Build messages array with conversation history
        const messages = [];
        // Add system prompt
        messages.push({
            role: 'system',
            content: systemPrompt || 'You are an expert AI tutor. Provide comprehensive, detailed, and educational explanations. Use the provided context and conversation history to give thorough answers. Include examples, step-by-step explanations, and mathematical notation when appropriate. Be thorough and complete in your responses.'
        });
        // Add conversation history if provided
        if (conversationHistory && conversationHistory.length > 0) {
            console.log(`Adding ${conversationHistory.length} messages from conversation history`);
            conversationHistory.forEach(msg => {
                messages.push({
                    role: msg.role,
                    content: msg.content
                });
            });
        }
        // Add current context and user query
        const currentPrompt = `Context Information:
${context}

User Question: ${userQuery}

Please provide a comprehensive, detailed answer based on the context above and our conversation history. Include:
- Clear explanations with examples
- Step-by-step breakdowns when appropriate
- Mathematical notation and formulas
- Real-world applications
- Complete information without truncation

If the context doesn't contain enough information to answer the question, please say so and provide what information you can.`;
        messages.push({
            role: 'user',
            content: currentPrompt
        });
        console.log('Generating content with DeepSeek...');
        console.log(`Total messages in context: ${messages.length}`);
        // Use DeepSeek API for AI responses with timeout handling
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
            console.log('DeepSeek API timeout - aborting request');
            controller.abort();
        }, 25000); // 25 second timeout
        try {
            const response = await fetch(DEEPSEEK_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 4000,
                    stream: false
                }),
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.choices || !data.choices[0] || !data.choices[0].message) {
                throw new Error('Invalid response format from DeepSeek API');
            }
            const text = data.choices[0].message.content;
            if (!text || text.trim().length === 0) {
                throw new Error('Empty response from DeepSeek API');
            }
            console.log('DeepSeek response generated successfully, length:', text.length);
            return text;
        }
        catch (fetchError) {
            clearTimeout(timeoutId);
            if (fetchError.name === 'AbortError') {
                console.error('DeepSeek API request timed out after 25 seconds');
                throw new Error('DeepSeek API timeout - request took too long');
            }
            console.error('DeepSeek API fetch error:', fetchError);
            throw new Error(`DeepSeek API error: ${fetchError.message}`);
        }
    }
    catch (error) {
        console.error('Error generating AI response:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Detailed AI error:', errorMessage);
        // Provide a fallback response based on the context chunks
        console.log('Using fallback response based on context...');
        return generateFallbackResponse(userQuery, contextChunks);
    }
}
/**
 * Generate a fallback response when AI model fails
 */
function generateFallbackResponse(userQuery, contextChunks) {
    // Create a more intelligent response by analyzing the query and chunks
    const queryLower = userQuery.toLowerCase();
    // Extract and organize content by relevance
    let response = `Based on your question "${userQuery}", here's what I found in the content:\n\n`;
    // Look for specific topics in the query
    if (queryLower.includes('what is') || queryLower.includes('define') || queryLower.includes('definition')) {
        response += "**Definitions:**\n";
        const definitionChunks = contextChunks.filter(chunk => chunk.content.toLowerCase().includes('definition') ||
            chunk.content.toLowerCase().includes('experiment') ||
            chunk.content.toLowerCase().includes('outcome'));
        definitionChunks.forEach((chunk, index) => {
            let content = cleanContent(chunk.content);
            response += `${index + 1}. ${content.substring(0, 800)}...\n\n`;
        });
    }
    if (queryLower.includes('axiom') || queryLower.includes('rule') || queryLower.includes('law')) {
        response += "**Key Concepts:**\n";
        const axiomChunks = contextChunks.filter(chunk => chunk.content.toLowerCase().includes('axiom') ||
            chunk.content.toLowerCase().includes('p(a)') ||
            chunk.content.toLowerCase().includes('probability of event'));
        axiomChunks.forEach((chunk, index) => {
            let content = cleanContent(chunk.content);
            response += `${index + 1}. ${content.substring(0, 800)}...\n\n`;
        });
    }
    if (queryLower.includes('conditional') || queryLower.includes('given')) {
        response += "**Conditional Concepts:**\n";
        const conditionalChunks = contextChunks.filter(chunk => chunk.content.toLowerCase().includes('conditional') ||
            chunk.content.toLowerCase().includes('p(a|b)') ||
            chunk.content.toLowerCase().includes('given that'));
        conditionalChunks.forEach((chunk, index) => {
            let content = cleanContent(chunk.content);
            response += `${index + 1}. ${content.substring(0, 800)}...\n\n`;
        });
    }
    // If no specific topic found, provide general overview
    if (!queryLower.includes('what is') && !queryLower.includes('axiom') && !queryLower.includes('conditional')) {
        response += "**Relevant Information:**\n";
        contextChunks.slice(0, 3).forEach((chunk, index) => {
            let content = cleanContent(chunk.content);
            response += `${index + 1}. ${content.substring(0, 1000)}...\n\n`;
        });
    }
    response += "This information should help answer your question about the topic.";
    return response;
}
/**
 * Clean content for better readability
 */
function cleanContent(content) {
    return content
        .replace(/^#+\s*/gm, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
        .replace(/\\\\(.*?)\\\\/g, '($1)') // Convert LaTeX to readable format
        .replace(/\n+/g, ' ') // Replace multiple newlines with single space
        .trim();
}
/**
 * Firebase Function for RAG-based question answering
 */
exports.ragQuery = functions
    .runWith({
    timeoutSeconds: 300,
    memory: '512MB'
})
    .https.onCall(async (data, context) => {
    try {
        // Validate input
        if (!data.query || typeof data.query !== 'string') {
            throw new functions.https.HttpsError('invalid-argument', 'Query parameter is required and must be a string');
        }
        const userQuery = data.query.trim();
        const systemPrompt = data.systemPrompt || undefined;
        const topK = data.topK !== undefined ? data.topK : 5; // Allow 0 as valid value
        const topic = data.topic || 'probability';
        const conversationHistory = data.conversationHistory || [];
        if (userQuery.length === 0) {
            throw new functions.https.HttpsError('invalid-argument', 'Query cannot be empty');
        }
        // Validate topic
        if (!TOPIC_PATHS[topic]) {
            throw new functions.https.HttpsError('invalid-argument', `Invalid topic: ${topic}. Available topics: ${Object.keys(TOPIC_PATHS).join(', ')}`);
        }
        console.log(`Processing query: "${userQuery}" for topic: ${topic}`);
        // Get Firestore client
        const db = admin.firestore();
        // Get document path based on topic
        const documentPath = TOPIC_PATHS[topic];
        console.log(`Fetching embeddings from: ${documentPath}`);
        // Fetch embeddings document from the specified path
        const embeddingsDoc = await db.doc(documentPath).get();
        if (!embeddingsDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Embeddings document not found at the specified path');
        }
        const docData = embeddingsDoc.data();
        console.log('Document data:', JSON.stringify(docData, null, 2));
        if (!docData) {
            throw new functions.https.HttpsError('not-found', 'Document data not found');
        }
        // Check if embeddings is a field or if the document itself contains the embeddings data
        let embeddingsData;
        if (docData.embeddings) {
            // Check if embeddings is a string (JSON) or already an object
            if (typeof docData.embeddings === 'string') {
                try {
                    embeddingsData = JSON.parse(docData.embeddings);
                }
                catch (parseError) {
                    console.error('Error parsing embeddings JSON:', parseError);
                    throw new functions.https.HttpsError('invalid-argument', 'Embeddings field contains invalid JSON');
                }
            }
            else {
                embeddingsData = docData.embeddings;
            }
        }
        else if (docData.chunks && docData.metadata) {
            // The document itself contains the embeddings data
            embeddingsData = docData;
        }
        else {
            // Log the actual document structure for debugging
            console.log('Document structure:', Object.keys(docData));
            console.log('Available fields:', JSON.stringify(docData, null, 2));
            throw new functions.https.HttpsError('not-found', `Embeddings data not found in document. Available fields: ${Object.keys(docData).join(', ')}`);
        }
        // Validate that chunks exist and is an array
        if (!embeddingsData.chunks || !Array.isArray(embeddingsData.chunks)) {
            console.log('Chunks structure:', embeddingsData.chunks);
            throw new functions.https.HttpsError('not-found', `Chunks data is not an array. Type: ${typeof embeddingsData.chunks}, Value: ${JSON.stringify(embeddingsData.chunks)}`);
        }
        console.log(`Found ${embeddingsData.chunks.length} chunks in embeddings document`);
        let aiResponse;
        let contextChunks = [];
        let topChunks = [];
        // Check if we need to do RAG processing (topK > 0) or use conversation history only (topK = 0)
        if (topK > 0) {
            console.log(`Performing RAG query with topK=${topK}`);
            // Generate embedding for user query
            console.log('Generating embedding for user query:', userQuery.substring(0, 100) + '...');
            const queryEmbedding = await generateEmbedding(userQuery);
            console.log('Query embedding generated, length:', queryEmbedding.length);
            // Find top similar chunks
            console.log('Calculating similarities...');
            topChunks = getTopSimilarChunks(queryEmbedding, embeddingsData.chunks, topK);
            console.log(`Found top ${topChunks.length} similar chunks`);
            console.log('Top similarities:', topChunks.map(t => t.similarity).slice(0, 3));
            contextChunks = topChunks.map(result => result.chunk);
        }
        else {
            console.log('Skipping RAG processing - using conversation history only (topK=0)');
        }
        // Generate AI response with context and conversation history
        console.log('Generating AI response...');
        aiResponse = await generateAIResponse(userQuery, contextChunks, systemPrompt, conversationHistory);
        // Return response with metadata
        return {
            success: true,
            query: userQuery,
            response: aiResponse,
            context: {
                totalChunks: embeddingsData.chunks.length,
                topChunksUsed: contextChunks.length,
                similarities: topK > 0 && topChunks.length > 0 ? topChunks.map((result) => ({
                    chunkId: result.chunk.chunk_id,
                    chunkIndex: result.chunk.chunk_index,
                    similarity: result.similarity,
                    contentPreview: result.chunk.content.substring(0, 200) + '...'
                })) : [],
                metadata: embeddingsData.metadata
            }
        };
    }
    catch (error) {
        console.error('Error in ragQuery function:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        // Provide more specific error messages
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Detailed error:', errorMessage);
        throw new functions.https.HttpsError('internal', `An internal error occurred while processing your request: ${errorMessage}`);
    }
});
/**
 * Test function to verify the embeddings document structure
 */
exports.testEmbeddings = functions
    .runWith({
    timeoutSeconds: 60,
    memory: '256MB'
})
    .https.onCall(async (data, context) => {
    try {
        const topic = data.topic || 'probability';
        // Validate topic
        if (!TOPIC_PATHS[topic]) {
            throw new functions.https.HttpsError('invalid-argument', `Invalid topic: ${topic}. Available topics: ${Object.keys(TOPIC_PATHS).join(', ')}`);
        }
        const db = admin.firestore();
        const documentPath = TOPIC_PATHS[topic];
        console.log(`Testing embeddings for topic: ${topic} at path: ${documentPath}`);
        const embeddingsDoc = await db.doc(documentPath).get();
        if (!embeddingsDoc.exists) {
            throw new functions.https.HttpsError('not-found', 'Embeddings document not found');
        }
        const docData = embeddingsDoc.data();
        console.log('Test document data:', JSON.stringify(docData, null, 2));
        if (!docData) {
            throw new functions.https.HttpsError('not-found', 'Document data not found');
        }
        // Check if embeddings is a field or if the document itself contains the embeddings data
        let embeddingsData;
        if (docData.embeddings) {
            // Check if embeddings is a string (JSON) or already an object
            if (typeof docData.embeddings === 'string') {
                try {
                    embeddingsData = JSON.parse(docData.embeddings);
                }
                catch (parseError) {
                    console.error('Error parsing embeddings JSON:', parseError);
                    throw new functions.https.HttpsError('invalid-argument', 'Embeddings field contains invalid JSON');
                }
            }
            else {
                embeddingsData = docData.embeddings;
            }
        }
        else if (docData.chunks && docData.metadata) {
            // The document itself contains the embeddings data
            embeddingsData = docData;
        }
        else {
            // Log the actual document structure for debugging
            console.log('Test document structure:', Object.keys(docData));
            console.log('Test available fields:', JSON.stringify(docData, null, 2));
            throw new functions.https.HttpsError('not-found', `Embeddings data not found in document. Available fields: ${Object.keys(docData).join(', ')}`);
        }
        // Validate that chunks exist and is an array
        if (!embeddingsData.chunks || !Array.isArray(embeddingsData.chunks)) {
            console.log('Test chunks structure:', embeddingsData.chunks);
            throw new functions.https.HttpsError('not-found', `Chunks data is not an array. Type: ${typeof embeddingsData.chunks}, Value: ${JSON.stringify(embeddingsData.chunks)}`);
        }
        return {
            success: true,
            metadata: embeddingsData.metadata,
            totalChunks: embeddingsData.chunks.length,
            sampleChunk: embeddingsData.chunks[0] ? {
                chunkId: embeddingsData.chunks[0].chunk_id,
                chunkIndex: embeddingsData.chunks[0].chunk_index,
                contentLength: embeddingsData.chunks[0].content.length,
                embeddingLength: embeddingsData.chunks[0].embedding.length,
                contentPreview: embeddingsData.chunks[0].content.substring(0, 300) + '...'
            } : null
        };
    }
    catch (error) {
        console.error('Error in testEmbeddings function:', error);
        if (error instanceof functions.https.HttpsError) {
            throw error;
        }
        // Provide more specific error messages
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('Detailed error:', errorMessage);
        throw new functions.https.HttpsError('internal', `An internal error occurred while testing embeddings: ${errorMessage}`);
    }
});
//# sourceMappingURL=index.js.map
