import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here if needed
  }

  render() {
    if (this.state.hasError) {
      return <div style={{ color: 'red', textAlign: 'center', margin: '2rem' }}>Something went wrong while loading this question.</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary; 