import React, { useState, useEffect } from 'react';
import { ComponentContextProvider, useComponentContext } from './components/Context/context';
import { IconSettings } from '@salesforce/design-system-react';
import FileView from './components/FileView';

export default function LightningComponent(props) {
  const { settings, dataService, eventService } = props;

  return (
    <IconSettings iconPath="../public/_slds/icons">
      <ComponentContextProvider
        settings={settings}
        dataService={dataService}
        eventService={eventService}>
        <App/>
      </ComponentContextProvider>
    </IconSettings>
  );
}

const App = () => {
  const { api, settings } = useComponentContext();
  const [description, setDescription] = useState();
  useEffect(() => {
    async function fetch() {
      if (!settings) return;
      const { sObjectName } = settings;
      if (!sObjectName) return;

      const description = await api.describe(sObjectName);
      setDescription(description);
    }

    fetch();
  }, [api, settings]);

  if (!description) return null;

  return (
    <FileView description={description}/>
  );
};
