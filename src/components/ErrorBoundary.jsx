import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: '#0f0f0f',
            color: '#f5f5f5',
            textAlign: 'center',
          }}
        >
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ Something went wrong</h1>
          <p style={{ marginBottom: '1rem', opacity: 0.8 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#e50914',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            Reload Page
          </button>
          <details style={{ marginTop: '2rem', textAlign: 'left', maxWidth: '600px' }}>
            <summary style={{ cursor: 'pointer', marginBottom: '1rem' }}>
              Error Details
            </summary>
            <pre
              style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '1rem',
                borderRadius: '8px',
                overflow: 'auto',
                fontSize: '0.875rem',
              }}
            >
              {this.state.error?.stack || String(this.state.error)}
            </pre>
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

