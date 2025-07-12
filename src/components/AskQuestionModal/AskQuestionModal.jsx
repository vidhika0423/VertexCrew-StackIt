import React, { useState } from 'react';
import styles from './AskQuestionModal.module.css';
import RichTextEditor from '../RichTextEditor/RichTextEditor';

const AskQuestionModal = ({ isOpen, onClose, onSubmit }) => {
  const [questionData, setQuestionData] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!questionData.title.trim() || !questionData.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      if (onSubmit) {
        await onSubmit(questionData);
      } else {
        console.log('Question submitted:', questionData);
      }
      
      // Reset form
      setQuestionData({ title: '', content: '', tags: '' });
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setQuestionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContentChange = (content) => {
    setQuestionData(prev => ({
      ...prev,
      content: content
    }));
  };

  const handleClose = () => {
    setQuestionData({ title: '', content: '', tags: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Ask a Question</h2>
          <button className={styles.closeButton} onClick={handleClose}>
            &times;
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Question Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={questionData.title}
              onChange={handleChange}
              placeholder="What's your question? Be specific."
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="content">Question Details</label>
            <RichTextEditor
              value={questionData.content}
              onChange={handleContentChange}
              placeholder="Provide more context about your question..."
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="tags">Tags (optional)</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={questionData.tags}
              onChange={handleChange}
              placeholder="e.g., javascript, react, programming"
            />
          </div>
          
          <div className={styles.buttonGroup}>
            <button type="button" className={styles.cancelButton} onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Post Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AskQuestionModal; 