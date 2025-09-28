import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MarkdownFormatterProps {
  content: string;
  className?: string;
}

export function MarkdownFormatter({ content, className = "" }: MarkdownFormatterProps) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Split content into sections and process each one
  const processContent = (text: string) => {
    const sections = text.split(/(```[\s\S]*?```|`[^`]+`|\\\[[\s\S]*?\\\])/g);
    
    return sections.map((section, index) => {
      // Code blocks (```code```)
      if (section.startsWith('```') && section.endsWith('```')) {
        const codeContent = section.slice(3, -3).trim();
        const lines = codeContent.split('\n');
        const language = lines[0].match(/^[a-zA-Z]+$/) ? lines[0] : '';
        const code = language ? lines.slice(1).join('\n') : codeContent;
        const codeId = `code-${index}`;
        
        return (
          <div key={index} className="my-4">
            <div className="relative">
              <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 rounded-t-lg text-sm">
                <span>{language || 'code'}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(code, codeId)}
                  className="h-6 w-6 p-0 hover:bg-gray-700"
                >
                  {copiedCode === codeId ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language={language || 'text'}
                style={oneDark}
                className="!mt-0 !rounded-t-none"
                customStyle={{
                  margin: 0,
                  borderRadius: '0 0 0.5rem 0.5rem',
                  fontSize: '0.875rem',
                }}
              >
                {code}
              </SyntaxHighlighter>
            </div>
          </div>
        );
      }
      
      // Block math expressions (\[...\])
      if (section.startsWith('\\[') && section.endsWith('\\]')) {
        const mathContent = section.slice(2, -2);
        try {
          return (
            <div key={index} className="my-4 flex justify-center">
              <BlockMath math={mathContent} />
            </div>
          );
        } catch (error) {
          console.warn('LaTeX parsing error:', error);
          return (
            <div key={index} className="font-mono bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-red-600 dark:text-red-400 my-2">
              {section}
            </div>
          );
        }
      }
      
      // Inline code (`code`)
      if (section.startsWith('`') && section.endsWith('`') && !section.includes('\n')) {
        const codeContent = section.slice(1, -1);
        return (
          <code
            key={index}
            className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-red-600 dark:text-red-400"
          >
            {codeContent}
          </code>
        );
      }
      
      // Regular text - process markdown
      return processMarkdown(section, index);
    });
  };

  const processMarkdown = (text: string, key: number) => {
    if (!text.trim()) return null;

    // First handle video embeds
    text = text
      // YouTube videos (with query parameters)
      .replace(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\?[^&\s]*)?/g, (match, videoId) => {
        return `\n\n<VIDEO_EMBED_YOUTUBE:${videoId}>\n\n`;
      })
      // Vimeo videos
      .replace(/(?:https?:\/\/)?(?:www\.)?vimeo\.com\/(\d+)/g, (match, videoId) => {
        return `\n\n<VIDEO_EMBED_VIMEO:${videoId}>\n\n`;
      });

    // Split by double newlines to create paragraphs
    const paragraphs = text.split(/\n\s*\n/);
    
    return (
      <div key={key} className="space-y-4">
        {paragraphs.map((paragraph, pIndex) => {
          if (!paragraph.trim()) return null;
          
          // Check for video embeds
          if (paragraph.includes('<VIDEO_EMBED_YOUTUBE:')) {
            const videoId = paragraph.match(/<VIDEO_EMBED_YOUTUBE:([^>]+)>/)?.[1];
            if (videoId) {
              return (
                <div key={pIndex} className="video-embed my-6">
                  <iframe 
                    width="100%" 
                    height="315" 
                    src={`https://www.youtube.com/embed/${videoId}`}
                    title="YouTube video" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    className="rounded-lg shadow-lg max-w-2xl mx-auto"
                  />
                </div>
              );
            }
          }
          
          if (paragraph.includes('<VIDEO_EMBED_VIMEO:')) {
            const videoId = paragraph.match(/<VIDEO_EMBED_VIMEO:([^>]+)>/)?.[1];
            if (videoId) {
              return (
                <div key={pIndex} className="video-embed my-6">
                  <iframe 
                    width="100%" 
                    height="315" 
                    src={`https://player.vimeo.com/video/${videoId}`}
                    title="Vimeo video" 
                    frameBorder="0" 
                    allow="autoplay; fullscreen; picture-in-picture" 
                    allowFullScreen
                    className="rounded-lg shadow-lg max-w-2xl mx-auto"
                  />
                </div>
              );
            }
          }
          
          // Check for headers
          if (paragraph.startsWith('## ')) {
            return (
              <h2 key={pIndex} className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6 mb-3 border-b border-gray-200 dark:border-gray-700 pb-2">
                {paragraph.slice(3)}
              </h2>
            );
          }
          
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={pIndex} className="text-lg font-semibold text-gray-900 dark:text-gray-100 mt-5 mb-2">
                {paragraph.slice(4)}
              </h3>
            );
          }
          
          if (paragraph.startsWith('#### ')) {
            return (
              <h4 key={pIndex} className="text-base font-medium text-gray-900 dark:text-gray-100 mt-4 mb-2">
                {paragraph.slice(5)}
              </h4>
            );
          }
          
          // Check for lists
          if (paragraph.includes('\n- ') || paragraph.includes('\n* ')) {
            const lines = paragraph.split('\n');
            const listItems = lines
              .filter(line => line.trim().startsWith('- ') || line.trim().startsWith('* '))
              .map(line => line.trim().slice(2));
            
            return (
              <ul key={pIndex} className="list-disc list-inside space-y-1 ml-4">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700 dark:text-gray-300">
                    {processInlineMarkdown(item)}
                  </li>
                ))}
              </ul>
            );
          }
          
          // Check for numbered lists
          if (paragraph.includes('\n1. ') || paragraph.includes('\n2. ')) {
            const lines = paragraph.split('\n');
            const listItems = lines
              .filter(line => /^\d+\.\s/.test(line.trim()))
              .map(line => line.trim().replace(/^\d+\.\s/, ''));
            
            return (
              <ol key={pIndex} className="list-decimal list-inside space-y-1 ml-4">
                {listItems.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700 dark:text-gray-300">
                    {processInlineMarkdown(item)}
                  </li>
                ))}
              </ol>
            );
          }
          
          // Regular paragraph
          return (
            <p key={pIndex} className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {processInlineMarkdown(paragraph)}
            </p>
          );
        })}
      </div>
    );
  };

  const processInlineMarkdown = (text: string) => {
    // Split text by LaTeX expressions to handle them separately
    const parts = text.split(/(\\\([^)]+\\\)|\\\[[^\]]+\\\])/g);
    
    return parts.map((part, index) => {
      // Handle inline LaTeX math \(...\)
      if (part.startsWith('\\(') && part.endsWith('\\)')) {
        const mathContent = part.slice(2, -2);
        try {
          return <InlineMath key={index} math={mathContent} />;
        } catch (error) {
          console.warn('LaTeX parsing error:', error);
          return <span key={index} className="font-mono bg-red-100 dark:bg-red-900 px-1 rounded text-red-600 dark:text-red-400">{part}</span>;
        }
      }
      
      // Handle block LaTeX math \[...\]
      if (part.startsWith('\\[') && part.endsWith('\\]')) {
        const mathContent = part.slice(2, -2);
        try {
          return <BlockMath key={index} math={mathContent} />;
        } catch (error) {
          console.warn('LaTeX parsing error:', error);
          return <div key={index} className="font-mono bg-red-100 dark:bg-red-900 px-2 py-1 rounded text-red-600 dark:text-red-400 my-2">{part}</div>;
        }
      }
      
      // Process regular text with markdown
      let processedText = part;
      
      // Process bold text - only if properly formatted
      processedText = processedText.replace(/\*\*([^*]+)\*\*/g, '<strong class="font-semibold text-blue-700 dark:text-blue-300">$1</strong>');
      
      // Process italic text - only if properly formatted  
      processedText = processedText.replace(/\*([^*]+)\*/g, '<em class="italic text-gray-700 dark:text-gray-300">$1</em>');
      
      // Process inline code
      processedText = processedText.replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono text-red-600 dark:text-red-400">$1</code>');
      
      // Process line breaks
      processedText = processedText.replace(/\n/g, '<br />');
      
      return <span key={index} dangerouslySetInnerHTML={{ __html: processedText }} />;
    });
  };

  return (
    <div className={`max-w-none ${className}`} style={{ lineHeight: '1.7', fontSize: '14px' }}>
      <div className="space-y-3 text-gray-800 dark:text-gray-200">
        {processContent(content)}
      </div>
    </div>
  );
}
