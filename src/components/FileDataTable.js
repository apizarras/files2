import React from 'react';
import { IconSettings } from '@salesforce/design-system-react';

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
                        <li> File Id: {file.Id} </li>
                </div>
            </IconSettings>
        )
    }
    )}

export default FileDataTable;