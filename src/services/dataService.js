import questionsData from '../data/questions.json';
import answersData from '../data/answers.json';
import commentsData from '../data/comments.json';

// In a real application, you would use a backend API
// For this demo, we'll simulate file operations using localStorage
// and the imported JSON data as initial data

class DataService {
  constructor() {
    this.initializeData();
  }

  initializeData() {
    // Initialize localStorage with JSON data if it doesn't exist
    if (!localStorage.getItem('questions')) {
      localStorage.setItem('questions', JSON.stringify(questionsData));
    }
    if (!localStorage.getItem('answers')) {
      localStorage.setItem('answers', JSON.stringify(answersData));
    }
    if (!localStorage.getItem('comments')) {
      localStorage.setItem('comments', JSON.stringify(commentsData));
    }
  }

  // Questions methods
  async getQuestions() {
    try {
      const questions = JSON.parse(localStorage.getItem('questions') || '[]');
      return questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error loading questions:', error);
      return [];
    }
  }

  async addQuestion(questionData) {
    try {
      const questions = JSON.parse(localStorage.getItem('questions') || '[]');
      const newQuestion = {
        id: Date.now().toString(),
        ...questionData,
        votes: 0,
        answers: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      questions.push(newQuestion);
      localStorage.setItem('questions', JSON.stringify(questions));
      
      console.log('Question added successfully:', newQuestion);
      return newQuestion;
    } catch (error) {
      console.error('Error adding question:', error);
      throw error;
    }
  }

  async updateQuestionVotes(questionId, voteChange) {
    try {
      const questions = JSON.parse(localStorage.getItem('questions') || '[]');
      const questionIndex = questions.findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        questions[questionIndex].votes += voteChange;
        questions[questionIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('questions', JSON.stringify(questions));
        return questions[questionIndex];
      }
      throw new Error('Question not found');
    } catch (error) {
      console.error('Error updating question votes:', error);
      throw error;
    }
  }

  // Answers methods
  async getAnswers(questionId) {
    try {
      const answers = JSON.parse(localStorage.getItem('answers') || '[]');
      return answers
        .filter(answer => answer.questionId === questionId)
        .sort((a, b) => b.votes - a.votes);
    } catch (error) {
      console.error('Error loading answers:', error);
      return [];
    }
  }

  async addAnswer(answerData) {
    try {
      const answers = JSON.parse(localStorage.getItem('answers') || '[]');
      const newAnswer = {
        id: Date.now().toString(),
        ...answerData,
        votes: 0,
        isAccepted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      answers.push(newAnswer);
      localStorage.setItem('answers', JSON.stringify(answers));
      
      // Update the question's answers array
      const questions = JSON.parse(localStorage.getItem('questions') || '[]');
      const questionIndex = questions.findIndex(q => q.id === answerData.questionId);
      if (questionIndex !== -1) {
        questions[questionIndex].answers.push(newAnswer.id);
        localStorage.setItem('questions', JSON.stringify(questions));
      }
      
      console.log('Answer added successfully:', newAnswer);
      return newAnswer;
    } catch (error) {
      console.error('Error adding answer:', error);
      throw error;
    }
  }

  async updateAnswerVotes(answerId, voteChange) {
    try {
      const answers = JSON.parse(localStorage.getItem('answers') || '[]');
      const answerIndex = answers.findIndex(a => a.id === answerId);
      
      if (answerIndex !== -1) {
        answers[answerIndex].votes += voteChange;
        answers[answerIndex].updatedAt = new Date().toISOString();
        localStorage.setItem('answers', JSON.stringify(answers));
        return answers[answerIndex];
      }
      throw new Error('Answer not found');
    } catch (error) {
      console.error('Error updating answer votes:', error);
      throw error;
    }
  }

  // Comments methods
  async getComments(questionId) {
    try {
      const comments = JSON.parse(localStorage.getItem('comments') || '[]');
      return comments.filter(comment => comment.questionId === questionId)
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } catch (error) {
      console.error('Error loading comments:', error);
      return [];
    }
  }

  async addComment(commentData) {
    try {
      const comments = JSON.parse(localStorage.getItem('comments') || '[]');
      const newComment = {
        id: Date.now().toString(),
        ...commentData,
        createdAt: new Date().toISOString()
      };
      comments.push(newComment);
      localStorage.setItem('comments', JSON.stringify(comments));
      return newComment;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  // Search and filter methods
  async searchQuestions(query) {
    try {
      const questions = await this.getQuestions();
      const lowercaseQuery = query.toLowerCase();
      
      return questions.filter(question => 
        question.title.toLowerCase().includes(lowercaseQuery) ||
        question.content.toLowerCase().includes(lowercaseQuery) ||
        question.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
      );
    } catch (error) {
      console.error('Error searching questions:', error);
      return [];
    }
  }

  async filterQuestions(filters = {}) {
    try {
      let questions = await this.getQuestions();
      
      // Apply time filter
      if (filters.timeFilter && filters.timeFilter !== 'all') {
        const now = new Date();
        let cutoffDate;
        
        switch (filters.timeFilter) {
          case '24h':
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            cutoffDate = null;
        }
        
        if (cutoffDate) {
          questions = questions.filter(question => 
            new Date(question.createdAt) >= cutoffDate
          );
        }
      }
      
      // Apply unanswered filter
      if (filters.unansweredOnly) {
        questions = questions.filter(question => 
          !question.answers || question.answers.length === 0
        );
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            questions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'most_voted':
            questions.sort((a, b) => b.votes - a.votes);
            break;
          case 'least_voted':
            questions.sort((a, b) => a.votes - b.votes);
            break;
          default:
            // Default to newest first
            questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
      }
      
      return questions;
    } catch (error) {
      console.error('Error filtering questions:', error);
      return [];
    }
  }

  async searchAndFilterQuestions(query, filters = {}) {
    try {
      let questions;
      
      if (query && query.trim()) {
        // If there's a search query, search first
        questions = await this.searchQuestions(query);
      } else {
        // If no search query, get all questions
        questions = await this.getQuestions();
      }
      
      // Apply time filter
      if (filters.timeFilter && filters.timeFilter !== 'all') {
        const now = new Date();
        let cutoffDate;
        
        switch (filters.timeFilter) {
          case '24h':
            cutoffDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
            break;
          case 'week':
            cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            break;
          case 'month':
            cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            break;
          case 'year':
            cutoffDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            break;
          default:
            cutoffDate = null;
        }
        
        if (cutoffDate) {
          questions = questions.filter(question => 
            new Date(question.createdAt) >= cutoffDate
          );
        }
      }
      
      // Apply unanswered filter
      if (filters.unansweredOnly) {
        questions = questions.filter(question => 
          !question.answers || question.answers.length === 0
        );
      }
      
      // Apply sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
          case 'oldest':
            questions.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            break;
          case 'most_voted':
            questions.sort((a, b) => b.votes - a.votes);
            break;
          case 'least_voted':
            questions.sort((a, b) => a.votes - b.votes);
            break;
          default:
            // Default to newest first
            questions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
      }
      
      return questions;
    } catch (error) {
      console.error('Error searching and filtering questions:', error);
      return [];
    }
  }

  async getQuestionsByTag(tag) {
    try {
      const questions = await this.getQuestions();
      return questions.filter(question => 
        question.tags.some(t => t.toLowerCase() === tag.toLowerCase())
      );
    } catch (error) {
      console.error('Error filtering questions by tag:', error);
      return [];
    }
  }

  // Get single question with answers
  async getQuestionWithAnswers(questionId) {
    try {
      const questions = JSON.parse(localStorage.getItem('questions') || '[]');
      const answers = JSON.parse(localStorage.getItem('answers') || '[]');
      
      const question = questions.find(q => q.id === questionId);
      if (!question) {
        throw new Error('Question not found');
      }
      
      const questionAnswers = answers
        .filter(answer => answer.questionId === questionId)
        .sort((a, b) => b.votes - a.votes);
      
      return {
        ...question,
        answers: questionAnswers
      };
    } catch (error) {
      console.error('Error loading question with answers:', error);
      throw error;
    }
  }
}

// Create and export a singleton instance
const dataService = new DataService();
export default dataService; 