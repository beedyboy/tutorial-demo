import React from 'react';
import './App.css';
import Notifier from 'Page/Notifier';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to Firebase Notification Demo</h1>
      </header>
      <main>
        <Notifier />
      </main>
    </div>
  );
}

export default App;