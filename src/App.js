import React from 'react';
import logo from './logo.svg';
import './App.css';
import FileView from './components/FileView';

function App(props) {
  return (
    <div className="App">
      <FileView {...props}/>
    </div>
  );
}

export default App;
