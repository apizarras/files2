import React, { useEffect, useState } from 'react';
import { DataTableCell } from '@salesforce/design-system-react';

const CustomDataTableCell = ({ children, ...props }) => {
  console.log("props.item.sync", props.item.sync)
  const [fileSync, setfileSync] = useState([{ FX5__Sync__c: props.item.sync }]);
  // useEffect();
  console.log("fileSync: ", fileSync)
  console.log("props ", props);
  console.log("children", children);
  let checkboxValue = props.item.sync;

  const handleCheckboxChange = (files, ...props) => {
    console.log("props", props);
    // console.log("dataService", dataService);
    console.log("files", files);

    setfileSync({FX5__Sync__c: !checkboxValue});
    console.log("checkboxvalue: ", checkboxValue)
    return props.dataService.toggleCheck()
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
    <DataTableCell className="slds-align_absolute-center" title={children} {...props} property="sync">
      {console.log("props, children: ", props, children)}
      <label>
        <input type="checkbox"
         value={props.item.sync}
          onClick={(e) => setfileSync({FX5__Sync__c: !checkboxValue})} />
      </label>
      { console.log("props.item.sync: ", props.item.sync) }
    </DataTableCell>
  )
};
CustomDataTableCell.displayName = DataTableCell.displayName;
console.log("customdatatablecell: ", CustomDataTableCell);

export default CustomDataTableCell;