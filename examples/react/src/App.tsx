import { useState, useRef } from 'react';
import { Editor } from './components/Editor';
import { Renderer } from './components/Renderer';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'view'>('editor');
  const [editorData, setEditorData] = useState<any>(null);
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const editorRef = useRef<any>(null);

  const handleEditorChange = (data: any) => {
    setEditorData(data);
  };

  const handleSave = async () => {
    try {
      if (!editorRef.current) return;

      const savedData = await editorRef.current.save();
      localStorage.setItem('slabs-content', JSON.stringify(savedData));
      setEditorData(savedData);

      setStatus({
        message: '✅ Content saved successfully! View it on the View tab.',
        type: 'success'
      });

      setTimeout(() => setStatus(null), 3000);
    } catch (error) {
      console.error('Error saving content:', error);
      setStatus({
        message: '❌ Error saving content. Check console for details.',
        type: 'error'
      });
    }
  };

  const handleClear = async () => {
    if (!confirm('Are you sure you want to clear all content?')) return;

    try {
      if (!editorRef.current) return;

      await editorRef.current.clear();
      localStorage.removeItem('slabs-content');
      setEditorData(null);

      setStatus({
        message: '🗑️ Content cleared!',
        type: 'info'
      });

      setTimeout(() => setStatus(null), 2000);
    } catch (error) {
      console.error('Error clearing content:', error);
    }
  };

  // Load data from localStorage on mount
  const loadedData = localStorage.getItem('slabs-content');
  const initialData = loadedData ? JSON.parse(loadedData) : null;

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <nav className="nav">
              <button
                className={`nav-link ${activeTab === 'editor' ? 'active' : ''}`}
                onClick={() => setActiveTab('editor')}
              >
                Editor
              </button>
              <button
                className={`nav-link ${activeTab === 'view' ? 'active' : ''}`}
                onClick={() => setActiveTab('view')}
              >
                View
              </button>
            </nav>
          </div>
          {activeTab === 'editor' && (
            <div className="actions">
              <button className="btn btn-primary" onClick={handleSave}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleClear}>
                Clear
              </button>
            </div>
          )}
        </div>
      </header>

      {status && (
        <div className={`status status--${status.type} show`}>
          {status.message}
        </div>
      )}

      <div className="content-container">
        <div className="content-wrapper">
          {activeTab === 'editor' ? (
            <div className="editor-container">
              <Editor
                ref={editorRef}
                data={initialData}
                onChange={handleEditorChange}
              />
            </div>
          ) : (
            <Renderer data={editorData || initialData} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
