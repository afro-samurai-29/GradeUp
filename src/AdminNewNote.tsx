import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { db } from '@/firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { ArrowLeft, Save, Eye, Edit3, Bold, Italic, List, Link as LinkIcon, Code, Calculator } from 'lucide-react';
import 'katex/dist/katex.min.css';
import katex from 'katex';

const AdminNewNote: React.FC = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
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

  const handleSubmit = async () => {
    if (!title || !subject || !content) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'notes'), {
        title,
        subject,
        content,
        tags: tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        visibility: 'public',
      });
      navigate('/student/notes');
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
    // First handle LaTeX math expressions
    let processedText = text
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


