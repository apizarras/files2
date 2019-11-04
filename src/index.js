import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as api from './localhost/apiMethods';
import { ConnectionProvider, useConnection, useSettings } from './localhost/context';

function LocalComponent() {
  const connection = useConnection();
  console.log("connection", connection);
  const [settings] = useSettings();
  console.log("settings", settings);

  const dataService = api.createDataService(connection);
  console.log("dataService", dataService);

  const eventService = api.eventService();
  return <App settings={settings} dataService={dataService} eventService={eventService}/>;
}

ReactDOM.render(
  <ConnectionProvider>
    <LocalComponent />
  </ConnectionProvider>,
  document.getElementById('fx'),
);
