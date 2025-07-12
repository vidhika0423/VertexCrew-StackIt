import React, { useEffect, useState } from 'react';
import dataService from '../../services/dataService';
import styles from './CommentSection.module.css';

const CommentSection = ({ questionId, user }) => {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
    // eslint-disable-next-line
  }, [questionId]);

  const loadComments = async () => {
    setLoading(true);
    const data = await dataService.getComments(questionId);
    setComments(data);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      await dataService.addComment({
        questionId,
        author: user?.username || user?.emailAddresses?.[0]?.emailAddress || 'guest',
        authorName: user?.fullName || user?.username || user?.emailAddresses?.[0]?.emailAddress || 'Guest',
        content: commentText.trim(),
      });
      setCommentText('');
      await loadComments();
    } catch (error) {
      alert('Failed to add comment.');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.commentSection}>
      <h4>Comments</h4>
      {loading ? (
        <div className={styles.loading}>Loading comments...</div>
      ) : (
        <div className={styles.commentsList}>
          {comments.length === 0 ? (
            <div className={styles.noComments}>No comments yet.</div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className={styles.comment}>
                <span className={styles.author}>{comment.authorName}:</span>
                <span className={styles.content}>{comment.content}</span>
                <span className={styles.date}>{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <input
          type="text"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
          disabled={submitting}
          className={styles.input}
        />
        <button type="submit" disabled={submitting || !commentText.trim()} className={styles.button}>
          {submitting ? 'Posting...' : 'Post'}
        </button>
      </form>
    </div>
  );
};

export default CommentSection; 