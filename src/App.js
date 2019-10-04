import React from 'react';
import { IconSettings } from '@salesforce/design-system-react';
import './App.css';
import FileView from './components/FileView';
import Menu from './localhost/context/Menu';

function App(props) {
  return (
    <IconSettings iconPath="../public/_slds/icons'">
      <div className="App">
        <Menu />
        <FileView {...props}/>
      </div>
    </IconSettings>

  );
}

export default App;
