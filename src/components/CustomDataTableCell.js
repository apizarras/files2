import React, { useEffect, useState } from 'react';
import { DataTableCell } from '@salesforce/design-system-react';

const CustomDataTableCell = ({ children, ...props }) => {
  console.log("props.item.sync", props.item.sync)
  const [files, setFiles] = useState([{ FX5__Sync__c: props.item.sync }]);
  useEffect(() => console.log(files), [files]);
  console.log("props.item ", props.item);
  console.log("children", children);
  let checkboxValue = props.item.sync;

  const handleCheckboxChange = (...props) => {
    console.log("props", props);
    setFiles({FX5__Sync__c: !checkboxValue});
    console.log("checkboxvalue: ", checkboxValue)
    // return props.dataService.toggleCheck()
      // .then(resolve, reject)
  };
  // toggleSyncFlag = (file, index) => {
  //   const { connection } = this.props;
  //   this.setState({updatingIndex: index})
  //   return api.toggleSyncFlag(connection, {...file, FX5__Sync__c: !file.FX5__Sync__c})
  //     .then(result => {
  //       let {files} = this.state;
  //       const fileInfo = files[index];
  //       fileInfo.ContentDocument.LatestPublishedVersion = {...file, FX5__Sync__c: !file.FX5__Sync__c};
  //       files.splice(index, 1, fileInfo);
  //       this.setState({files: [...files], updatingIndex: null})
  //     })
  // }

  return(
    <DataTableCell title={children} {...props} property="sync">
      {console.log("props, children: ", props, children)}
      <label>
        <input type="checkbox" value={props.item.sync} onClick={(handleCheckboxChange)} />
      </label>
      { console.log("props.item.sync: ", props.item.sync) }
    </DataTableCell>
  )
};
CustomDataTableCell.displayName = DataTableCell.displayName;
console.log("customdatatablecell: ", CustomDataTableCell);

export default CustomDataTableCell;