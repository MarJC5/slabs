/**
 * App - React Example using @slabs/editor
 * Icon-only UI with save button, view toggle, notifications, and keyboard shortcuts
 */

import { EditorWithControls } from './components/EditorWithControls';

function App() {
  return <EditorWithControls storageKey="slabs-content" />;
}

export default App;
