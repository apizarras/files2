import React from 'react';
import ReactDOM from 'react-dom';
import LightningComponent from './index-lightning';
import { createDataService, events } from './localhost/apiMethods';
import { ConnectionProvider, useConnection, useSettings } from './localhost/context';

function LocalComponent() {
  const connection = useConnection();
  const [settings] = useSettings();
  const dataService = createDataService(connection);
  return <LightningComponent settings={settings} dataService={dataService} events={events} connection={connection} />;
}

ReactDOM.render(
  <ConnectionProvider>
    <LocalComponent />
  </ConnectionProvider>,
  document.getElementById('fx'),
);
