import React from 'react';
import { ProgressBar } from '@salesforce/design-system-react';
import './AddFileDialog.scss';

const AddFileDialog = ({handleClose, children, isOpen, onSave, parentId, connection, ...props  }) => {
    const [percentCompleted, setPercentCompleted] = React.useState(null);
    const [showPercentCompleted, setShowPercentCompleted] = React.useState(false);
    const [uploadError, setUploadError] = React.useState(null);
    const [hasNewFile, setHasNewFile] = React.useState(false);
    const [fileName, setFileName] = React.useState(null);

    function reset() {
        setUploadError(null);
        setShowPercentCompleted(false);
        setPercentCompleted(null);
        handleClose();
      }

      function saveAndClose() {
        onSave();
        reset();
      }

      const handleFileChange = (e) => {
        setHasNewFile(!!e.target.value);
        setFileName(e.target.value);
      };

    function uploadFile() {
        const fxFileInput = document.getElementById('fxFileInput');
        var file = fxFileInput.files[0];
        if (!file) return Promise.resolve();

        setShowPercentCompleted(true);
        var reader = new FileReader();

        return new Promise(function(resolve, reject){
          reader.onload = function( e ) {
            var fileData = btoa( e.target.result );
            var contentVersionData = {
                "FirstPublishLocationId": parentId,
                "Title": file.name,
                "PathOnClient": file.name,
                "VersionData": fileData
              };
            const onUploadProgress = function(progressEvent) {
              setPercentCompleted( Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
              console.log(`%c>>>> percentCompleted `, `background-color: yellow;` , percentCompleted, progressEvent );
            };

            return props.dataService.uploadFile( connection, parentId, contentVersionData, onUploadProgress )
              .then(resolve, reject);
          };

          reader.readAsBinaryString( file );
        })
        .then(saveAndClose)
        .catch(function(err) {
          setUploadError(err);
          console.log(`%c>>>> ERROR `, `background-color: yellow; color:green;` , err );
        })
      }

    return (
    <div className="showHideModal" isopen={isOpen}>
        <section>
          <div className="slds-modal__content slds-m-around_medium">
            <label className="custom-file-upload slds-button slds-float_left slds-m-right_medium">
              <input id="fxFileInput" type="file" className="" onChange={handleFileChange}/>
            Choose File
            </label>
            {hasNewFile && <p className="slds-m-top_small">{fileName}</p> || !hasNewFile && <p className="slds-m-top_small">Select File to Upload</p>}
            {showPercentCompleted && <ProgressBar className="slds-progress-bar slds-m-top_large" value={percentCompleted} progress color="success" error={uploadError} />}
          </div>
          <footer className="slds-modal__footer">
              <button onClick={uploadFile} className="slds-button slds-button_neutral">Upload</button>
              <button onClick={handleClose} className="slds-button slds-button_brand">Cancel</button>
            </footer>
        </section>
    </div>
    )
}

export default AddFileDialog;