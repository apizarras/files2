import React from 'react';
import { IconSettings, DataTable, DataTableColumn, DataTableCell } from '@salesforce/design-system-react';

const FileDataTable = (props) => {
    console.log("files state: ", props);

    // const handleFiles = (props) => {
    //     const items = props.map(props.files);
    //     console.log("items: ", items);
    //     return items;
    // };

    return props.files.map((fileInfo, index) => {
        const file = fileInfo.ContentDocument.LatestPublishedVersion;
        console.log("props.files.map ", props.files);
        return (
            <IconSettings iconPath="assets/icons">
                <div style={{overflow: 'auto'}}>
                    <h3 className="slds-text-heading_medium slds-m-vertical_medium">
                        Files
                    </h3>
                    <DataTable items={file}>
                
                    </DataTable>
                </div>
            </IconSettings>
        )
    }
    )}

export default FileDataTable;