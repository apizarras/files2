import React from 'react';
import { DataTableCell, Checkbox } from '@salesforce/design-system-react';


const CustomDataTableCell = ({ children, ...props }) => {
  console.log("props.item ", props.item);
  console.log("children", children);

  return(
    <DataTableCell title={children} {...props} property="sync">
      {console.log("props, children: ", props, children)}
      <Checkbox />
      {children}
    </DataTableCell>
  )
};
CustomDataTableCell.displayName = DataTableCell.displayName;
console.log("customdatatablecell: ", CustomDataTableCell);

export default CustomDataTableCell;