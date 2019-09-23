import React, { Component } from 'react';
import { Icon, IconSettings, Card, Modal, DataTable, DataTableColumn, DataTableCell }  from '@salesforce/design-system-react';
import './FileView.css';
import AddFileDialog from './AddFileDialog';
// import * as api from '../api/api';
import queryString from 'query-string';
import FileDataTable from './FileDataTable';
import { createDataService } from '../localhost/apiMethods';
import { getConnection } from '../localhost/context/Connect';

const columns = [
  <DataTableColumn
    key="file-name"
    label="File Name"
    property="fileName"
  />,
  <DataTableColumn
    key="last-modified-date"
    label="Last Modified Date"
    property="lastModifiedDate"
  />,
  <DataTableColumn
    key="last-modified-by"
    label="Last Modified By"
    property="lastModifiedBy"
  />,
  <DataTableColumn
    key="sync"
    label="Sync"
    property="Sync"
  />
]

class FileView extends Component {
    constructor(props) {
        super(props);
            this.state = {
                isOpen: false,
                files: [],
                connection: props.connection,
                parentId: null,
                sessionExpired: false,
                isBusy: true,
                isDirty: false,
                fileToDelete: null,
                showDeletePrompt: false,
                embedded: (window.FX && window.FX.SALESFORCE && window.FX.SALESFORCE.embedded) || (queryString.parse(document.location.search).embedded && JSON.parse(queryString.parse(document.location.search).embedded)) || false,
                sObjectId: (window.FX && window.FX.SALESFORCE && window.FX.SALESFORCE.currentObjectId) || queryString.parse(document.location.search).id

            }
        }

    componentDidMount() {
      console.log("props: ", this.props) //props = dataService, events, settings
      //fetch file data to render on FileDataTable
      this.fetchData();
        console.log("component did mount", this.state);
    }

    toggleOpen = () => {
        this.setState({isOpen: true});
        console.log("toggleOpen: ", this.state.isOpen);
    };

    toggleClose = () => {
        this.setState({isOpen: false});
        console.log("toggleClose: ", this.state.isOpen)
    }

    fetchData = () => {
      //connection is undefined
        const { connection } = this.props;
        const { sObjectId, embedded } = this.state;
        const descriptions = {};
    console.log("this.state: ", this.state)
        this.setState({
          isBusy: true
        });
    console.log("connection: ", connection);
        this.props.dataService
          .describeGlobal()
          .then((response) => {
            console.log("response ", response);
            console.log("connection ", connection);
            //ContentVersion
            return this.props.dataService.fetchDescription(connection, descriptions)
          })
          .then(() => {
            console.log(this.props.dataService)
            const description = descriptions[sObjectId.slice(0,3)];
            return Promise.all([this.props.dataService.fetchFiles(connection, sObjectId, embedded), this.props.dataService.getObjectInfo(connection, description.name, sObjectId)])
          })
          .then(([files, objectName]) => {
            this.setState({ files, objectName, isBusy: false });
            console.log("files state: ", this.state.files);
          })
          .catch(function(err) {
            if (err.errorCode === 'INVALID_SESSION_ID') {
              this.setState({ sessionExpired: true, isBusy: false });
            }
            console.log(`%c>>>> ERROR `, `background-color: red; color:yellow;` , err );
          })
      };

    render() {
        return (
        <IconSettings iconPath="/assets/icons">
            <div className="slds-grid slds-grid_vertical component-container">
            <Card
                heading="Files"
                icon={<Icon category="standard" name="document" size="small" />}
                headerActions={<button type="button" onClick={this.toggleOpen}>Upload File</button>}
            >
                <Modal heading="File Upload" isOpen={this.state.isOpen} ariaHideApp={false}>
                    { console.log("sObjectId, ", this.state.sObjectId)}
                    <AddFileDialog
                        onSave={this.fetchData}
                        connection={this.props.connection}
                        parentId={this.state.sObjectId}
                        handleClose={this.toggleClose}
                        />
                </Modal>
                <DataTable>
                  {columns}
                </DataTable>
                { console.log("files: ", this.state.files) }
              <FileDataTable files={this.state.files} />
            </Card>
            </div>
        </IconSettings>
        )
    }

}

export default FileView;