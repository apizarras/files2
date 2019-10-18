import React, { useEffect, useState } from 'react';
import { DataTableCell, Checkbox, SetupAssistantStep } from '@salesforce/design-system-react';
import { createDataService } from '../localhost/apiMethods';
import { useConnection } from '../localhost/context/Connect';


const CustomDataTableCell = ({ children, ...props }) => {

  console.log("props ", props);
  console.log("children", children);
  let checkboxValue = props.item.sync;
  const Id = props.item.id;
  return(
    <DataTableCell className="slds-align_absolute-center" title="title" property="sync">
      {console.log("props, Id, children: ", props, Id, children)}
      <Checkbox checked={checkboxValue} onChange={props.handleCheckboxChange} file={props.item}/>
    </DataTableCell>
  )
};
CustomDataTableCell.displayName = DataTableCell.displayName;
console.log("customdatatablecell: ", CustomDataTableCell);

export default CustomDataTableCell;