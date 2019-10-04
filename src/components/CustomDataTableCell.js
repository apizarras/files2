import React from 'react';
import { DataTableCell, Checkbox } from '@salesforce/design-system-react';


const CustomDataTableCell = ({ children, ...props }) => {
  console.log("props.item ", props.item);
  console.log("children", children);
  let checkboxValue = props.item.sync;
console.log(typeof checkboxValue);

  return(
    <DataTableCell title={children} {...props} property="sync">
      {console.log("props, children: ", props, children)}
      <Checkbox checked={checkboxValue} />
      { console.log("props.sync: ", props.item.sync) }
    </DataTableCell>
  )
};
CustomDataTableCell.displayName = DataTableCell.displayName;
console.log("customdatatablecell: ", CustomDataTableCell);

export default CustomDataTableCell;