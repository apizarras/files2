import React, { Component } from 'react';
import { Icon, IconSettings, Card, Modal, DataTable, DataTableColumn, DataTableCell, DataTableRowActions, Dropdown }  from '@salesforce/design-system-react';
import './FileView.css';
import AddFileDialog from './AddFileDialog';
// import * as api from '../api/api';
import queryString from 'query-string';
import moment from 'moment';
import CustomDataTableCell from './CustomDataTableCell';



class FileView extends Component {
    constructor(props) {
        super(props);
            this.state = {
                isOpen: false,
                files: [],
                fileCount: null,
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
      this.fetchData();
    }

    toggleOpen = () => {
        this.setState({isOpen: true});
    };

    toggleClose = () => {
        this.setState({isOpen: false});
    }

    countFiles =(fileCount) => {
      this.setState({fileCount: this.state.files.length});
    }

    handleSelectionAction = (e, value) => {
      const newValue = value.label;
      switch (newValue) {
        case "Delete":
          this.handleFileDelete(e.id);
          break;
        case "Preview":
          this.previewFile(e.id);
          break;
        case "Download":
          this.downloadFile(e.id);
          break;
      }
    }

    handleFileDelete = (id) => {
      return this.props.dataService
      .deleteItems(id)
      .then(response => {
        console.log("response: ", response);
      })
      .then(this.fetchData)
      .catch(error => {
        console.error(error);
      })
    }

    previewFile = (id, e) => {
      const newUrl = "https://na73.salesforce.com/lightning/r/ContentDocument/" + id + "/view";
      const win = window.open(newUrl, '_blank');
    }

    downloadFile = (e) => {
      const connection = this.state.connection; //without this connection comes over as record Id
      //url link to file
      return this.props.dataService.downloadFile(connection, e);
    }

    fetchData = () => {
        const { connection } = this.props;
        const { sObjectId, embedded } = this.state;
        const descriptions = {};
        this.setState({
          isBusy: true
        });
        this.props.dataService
          .describeGlobal()
          .then((response) => {
            return this.props.dataService.fetchDescription(connection, descriptions)
          })
          .then(() => {
            const description = descriptions[sObjectId.slice(0,3)];
            return Promise.all([this.props.dataService.fetchFiles(connection, sObjectId, embedded)
              // , this.props.dataService.getObjectInfo(connection, sObjectId)
            ])
          })
          .then(([files, objectName]) => {
            this.setState({ files, objectName, isBusy: false });
            const fileDetail = this.state.files;
            const fileDetails = fileDetail.map(detail => {
              return {
                id: detail.ContentDocument.Id,
                title: detail.ContentDocument.LatestPublishedVersion.Title,
                createdBy: detail.ContentDocument.LatestPublishedVersion.CreatedBy.Name,
                lastModifiedDate: moment.utc(detail.ContentDocument.LatestPublishedVersion.LastModifiedDate).local().format('L LT'),
                lastModifiedBy: detail.ContentDocument.LatestPublishedVersion.LastModifiedBy.Name,
                sync: Boolean.prototype.valueOf(detail.ContentDocument.LatestPublishedVersion.FX5__Sync__c),
                url: detail.ContentDocument.attributes.url
              }
            })
            this.setState({ ...this.state, files: fileDetails});
            this.countFiles(files);
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
        <IconSettings iconPath="../../_slds/icons">
            <div className="slds-grid slds-grid_vertical component-container">
              <Card
                  heading={<h3>Files {(`(${this.state.fileCount})`)}</h3>}
                  icon={<Icon category="standard" name="document" size="small" />}
                  headerActions={<button type="button" onClick={this.toggleOpen}>Upload File</button>}
              >
                  <Modal heading="File Upload" isOpen={this.state.isOpen} ariaHideApp={false}>
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
                    <DataTableColumn label="Sync" property="sync">
                      <CustomDataTableCell />
                    </DataTableColumn>
                    <DataTableColumn label="Title" property="title" />
                    <DataTableColumn label="Created By" property="createdBy" />
                    <DataTableColumn label="Last Modified Date" property="lastModifiedDate" />
                    <DataTableRowActions
                    onAction={this.handleSelectionAction}
                    dropdown={<Dropdown iconCategory="utility"
                      iconName="down"
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