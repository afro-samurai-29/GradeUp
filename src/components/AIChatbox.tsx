import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    MessageCircle,
    Send,
    Bot,
    User,
    Loader2,
    BookOpen,
    Calculator,
    Lightbulb,
    HelpCircle
} from 'lucide-react';
import { createChatMessage } from '@/lib/firestore';
import { ChatMessage } from '@/types/database';

interface AIChatboxProps {
    className?: string;
}

const AIChatbox = ({ className = '' }: AIChatboxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            id: '1',
            userId: 'system',
            message: "Hi! I'm your AI study assistant. I can help you with:\n\n• Math problems and solutions\n• Science concepts and explanations\n• Study tips and techniques\n• Past paper questions\n• Subject-specific guidance\n\nWhat would you like help with today?",
            isAI: true,
            timestamp: new Date(),
            sessionId: 'default'
        }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const quickActions = [
        { icon: Calculator, text: 'Math Help', prompt: 'I need help with a math problem' },
        { icon: BookOpen, text: 'Study Tips', prompt: 'Give me study tips for matric rewrite' },
        { icon: Lightbulb, text: 'Science Help', prompt: 'Explain a science concept to me' },
        { icon: HelpCircle, text: 'Past Papers', prompt: 'Help me with past paper questions' },
    ];

    const handleSendMessage = async (message?: string) => {
        const messageToSend = message || inputMessage.trim();
        if (!messageToSend) return;

        // Add user message
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            userId: 'current-user',
            message: messageToSend,
            isAI: false,
            timestamp: new Date(),
            sessionId: 'default'
        };

        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);

        try {
            // Simulate AI response (replace with actual AI API call)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiResponse = generateAIResponse(messageToSend);

            const aiMessage: ChatMessage = {
                id: (Date.now() + 1).toString(),
                userId: 'ai',
                message: aiResponse,
                isAI: true,
                timestamp: new Date(),
                sessionId: 'default'
            };

            setMessages(prev => [...prev, aiMessage]);

            // Save to Firestore (optional)
            // await createChatMessage(aiMessage);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const generateAIResponse = (userMessage: string): string => {
        const message = userMessage.toLowerCase();

        if (message.includes('math') || message.includes('calculate') || message.includes('solve')) {
            return `I'd be happy to help you with math! Here's how I can assist:

**For your math problem:**
1. **Show your work** - Even if you're stuck, share what you've tried
2. **Be specific** - Tell me the exact question or topic
3. **Step-by-step solutions** - I'll break it down for you

**Common matric math topics I can help with:**
• Algebra and equations
• Geometry and trigonometry
• Calculus basics
• Statistics and probability
• Financial mathematics

What specific math problem are you working on? Share the question and I'll guide you through the solution! 📐`;
        }

        if (message.includes('study') || message.includes('tips') || message.includes('prepare')) {
            return `Great question! Here are my top study tips for matric rewrite success:

**📚 Effective Study Strategies:**
• **Active recall** - Test yourself instead of just reading
• **Spaced repetition** - Review material at increasing intervals
• **Practice past papers** - Focus on recent years first
• **Study groups** - Explain concepts to others

**⏰ Time Management:**
• Study in 25-50 minute blocks with breaks
• Create a realistic study schedule
• Prioritize difficult subjects when you're most alert
• Set specific, achievable goals

**🧠 Memory Techniques:**
• Use mnemonics for formulas and facts
• Create mind maps for complex topics
• Teach someone else what you've learned
• Use visual aids and diagrams

What subject are you finding most challenging? I can give you specific strategies! 🎯`;
        }

        if (message.includes('science') || message.includes('physics') || message.includes('chemistry') || message.includes('biology')) {
            return `Science subjects can be challenging, but I'm here to help! Here's how I can assist:

**🔬 For Physical Sciences (Physics & Chemistry):**
• Problem-solving strategies
• Formula derivations and applications
• Lab report writing
• Concept explanations with examples

**🧬 For Life Sciences (Biology):**
• Diagram interpretations
• Process explanations (photosynthesis, respiration, etc.)
• Genetics and evolution concepts
• Practical investigation techniques

**💡 Study Approach:**
• Understand concepts before memorizing
• Practice calculations regularly
• Draw diagrams to visualize processes
• Connect theory to real-world examples

**📝 Exam Tips:**
• Read questions carefully
• Show all your working
• Use correct units and significant figures
• Manage your time effectively

What specific science topic would you like help with? Share the concept or problem! ⚗️`;
        }

        if (message.includes('past paper') || message.includes('exam') || message.includes('test')) {
            return `Past papers are your best friend for matric rewrite preparation! Here's how to use them effectively:

**📋 Past Paper Strategy:**
1. **Start with recent papers** (last 3-5 years)
2. **Time yourself** - Practice under exam conditions
3. **Mark honestly** - Use official marking guidelines
4. **Analyze mistakes** - Understand why you got questions wrong
5. **Focus on weak areas** - Spend more time on topics you struggle with

**🎯 Question Types to Master:**
• **Multiple choice** - Eliminate obviously wrong answers
• **Short answers** - Be concise and accurate
• **Long answers** - Structure your response clearly
• **Calculations** - Show all working steps

**📊 Tracking Progress:**
• Keep a record of your scores
• Identify patterns in your mistakes
• Focus on improving weak areas
• Celebrate improvements!

**💪 Confidence Building:**
• Start with easier papers and work up
• Don't get discouraged by low initial scores
• Focus on understanding, not just memorizing
• Practice regularly, not just before exams

Which subject's past papers would you like help with? I can guide you through specific questions! 📝`;
        }

        return `I understand you're looking for help with your matric rewrite studies. I'm here to support you in several ways:

**🎓 How I Can Help:**
• **Subject-specific guidance** - Math, Science, Languages, etc.
• **Study techniques** - Effective learning strategies
• **Problem solving** - Step-by-step solutions
• **Exam preparation** - Past paper strategies
• **Motivation** - Study tips and encouragement

**💬 To get the best help:**
• Be specific about what you need
• Share the exact question or topic
• Tell me what you've already tried
• Ask follow-up questions

**🚀 Quick Start:**
Try asking me about:
• "Help me solve this math problem..."
• "Explain this science concept..."
• "Give me study tips for..."
• "How do I approach past papers..."

What specific topic or question would you like help with? I'm ready to assist! 🤖✨`;
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
            {/* Chat Button */}
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="h-14 w-14 rounded-full bg-forest-primary hover:bg-forest-secondary shadow-lg"
                    size="lg"
                >
                    <MessageCircle className="h-6 w-6" />
                </Button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="w-80 h-96 shadow-xl border-0 bg-white">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Bot className="h-5 w-5 text-forest-primary" />
                                AI Study Assistant
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsOpen(false)}
                                className="h-8 w-8 p-0"
                            >
                                ×
                            </Button>
                        </div>
                    </CardHeader>

                    <CardContent className="p-0 flex flex-col h-80">
                        {/* Messages */}
                        <ScrollArea className="flex-1 px-4">
                            <div className="space-y-4 pb-4">
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
                                    >
                                        <div
                                            className={`max-w-[80%] rounded-lg p-3 ${message.isAI
                                                    ? 'bg-gray-100 text-gray-900'
                                                    : 'bg-forest-primary text-white'
                                                }`}
                                        >
                                            <div className="flex items-start gap-2">
                                                {message.isAI && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                                                <div className="text-sm whitespace-pre-wrap">
                                                    {message.message}
                                                </div>
                                                {!message.isAI && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="flex justify-start">
                                        <div className="bg-gray-100 rounded-lg p-3">
                                            <div className="flex items-center gap-2">
                                                <Bot className="h-4 w-4" />
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-sm text-gray-600">AI is thinking...</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div ref={messagesEndRef} />
                            </div>
                        </ScrollArea>

                        {/* Quick Actions */}
                        {messages.length === 1 && (
                            <div className="px-4 py-2 border-t">
                                <p className="text-xs text-muted-foreground mb-2">Quick actions:</p>
                                <div className="grid grid-cols-2 gap-1">
                                    {quickActions.map((action, index) => (
                                        <Button
                                            key={index}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-8"
                                            onClick={() => handleSendMessage(action.prompt)}
                                        >
                                            <action.icon className="h-3 w-3 mr-1" />
                                            {action.text}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Input */}
                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <Input
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about your studies..."
                                    className="flex-1"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={() => handleSendMessage()}
                                    disabled={!inputMessage.trim() || isLoading}
                                    size="sm"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AIChatbox;

