import React, { useState, useEffect } from 'react';
import styles from './PostModal.module.css';
import dataService from '../services/dataService';

const PostModal = ({ question, isOpen, onClose, user }) => {
  const [answers, setAnswers] = useState([]);
  const [answerText, setAnswerText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && question) {
      loadAnswers();
    }
  }, [isOpen, question]);

  const loadAnswers = async () => {
    try {
      setLoading(true);
      // Combine all previous answers and comments as 'answers'
      const [oldAnswers, comments] = await Promise.all([
        dataService.getAnswers(question.id),
        dataService.getComments(question.id)
      ]);
      // Treat all as answers, sort by createdAt (newest first)
      const allAnswers = [
        ...oldAnswers.map(a => ({ ...a, type: 'answer' })),
        ...comments.map(c => ({ ...c, type: 'answer' }))
      ];
      allAnswers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAnswers(allAnswers);
    } catch (error) {
      console.error('Error loading answers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (answerId, voteChange) => {
    try {
      await dataService.updateAnswerVotes(answerId, voteChange);
      await loadAnswers();
    } catch (error) {
      console.error('Error updating votes:', error);
      alert('Failed to vote. Please try again.');
    }
  };

  const handleSubmitAnswer = async (e) => {
    e.preventDefault();
    if (!answerText.trim()) return;
    setSubmitting(true);
    try {
      // Add as a comment (since that's the only addable type in UI)
      await dataService.addComment({
        questionId: question.id,
        author: user?.username || user?.emailAddresses?.[0]?.emailAddress || 'guest',
        authorName: user?.fullName || user?.username || user?.emailAddresses?.[0]?.emailAddress || 'Guest',
        content: answerText.trim(),
      });
      setAnswerText('');
      await loadAnswers();
    } catch (error) {
      alert('Failed to add answer.');
    }
    setSubmitting(false);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen || !question) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        {/* Question Section */}
        <div className={styles.questionSection}>
          <h2 className={styles.title}>{question.title}</h2>
          <div className={styles.meta}>
            <span>By {question.authorName}</span>
            <span>{new Date(question.createdAt).toLocaleString()}</span>
          </div>
          <div className={styles.content} dangerouslySetInnerHTML={{ __html: question.content }} />
          <div className={styles.stats}>
            <span><b>{question.votes}</b> votes</span>
            <span><b>{answers.length}</b> answers</span>
          </div>
          <div className={styles.tags}>
            {question.tags.map((tag, idx) => (
              <span key={idx} className={styles.tag}>{tag}</span>
            ))}
          </div>
        </div>
        {/* Answers Section */}
        <div className={styles.responsesSection}>
          <h3 className={styles.sectionTitle}>
            {answers.length === 0 ? 'No answers yet' : `${answers.length} Answer${answers.length !== 1 ? 's' : ''}`}
          </h3>
          {loading ? (
            <div className={styles.loading}>Loading answers...</div>
          ) : (
            <div className={styles.responsesList}>
              {answers.map((answer) => (
                <div key={answer.id} className={styles.responseCard}>
                  <div className={styles.responseHeader}>
                    <div className={styles.responseInfo}>
                      <div className={styles.responseMeta}>
                        <span className={styles.authorName}>{answer.authorName}</span>
                        <span className={styles.date}>{formatDate(answer.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div 
                    className={styles.responseContent}
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* Add Answer Form - Only show if user is signed in */}
        {user ? (
          <div className={styles.commentForm}>
            <h4>Add an Answer</h4>
            <form onSubmit={handleSubmitAnswer}>
              <input
                type="text"
                value={answerText}
                onChange={(e) => setAnswerText(e.target.value)}
                placeholder="Add your answer..."
                disabled={submitting}
                className={styles.input}
              />
              <button type="submit" disabled={submitting || !answerText.trim()} className={styles.button}>
                {submitting ? 'Posting...' : 'Post Answer'}
              </button>
            </form>
          </div>
        ) : (
          <div className={styles.signInPrompt}>
            <p>Please sign in to add an answer.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostModal; 