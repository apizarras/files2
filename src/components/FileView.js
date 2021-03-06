import React, { Component } from 'react';
import { Icon, IconSettings, Button, Card, Modal, DataTable, DataTableColumn, DataTableRowActions, Dropdown, Checkbox }  from '@salesforce/design-system-react';
import './FileView.scss';
import AddFileDialog from './AddFileDialog';
import queryString from 'query-string';
import moment from 'moment';
import CustomDataTableCell from './CustomDataTableCell';



class FileView extends Component {
    constructor(props) {
        super(props);
            this.state = {
                selection: [],
                isOpen: false,
                files: [],
                fileCount: null,
                connection: props.connection,
                parentId: null,
                sessionExpired: false,
                isBusy: true,
                isDirty: false,
                fileToDelete: [],
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
      console.log("this.state: ", this.state);
      const newValue = value.label;
      switch (newValue) {
        case "Delete":
          this.promptFileDelete(e.id);
          break;
        case "Preview":
          this.previewFile(e.id);
          break;
        case "Download":
          this.downloadFile(e.id);
          break;
      }
    }

    promptFileDelete = (fileInfo) => {
      const selection = this.state.selection
      selection.push(fileInfo);
      this.setState({fileToDelete: selection, showDeletePrompt: true});
    }

    handleFileDelete = (fileToDelete) => {
      const id = this.state.fileToDelete;
      return this.props.dataService
      .deleteItems(id)
      .then(response => {
        this.setState({fileToDelete: []});
        this.setState({showDeletePrompt: false});
        this.setState({selection: []});
      })
      .then(this.fetchData)
      .catch(error => {
        console.error(error);
      })
    }

    previewFile = (id) => {
      console.log("props: ", this.props.connection);
      const newUrl = this.props.connection.instanceUrl + `/lightning/r/ContentDocument/` + id + `/view`;
      const win = window.open(newUrl, '_blank');
    }

    downloadFile = (e) => {
      const connection = this.state.connection;
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
              //, this.props.dataService.getObjectInfo(connection, sObjectId)
            ])
          })
          .then(([files, objectName]) => {
            this.setState({ files, objectName, isBusy: false });
            const fileDetail = this.state.files;
            const fileDetails = fileDetail.map(detail => {
              return {
                id: detail.ContentDocument.Id,
                LatestPublishedVersionId: detail.ContentDocument.LatestPublishedVersion.Id,
                title: detail.ContentDocument.LatestPublishedVersion.Title,
                createdBy: detail.ContentDocument.LatestPublishedVersion.CreatedBy.Name,
                lastModifiedDate: moment.utc(detail.ContentDocument.LatestPublishedVersion.LastModifiedDate).local().format('L LT'),
                lastModifiedBy: detail.ContentDocument.LatestPublishedVersion.LastModifiedBy.Name,
                sync: detail.ContentDocument.LatestPublishedVersion.FX5__Sync__c,
                url: detail.ContentDocument.attributes.url
              }
            });
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

      handleCheckboxChange = (Id, checkboxValue, [items], file, index) => {
        const { connection } = this.props;
        this.setState({updatingIndex: index});
         const files = this.state.files;
        return this.props.dataService.toggleSyncFlag(connection, {...file, sync: !file.sync})
          .then(result => {
            this.fetchData();
            this.setState({files: [...files], updatingIndex: null});
          })
      }

    render() {
        return (
        <IconSettings iconPath="../../_slds/icons">
            <div className="slds-grid slds-grid_vertical component-container">
              <Card
                  heading={this.state.fileCount > 1 && <strong>Files {(`(${this.state.fileCount})`)}</strong> || this.state.fileCount === 1 && <strong>File {(`(${this.state.fileCount})`)}</strong> }
                  icon={<Icon category="standard" name="document" size="medium" />}
                  headerActions={<button type="button" className="slds-button slds-button_neutral" onClick={this.toggleOpen}>Upload File</button>}
              >
                  <Modal heading="Upload File" isOpen={this.state.isOpen} ariaHideApp={false} disableClose>
                      <AddFileDialog
                          onSave={this.fetchData}
                          connection={this.props.connection}
                          parentId={this.state.sObjectId}
                          handleClose={this.toggleClose}
                          files={this.state.files}
                          dataService={this.props.dataService}
                          />
                  </Modal>
                  <div className="data-table">
                    <DataTable fixedHeader fixedLayout items={this.state.files}>
                      <DataTableColumn label="Sync" property="sync" width="20%">
                        <CustomDataTableCell handleCheckboxChange={this.handleCheckboxChange}/>
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
                  </div>
                  <Modal heading="Delete File?" isOpen={this.state.showDeletePrompt} ariaHideApp={false} disableClose
                  footer={[
                    <Button label="Cancel" onClick={() => this.setState({showDeletePrompt: false})} />,
                    <Button label="Delete" variant="brand" onClick={this.handleFileDelete} />,
                  ]}>
                          <p className="slds-m-around_medium">Deleting a file also removes it from any records or posts it's attached to.</p>
                  </Modal>
              </Card>
            </div>
        </IconSettings>
        )
    }
}

export default FileView;