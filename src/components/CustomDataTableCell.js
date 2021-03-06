import React, { useEffect, useState } from 'react';
import { DataTableCell, Checkbox, SetupAssistantStep } from '@salesforce/design-system-react';
import { createDataService } from '../localhost/apiMethods';
import { useConnection } from '../localhost/context/Connect';


const CustomDataTableCell = ({ children, ...props }) => {
  const items = props.items;
  const file = {
    id: props.item.id,
    LatestPublishedVersionId: props.item.LatestPublishedVersionId,
    sync: props.item.sync
  };
  let checkboxValue = props.item.sync;
  const Id = props.item.id;
  const sendData = () => {
    props.handleCheckboxChange(Id, checkboxValue, [items], file);
  };
  return(
    <DataTableCell className="slds-align_absolute-center" title="title">
      <Checkbox checked={checkboxValue} id={Id} onChange={sendData} />
    </DataTableCell>
  )
};
CustomDataTableCell.displayName = DataTableCell.displayName;

export default CustomDataTableCell;