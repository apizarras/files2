import React, { useState, useEffect } from 'react';
import { ComponentContextProvider, useComponentContext } from './components/Context/context';
import { IconSettings } from '@salesforce/design-system-react';
import FileView from './components/FileView';

export default function LightningComponent(props) {
  const { settings, dataService, eventService, connection } = props;
  console.log("connection: ", connection);
  return (
    <IconSettings iconPath="../public/_slds/icons">
      <ComponentContextProvider
        settings={settings}
        dataService={dataService}
        eventService={eventService}
        connection={connection}>
        <App/>
      </ComponentContextProvider>
    </IconSettings>
  );
}

const App = () => {
  const { api, settings, connection } = useComponentContext();
  const [description, setDescription] = useState();
  console.log("connection: ", connection);

  useEffect(() => {
    async function fetch() {
      if (!settings) return;
      const { sObjectName } = settings;
      if (!sObjectName) return;

      const description = await api.describe(sObjectName);
      setDescription(description);
    }

    fetch();
  }, [api, settings, connection]);

  if (!description) return null;

  return (
    <FileView description={description}/>
  );
};
