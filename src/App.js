import React from 'react';
import logo from './logo.svg';
import './App.css';
import FileView from './components/FileView';
import Menu from './localhost/context/Menu'

function App(props) {
  return (
    <div className="App">
      <Menu />
      <FileView {...props}/>
    </div>
  );
}

export default App;
