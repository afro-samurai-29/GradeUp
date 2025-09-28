class GuidanceService {
  private deepSeekApiKey = 'sk-560bea5180c04cb286d413aac21e585c'; // DeepSeek API key

  /**
   * Generate educational guidance based on extracted image content
   * @param extractedContent - Content extracted from student's work
   * @param topic - Current topic/subject
   * @param chatHistory - Previous conversation context
   * @returns Guidance and hints without giving away full answers
   */
  async generateGuidance(
    extractedContent: string,
    topic: string,
    chatHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
  ): Promise<{
    success: boolean;
    guidance: string;
    metadata: {
      responseTime: number;
      guidanceType: 'hint' | 'error_correction' | 'method_suggestion' | 'encouragement';
    };
    error?: string;
  }> {
    const startTime = Date.now();

    try {
      console.log('🎯 Generating educational guidance for extracted content');

      // Build the guidance prompt
      const guidancePrompt = this.buildGuidancePrompt(extractedContent, topic);

      // Prepare messages for DeepSeek
      let messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];

      // Add system prompt
      messages.push({
        role: 'system',
        content: guidancePrompt
      });

      // Add chat history for context
      chatHistory.forEach(msg => {
        messages.push({
          role: msg.role,
          content: msg.content
        });
      });

      // Add the current analysis request
      messages.push({
        role: 'user',
        content: `Please analyze this student work and provide guidance:\n\n${extractedContent}`
      });

      // Call DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepSeekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: messages,
          temperature: 0.7,
          max_tokens: 2000,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from DeepSeek API');
      }

      const guidance = data.choices[0].message.content;
      const responseTime = Date.now() - startTime;

      // Determine guidance type based on content
      const guidanceType = this.determineGuidanceType(guidance);

      console.log(`✅ Guidance generated successfully in ${responseTime}ms`);
      console.log('📝 Guidance preview:', guidance.substring(0, 150) + '...');

      return {
        success: true,
        guidance,
        metadata: {
          responseTime,
          guidanceType
        }
      };

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      console.error('❌ Guidance generation error:', error);

      return {
        success: false,
        guidance: '',
        metadata: {
          responseTime,
          guidanceType: 'encouragement'
        },
        error: error.message || 'Failed to generate guidance'
      };
    }
  }

  /**
   * Build the specialized guidance prompt for educational feedback
   */
  private buildGuidancePrompt(extractedContent: string, topic: string): string {
    return `You are an expert AI tutor specializing in ${topic}. Your role is to provide educational guidance, hints, and feedback to help students learn through discovery rather than giving direct answers.

**CRITICAL GUIDELINES:**
1. **NEVER provide complete solutions or final answers**
2. **Focus on guiding the student's thinking process**
3. **Identify mistakes gently and suggest corrections**
4. **Ask probing questions to encourage deeper thinking**
5. **Provide hints that lead toward the solution without giving it away**
6. **Acknowledge good work and correct methods**
7. **Suggest next steps or alternative approaches when stuck**

**RESPONSE STRUCTURE:**
Use this format for your guidance:

**🔍 WORK ANALYSIS:**
[Brief assessment of what the student has done - acknowledge correct parts and identify areas needing attention]

**💡 GUIDANCE & HINTS:**
[Provide specific hints, suggestions, or gentle corrections. Use questions to guide thinking]

**🎯 NEXT STEPS:**
[Suggest what the student should try next, without giving away the answer]

**💪 ENCOURAGEMENT:**
[Positive reinforcement and motivation]

**EXAMPLES OF GOOD GUIDANCE:**
- "I see you've correctly identified the variables. Now, what relationship do you think exists between them?"
- "Your setup looks good! However, check the signs in your equation - what happens when you substitute the given values?"
- "Great start with the diagram! What additional information might help you solve this?"
- "You're on the right track with this method. What would happen if you tried a different approach here?"

**AVOID:**
- Giving final numerical answers
- Solving the problem completely
- Being overly critical or discouraging
- Providing solutions without explanation

Remember: Your goal is to be a supportive guide who helps students discover solutions themselves!`;
  }

  /**
   * Determine the type of guidance being provided
   */
  private determineGuidanceType(guidance: string): 'hint' | 'error_correction' | 'method_suggestion' | 'encouragement' {
    const lowerGuidance = guidance.toLowerCase();

    if (lowerGuidance.includes('mistake') || lowerGuidance.includes('error') || lowerGuidance.includes('incorrect')) {
      return 'error_correction';
    } else if (lowerGuidance.includes('try') || lowerGuidance.includes('consider') || lowerGuidance.includes('what if')) {
      return 'hint';
    } else if (lowerGuidance.includes('method') || lowerGuidance.includes('approach') || lowerGuidance.includes('technique')) {
      return 'method_suggestion';
    } else {
      return 'encouragement';
    }
  }

  /**
   * Generate follow-up questions based on the student's work
   */
  async generateFollowUpQuestions(
    extractedContent: string,
    topic: string
  ): Promise<string[]> {
    try {
      const prompt = `Based on this student work in ${topic}, generate 3-5 thoughtful follow-up questions that would help the student think deeper about the problem without giving away answers:

${extractedContent}

Provide questions that:
- Check understanding of concepts
- Encourage verification of their work
- Prompt consideration of alternative methods
- Help identify potential mistakes
- Guide toward next logical steps

Format as a simple list.`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.deepSeekApiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.8,
          max_tokens: 500
        })
      });

      const data = await response.json();
      const questionsText = data.choices[0].message.content;

      // Parse questions from the response
      const questions = questionsText
        .split('\n')
        .filter((line: string) => line.trim().length > 0 && line.includes('?'))
        .map((q: string) => q.replace(/^\d+\.?\s*/, '').trim())
        .slice(0, 5);

      return questions;

    } catch (error) {
      console.error('Error generating follow-up questions:', error);
      return [
        "Can you explain your reasoning for this step?",
        "What would happen if you tried a different approach?",
        "How can you verify if your answer is correct?"
      ];
    }
  }
}

export const guidanceService = new GuidanceService();
export default guidanceService;
