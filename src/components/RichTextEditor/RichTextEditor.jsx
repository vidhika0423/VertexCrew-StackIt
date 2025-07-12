import React, { useState, useRef } from 'react';
import styles from './RichTextEditor.module.css';

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊'];

  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    forceEditorLTR(); // 🛡️ Ensure direction stays LTR
  };

  const insertEmoji = (emoji) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const textNode = document.createTextNode(emoji);
      range.deleteContents();
      range.insertNode(textNode);
      range.collapse(false);
    }
    setShowEmojiPicker(false);
    editorRef.current.focus();
    forceEditorLTR();
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const link = document.createElement('a');
        link.href = linkUrl;
        link.textContent = linkText;
        range.deleteContents();
        range.insertNode(link);
      }
    }
    setShowLinkInput(false);
    setLinkUrl('');
    setLinkText('');
    editorRef.current.focus();
    forceEditorLTR();
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100%';
        img.style.height = 'auto';

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(img);
        }
        forceEditorLTR();
      };
      reader.readAsDataURL(file);
    }
  };

  const sanitizeDirection = (node) => {
    if (!node) return;
    if (node.nodeType === 1) {
      if (node.getAttribute('dir') === 'rtl') node.setAttribute('dir', 'ltr');
      if (node.style && node.style.direction === 'rtl') node.style.direction = 'ltr';
      if (node.style && node.style.textAlign === 'right') node.style.textAlign = 'left';
      if (node.style && node.style.unicodeBidi) node.style.unicodeBidi = 'normal';
      for (let i = 0; i < node.childNodes.length; i++) {
        sanitizeDirection(node.childNodes[i]);
      }
    }
  };

  const forceEditorLTR = () => {
    if (editorRef.current) {
      editorRef.current.setAttribute('dir', 'ltr');
      editorRef.current.style.direction = 'ltr';
      editorRef.current.style.textAlign = 'left';
      editorRef.current.style.unicodeBidi = 'normal';
      sanitizeDirection(editorRef.current);
    }
  };

  const handleEditorChange = () => {
    forceEditorLTR();
    if (onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleEditorFocus = () => {
    forceEditorLTR();
  };

  const handleEditorPaste = (e) => {
    e.preventDefault();
    let text = '';
    let html = '';
    if (e.clipboardData) {
      text = e.clipboardData.getData('text/plain');
      html = e.clipboardData.getData('text/html');
    }
    if (html) {
      html = html.replace(/dir\s*=\s*['"]rtl['"]/gi, 'dir="ltr"');
      html = html.replace(/direction\s*:\s*rtl/gi, 'direction: ltr');
      html = html.replace(/text-align\s*:\s*right/gi, 'text-align: left');
      document.execCommand('insertHTML', false, html);
    } else {
      document.execCommand('insertText', false, text);
    }
    setTimeout(() => {
      forceEditorLTR();
      if (onChange) {
        onChange(editorRef.current.innerHTML);
      }
    }, 0);
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.shiftKey && (e.key === 'Left' || e.key === 'Right')) {
      e.preventDefault();
      forceEditorLTR();
    }
  };

  return (
    <div className={styles.editorContainer}>
      <div className={styles.toolbar}>
        <div className={styles.toolbarGroup}>
          <button type="button" onClick={() => execCommand('bold')} className={styles.toolbarButton}>B</button>
          <button type="button" onClick={() => execCommand('italic')} className={styles.toolbarButton}>I</button>
          <button type="button" onClick={() => execCommand('strikeThrough')} className={styles.toolbarButton}>S</button>
        </div>
        <div className={styles.toolbarGroup}>
          <button type="button" onClick={() => setShowEmojiPicker(!showEmojiPicker)} className={styles.toolbarButton}>😀</button>
        </div>
        <div className={styles.toolbarGroup}>
          <button type="button" onClick={() => setShowLinkInput(!showLinkInput)} className={styles.toolbarButton}>🔗</button>
        </div>
        <div className={styles.toolbarGroup}>
          <label className={styles.toolbarButton}>
            📷
            <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {showEmojiPicker && (
        <div className={styles.emojiPicker}>
          {emojis.map((emoji, index) => (
            <button type="button" key={index} onClick={() => insertEmoji(emoji)} className={styles.emojiButton}>
              {emoji}
            </button>
          ))}
        </div>
      )}

      {showLinkInput && (
        <div className={styles.linkInput}>
          <input
            type="text"
            placeholder="Link text"
            value={linkText}
            onChange={(e) => setLinkText(e.target.value)}
            className={styles.linkTextInput}
          />
          <input
            type="url"
            placeholder="URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            className={styles.linkUrlInput}
          />
          <button type="button" onClick={insertLink} className={styles.insertLinkButton}>Insert</button>
        </div>
      )}

      <div
        ref={editorRef}
        className={styles.editor}
        contentEditable
        onInput={handleEditorChange}
        onBlur={handleEditorChange}
        onFocus={handleEditorFocus}
        onPaste={handleEditorPaste}
        onKeyDown={handleKeyDown}
        dangerouslySetInnerHTML={{ __html: value }}
        placeholder={placeholder}
        dir="ltr"
        style={{
          direction: 'ltr',
          textAlign: 'left',
          unicodeBidi: 'normal',
        }}
      />
    </div>
  );
};

export default RichTextEditor;
