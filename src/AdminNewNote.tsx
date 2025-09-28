import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
<<<<<<< HEAD
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { db } from '@/firebaseConfig';
import { addDoc, collection, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { ArrowLeft, Save, Eye, Edit3, Bold, Italic, List, Link as LinkIcon, Code, Calculator, Play, Plus } from 'lucide-react';

interface YouTubeVideo {
  id: string;
  title: string;
  subject: string;
  youtubeUrl: string;
  videoId: string;
  description: string;
  thumbnail?: string;
}
=======
import { db } from './firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Save, Eye, Edit3, Bold, Italic, List, Link as LinkIcon, Code, Calculator } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';
>>>>>>> 4af57b127e7f204a746a64a584592ee365e8f33a

const AdminNewNote: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string>('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit');

  const availableSubjects = [
    'Mathematics',
    'English',
    'Afrikaans',
    'Physical Sciences',
    'Life Sciences',
    'History',
    'Geography',
    'Business Studies',
    'Economics',
    'Accounting',
    'Information Technology'
  ];

  const grade12MathTopics = [
    'Functions',
    'Probability',
    'Trigonometry',
    'Calculus',
    'Analytical Geometry',
    'Statistics',
    'Sequences and Series',
    'Financial Mathematics',
    'Differential Calculus',
    'Integral Calculus',
    'Euclidean Geometry',
    'Circle Geometry',
    'Coordinate Geometry',
    'Exponential and Logarithmic Functions',
    'Polynomial Functions',
    'Rational Functions',
    'Hyperbolic Functions',
    'Inverse Functions',
    'Composite Functions',
    'Matrices and Determinants',
    'Complex Numbers',
    'Vectors',
    'Linear Programming',
    'Optimization Problems'
  ];

  // Sample content for different topics
  const getSampleContent = (topic: string) => {
    switch (topic) {
      case 'Functions':
        return `# Functions - Grade 12 Mathematics

## Introduction to Functions
A function is a relation between a set of inputs (domain) and a set of possible outputs (range) with the property that each input is related to exactly one output.

## Types of Functions

### Linear Functions
Linear functions have the form: **f(x) = mx + c**
- Where m is the slope and c is the y-intercept
- Graph is a straight line

### Quadratic Functions
Quadratic functions have the form: **f(x) = ax² + bx + c**
- Where a ≠ 0
- Graph is a parabola

### Exponential Functions
Exponential functions have the form: **f(x) = a^x**
- Where a > 0 and a ≠ 1
- Used to model growth and decay

## Domain and Range
- **Domain**: Set of all possible x-values
- **Range**: Set of all possible y-values

## Function Notation
- f(x) = y means "f of x equals y"
- The input is x, the output is f(x)

## Practice Problems
1. Find the domain and range of f(x) = √(x-2)
2. Determine if the relation is a function: {(1,2), (2,3), (1,4)}

## Key Concepts
- One-to-one functions
- Onto functions
- Inverse functions
- Composite functions`;

      case 'Probability':
        return `# Probability - Grade 12 Mathematics

## Introduction to Probability
Probability is a measure of the likelihood that an event will occur. It is expressed as a number between 0 and 1, where 0 indicates impossibility and 1 indicates certainty.

## Basic Probability Concepts

### Sample Space
The sample space (S) is the set of all possible outcomes of an experiment.

### Events
An event is a subset of the sample space. Events can be:
- **Simple events**: Single outcomes
- **Compound events**: Multiple outcomes

### Probability Formula
**P(A) = Number of favorable outcomes / Total number of possible outcomes**

## Types of Probability

### Theoretical Probability
Based on mathematical reasoning and assumptions.

### Experimental Probability
Based on actual experiments and observations.

### Conditional Probability
The probability of event A given that event B has occurred:
**P(A|B) = P(A ∩ B) / P(B)**

## Probability Rules

### Addition Rule
**P(A ∪ B) = P(A) + P(B) - P(A ∩ B)**

### Multiplication Rule
**P(A ∩ B) = P(A) × P(B|A)**

### Complement Rule
**P(A') = 1 - P(A)**

## Independent and Dependent Events
- **Independent**: P(A ∩ B) = P(A) × P(B)
- **Dependent**: P(A ∩ B) = P(A) × P(B|A)

## Practice Problems
1. A fair die is rolled. Find P(rolling an even number)
2. Two cards are drawn from a deck. Find P(both are aces)

## Key Concepts
- Tree diagrams
- Venn diagrams
- Permutations and combinations
- Binomial probability`;

      case 'Trigonometry':
        return `# Trigonometry - Grade 12 Mathematics

## Introduction to Trigonometry
Trigonometry is the study of relationships between angles and sides of triangles, particularly right-angled triangles.

## Trigonometric Ratios

### Primary Ratios
For a right-angled triangle with angle θ:
- **Sine**: sin θ = opposite/hypotenuse
- **Cosine**: cos θ = adjacent/hypotenuse  
- **Tangent**: tan θ = opposite/adjacent

### Reciprocal Ratios
- **Cosecant**: cosec θ = 1/sin θ
- **Secant**: sec θ = 1/cos θ
- **Cotangent**: cot θ = 1/tan θ

## Unit Circle
The unit circle is a circle with radius 1 centered at the origin.
- Coordinates: (cos θ, sin θ)
- Used to define trigonometric functions for all angles

## Special Angles
Memorize these exact values:
- **0°**: sin = 0, cos = 1, tan = 0
- **30°**: sin = 1/2, cos = √3/2, tan = 1/√3
- **45°**: sin = √2/2, cos = √2/2, tan = 1
- **60°**: sin = √3/2, cos = 1/2, tan = √3
- **90°**: sin = 1, cos = 0, tan = undefined

## Trigonometric Identities

### Pythagorean Identities
- **sin²θ + cos²θ = 1**
- **1 + tan²θ = sec²θ**
- **1 + cot²θ = cosec²θ**

### Double Angle Formulas
- **sin 2θ = 2 sin θ cos θ**
- **cos 2θ = cos²θ - sin²θ**
- **tan 2θ = 2 tan θ / (1 - tan²θ)**

## Graphs of Trigonometric Functions
- **Sine**: Periodic wave, amplitude 1, period 2π
- **Cosine**: Periodic wave, amplitude 1, period 2π
- **Tangent**: Periodic, undefined at odd multiples of π/2

## Practice Problems
1. Find the exact value of sin 75°
2. Solve: 2 sin x + 1 = 0 for 0 ≤ x ≤ 2π

## Key Concepts
- Reference angles
- Co-terminal angles
- Trigonometric equations
- Inverse trigonometric functions`;

      default:
        return '';
    }
  };

  // Load available videos
  useEffect(() => {
    const q = query(collection(db, 'youtubeVideos'), orderBy('uploadedAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videoList: YouTubeVideo[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title || '',
          subject: data.subject || '',
          youtubeUrl: data.youtubeUrl || '',
          videoId: data.videoId || '',
          description: data.description || '',
          thumbnail: data.thumbnail || ''
        };
      });
      setVideos(videoList);
    });

    return () => unsubscribe();
  }, []);

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
    setContent(newText);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const insertMath = (isBlock: boolean = false) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const mathWrapper = isBlock ? `$$${selectedText || 'x^2 + y^2 = z^2'}$$` : `$${selectedText || 'x^2'}$`;
    const newText = content.substring(0, start) + mathWrapper + content.substring(end);
    setContent(newText);

    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      const cursorPos = isBlock ? start + 2 : start + 1;
      textarea.setSelectionRange(cursorPos, cursorPos + (selectedText.length || (isBlock ? 19 : 3)));
    }, 0);
  };

  const insertVideo = () => {
    if (!selectedVideo) return;
    
    const video = videos.find(v => v.id === selectedVideo);
    if (!video) return;
    
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const videoEmbed = `\n\n[VIDEO:${video.videoId}:${video.title}]\n\n`;
    const newText = content.substring(0, start) + videoEmbed + content.substring(end);
    setContent(newText);
    
    // Focus back to textarea
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + videoEmbed.length, start + videoEmbed.length);
    }, 0);
  };

  const handleSubmit = async () => {
    if (!title || !subject || !content) return;
    setIsSubmitting(true);
    try {
      const selectedVideoData = selectedVideo ? videos.find(v => v.id === selectedVideo) : null;
      
      await addDoc(collection(db, 'notes'), {
        title,
        subject,
        topic: topic || null,
        content,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        videoId: selectedVideoData?.videoId || null,
        videoTitle: selectedVideoData?.title || null,
        videoUrl: selectedVideoData?.youtubeUrl || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        visibility: 'public',
      });
      navigate('/admin');
    } catch (err) {
      console.error('Failed to add note', err);
      alert('Failed to add note. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-forest text-white p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="hover:bg-forest-secondary p-2 rounded-lg transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Add New Note</h1>
              <p className="text-forest-light">Publish study notes for students</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Note Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border rounded-md bg-background"
                required
              >
                <option value="">Select Subject</option>
                {availableSubjects.map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
            </div>
            
            {/* Topic Selection - Only show for Mathematics */}
            {subject === 'Mathematics' && (
              <div>
                <label className="block text-sm font-medium mb-2">Grade 12 Mathematics Topic</label>
                <div className="flex gap-2">
                  <Select value={topic} onValueChange={setTopic} className="flex-1">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a Grade 12 Math topic" />
                    </SelectTrigger>
                    <SelectContent>
                      {grade12MathTopics.map((mathTopic) => (
                        <SelectItem key={mathTopic} value={mathTopic}>
                          {mathTopic}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {topic && ['Functions', 'Probability', 'Trigonometry'].includes(topic) && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setContent(getSampleContent(topic))}
                      className="bg-forest-primary text-white hover:bg-forest-secondary"
                    >
                      Load Sample Content
                    </Button>
                  )}
                </div>
              </div>
            )}
            
            {/* Video Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Associated Video (Optional)</label>
              <div className="flex gap-2">
                <Select value={selectedVideo} onValueChange={setSelectedVideo}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select a video to embed in this note" />
                  </SelectTrigger>
                  <SelectContent>
                    {videos
                      .filter(video => !subject || video.subject === subject)
                      .map((video) => (
                        <SelectItem key={video.id} value={video.id}>
                          <div className="flex items-center gap-2">
                            <Play className="h-4 w-4 text-forest-primary" />
                            <span className="truncate">{video.title}</span>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {selectedVideo && (
                  <Button
                    type="button"
                    onClick={insertVideo}
                    className="bg-forest-primary text-white hover:bg-forest-secondary"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Insert
                  </Button>
                )}
              </div>
              {selectedVideo && (
                <div className="text-sm text-gray-600">
                  Selected: {videos.find(v => v.id === selectedVideo)?.title}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium">Content</label>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="edit" className="space-y-2">
                  <div className="flex flex-wrap gap-2 p-2 border rounded-md bg-muted/50">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('**', '**')}
                      className="flex items-center gap-1"
                    >
                      <Bold className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('*', '*')}
                      className="flex items-center gap-1"
                    >
                      <Italic className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('`', '`')}
                      className="flex items-center gap-1"
                    >
                      <Code className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('- ')}
                      className="flex items-center gap-1"
                    >
                      <List className="h-3 w-3" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMarkdown('[', '](url)')}
                      className="flex items-center gap-1"
                    >
                      <LinkIcon className="h-3 w-3" />
                    </Button>
                    <div className="w-px h-6 bg-border mx-1" />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMath(false)}
                      className="flex items-center gap-1 text-forest-primary"
                    >
                      <Calculator className="h-3 w-3" />
                      Inline Math
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => insertMath(true)}
                      className="flex items-center gap-1 text-forest-primary"
                    >
                      <Calculator className="h-3 w-3" />
                      Block Math
                    </Button>
                  </div>
                  <Textarea
                    name="content"
                    placeholder="Write your content using Markdown..."
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="font-mono text-sm"
                  />
                </TabsContent>
                <TabsContent value="preview" className="min-h-[300px]">
                  <div className="p-4 border rounded-md bg-background min-h-[300px] prose prose-sm max-w-none">
                    <MarkdownPreview content={content} />
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <Input
              placeholder="Tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting || !title || !subject || !content}
                className="bg-forest-primary hover:bg-forest-secondary"
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Note'}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Markdown Preview Component with KaTeX support
const MarkdownPreview: React.FC<{ content: string }> = ({ content }) => {
  const formatMarkdown = (text: string) => {
    // Simple markdown formatting without KaTeX for now
    let processedText = text
<<<<<<< HEAD
      // Handle video embeds first
      .replace(/\[VIDEO:([^:]+):([^\]]+)\]/g, (match, videoId, title) => {
        return `
          <div class="my-4 p-4 border rounded-lg bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <Play className="h-4 w-4 text-forest-primary" />
              <span class="font-medium text-forest-primary">${title}</span>
            </div>
            <div class="aspect-video w-full">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/${videoId}" 
                title="${title}"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen
                class="rounded-lg"
              ></iframe>
            </div>
          </div>
        `;
      })
      // Handle regular markdown
=======
      // Handle block math ($$...$$ and \[...\])
      .replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
        try {
          return katex.renderToString(math.trim(), { displayMode: true });
        } catch (e) {
          return `<div class="math-error">Math Error: ${math}</div>`;
        }
      })
      .replace(/\\\[([\s\S]*?)\\\]/g, (match, math) => {
        try {
          return katex.renderToString(math.trim(), { displayMode: true });
        } catch (e) {
          return `<div class="math-error">Math Error: ${math}</div>`;
        }
      })
      // Handle inline math ($...$ and \(...\))
      .replace(/\$([^$]+)\$/g, (match, math) => {
        try {
          return katex.renderToString(math.trim(), { displayMode: false });
        } catch (e) {
          return `<span class="math-error">Math Error: ${math}</span>`;
        }
      })
      .replace(/\\\((.*?)\\\)/g, (match, math) => {
        try {
          return katex.renderToString(math.trim(), { displayMode: false });
        } catch (e) {
          return `<span class="math-error">Math Error: ${math}</span>`;
        }
      })
      // Then handle regular markdown
>>>>>>> 4af57b127e7f204a746a64a584592ee365e8f33a
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/^\* (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/^- (.*$)/gim, '<li class="ml-4">$1</li>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-forest-primary underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n/g, '<br>');

    return processedText;
  };

  return (
    <div dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }} />
  );
};

export default AdminNewNote;


