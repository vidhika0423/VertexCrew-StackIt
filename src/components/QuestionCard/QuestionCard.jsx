import React, { useEffect, useState } from 'react';
import styles from './QuestionCard.module.css';
import CommentSection from './CommentSection';
import { useUser } from '@clerk/clerk-react';
import dataService from '../../services/dataService';

const QuestionCard = ({ question, onVote, onTitleClick, user, isSignedIn }) => {
  const [responseCount, setResponseCount] = useState(
    Array.isArray(question.answers) ? question.answers.length : 0
  );

  useEffect(() => {
    const fetchResponseCount = async () => {
      if (!question || !question.id) return;
      try {
        const [answers, comments] = await Promise.all([
          dataService.getAnswers(question.id),
          dataService.getComments(question.id)
        ]);
        setResponseCount((answers?.length || 0) + (comments?.length || 0));
      } catch (e) {
        setResponseCount(0);
      }
    };
    fetchResponseCount();
  }, [question?.id]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const renderHtmlContent = (htmlContent) => {

    if (!htmlContent) return null;
    return (
      <div 
        className={styles.contentPreview}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  };

  const handleTitleClick = (e) => {
    e.stopPropagation(); // Prevent the parent card click
    if (onTitleClick) {
      onTitleClick();
    }
  };

  if (!question) return null;

  return (
    <div className={styles.questionCard}>
      <div className={styles.stats}>
        <div className={styles.stat}>
          <button className={styles.voteButton} onClick={() => onVote(question.id, 1)}>▲</button>
          <span className={styles.statNumber}>{question.votes ?? 0}</span>
          <button className={styles.voteButton} onClick={() => onVote(question.id, -1)}>▼</button>
          <span className={styles.statLabel}>votes</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statNumber}>{responseCount}</span>
          <span className={styles.statLabel}>answers</span>
        </div>
      </div>
      
      <div className={styles.content}>
        <div 
          className={styles.title}
          onClick={handleTitleClick}
        >
          {question.title || 'Untitled'}
        </div>
        
        <div className={styles.excerpt}>
          {renderHtmlContent(question.content)}
        </div>
        
        <div className={styles.meta}>
          <div className={styles.tags}>
            {(question.tags || []).map((tag, index) => (
              <span key={index} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
          
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>{question.authorName || 'Unknown'}</span>
            <span className={styles.date}>{formatDate(question.createdAt)}</span>
          </div>
        </div>
        {isSignedIn && (
          <CommentSection 
            questionId={question.id} 
            user={user} 
          />
        )}
      </div>
    </div>
  );
};

export default QuestionCard; 