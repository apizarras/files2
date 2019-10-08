import React from 'react';
import { DataTableCell, Checkbox, SetupAssistantStep } from '@salesforce/design-system-react';


const CustomDataTableCell = ({ children, ...props }) => {
  console.log("props.item ", props.item);
  console.log("children", children);
  let checkboxValue = props.item.sync;
console.log(typeof checkboxValue);

const handleCheck = (event) => {
console.log("handleCheck called");
if (checkboxValue === false) {
//update state for sync to be true
}
};

  return(
    <DataTableCell title={children} {...props} property="sync">
      {console.log("props, children: ", props, children)}
      <Checkbox checked={checkboxValue} onChange={handleCheck}/>
      { console.log("props.sync: ", props.item.sync) }
    </DataTableCell>
  )
};
CustomDataTableCell.displayName = DataTableCell.displayName;
console.log("customdatatablecell: ", CustomDataTableCell);

export default CustomDataTableCell;