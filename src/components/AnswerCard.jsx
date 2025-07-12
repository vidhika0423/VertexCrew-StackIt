import React from 'react';
import styles from './AnswerCard.module.css';

const AnswerCard = ({ answer, onVote, user }) => {
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

  return (
    <div className={styles.answerCard}>
      <div className={styles.answerHeader}>
        <div className={styles.voteSection}>
          <button 
            className={styles.voteButton} 
            onClick={() => onVote(answer.id, 1)}
          >
            ▲
          </button>
          <span className={styles.voteCount}>{answer.votes}</span>
          <button 
            className={styles.voteButton} 
            onClick={() => onVote(answer.id, -1)}
          >
            ▼
          </button>
        </div>
        
        <div className={styles.answerInfo}>
          <div className={styles.answerMeta}>
            <span className={styles.authorName}>{answer.authorName}</span>
            <span className={styles.date}>{formatDate(answer.createdAt)}</span>
            {answer.isAccepted && (
              <span className={styles.acceptedBadge}>✓ Accepted</span>
            )}
          </div>
        </div>
      </div>
      
      <div 
        className={styles.answerContent}
        dangerouslySetInnerHTML={{ __html: answer.content }}
      />
    </div>
  );
};

export default AnswerCard;
