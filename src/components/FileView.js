import React, { Component } from 'react';
import { Icon, IconSettings, Card, Modal, DataTable, DataTableColumn, DataTableCell, DataTableRowActions, Dropdown }  from '@salesforce/design-system-react';
import './FileView.css';
import AddFileDialog from './AddFileDialog';
// import * as api from '../api/api';
import queryString from 'query-string';
// import FileDataTable from './FileDataTable';
import { createDataService } from '../localhost/apiMethods';
import { getConnection } from '../localhost/context/Connect';
import { CONTENTDOCUMENTLINK_FIELDS } from '../constants';

const columns = [
  <DataTableColumn
    key="title"
    label="Title"
    property="title"
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

    handleSelectionAction = (e, value) => {
      console.log("Id: ", this.state.files[0])
      console.log("selected: ", e, value, e.url)
      const newValue = value.label;
      switch (newValue) {
        case "Delete":
          this.handleFileDelete(e.id);
          console.log("call handleFileDelete");
          break;
        case "Preview":
          this.previewFile(e.id);
          console.log("call previewFiles");
          break;
        case "Download":
          this.downloadFile(e.id);
          console.log("call download");
          break;
      }
    }

    handleFileDelete = (id) => {
      console.log("file id: ", id);
      console.log("props: ", this.props.dataService);

      return this.props.dataService
      .deleteItems(id)
      .then(response => {
        console.log("response: ", response);
      })
      .catch(error => {
        console.error(error);
      })
    }

    previewFile = (id) => {
      console.log("previewing the file", id);
      //open file link in new tab
      const newUrl = "https://na73.salesforce.com/" + id;
      const win = window.open(newUrl, '_blank')
    }

    downloadFile = (e) => {
      // console.log("downloading file, connection: ", connection);//connection is id
      console.log("state connection: ", this.state.connection);
      const connection = this.state.connection; //without this connection comes over as record Id
      //url link to file
      return this.props.dataService.downloadFile(connection, e);
    }

    fetchData = () => {
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
            console.log(this.props.dataService);
            console.log("state sObjectId", this.state.sObjectId);
            const description = descriptions[sObjectId.slice(0,3)];
            console.log("description, ", description);
            return Promise.all([this.props.dataService.fetchFiles(connection, sObjectId, embedded)
              // , this.props.dataService.getObjectInfo(connection, sObjectId)
            ])
          })
          .then(([files, objectName]) => {
            this.setState({ files, objectName, isBusy: false });
            console.log("file detail: ", this.state.files);
            const fileDetail = this.state.files;
            console.log(this.state);
            const fileDetails = fileDetail.map(detail => {
              return {
                id: detail.ContentDocument.Id,
                title: detail.ContentDocument.LatestPublishedVersion.Title,
                lastModifiedDate: detail.ContentDocument.LatestPublishedVersion.LastModifiedDate,
                lastModifiedBy: detail.ContentDocument.LatestPublishedVersion.LastModifiedBy.Name,
                Sync: detail.ContentDocument.LatestPublishedVersion.FX5__Sync__c,
                url: detail.ContentDocument.attributes.url
              }
            })
            console.log(fileDetails);
            this.setState({ ...this.state, files: fileDetails})
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
                        files={this.state.files}
                        dataService={this.props.dataService}
                        />
                </Modal>
                <DataTable items={this.state.files}>
                  {columns}
                  <DataTableRowActions
                  item=""
                  onAction={this.handleSelectionAction}
                  dropdown={<Dropdown iconCategory="utility"
                    iconName="down"
                    // onSelect=
                    options={[
                      {label: "Download"},
                      {label: "Preview"},
                      {label: "Delete"}
                      ]}/>} />
                </DataTable>
            </Card>
            </div>
        </IconSettings>
        )
    }

}

export default FileView;