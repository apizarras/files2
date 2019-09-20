import React from 'react';
// import * as api from '../api/api';
import { ProgressBar, SetupAssistantStep } from '@salesforce/design-system-react';
import { NONAME } from 'dns';

const AddFileDialog = ({handleClose, children, isOpen, onSave, parentId, connection}) => {
    const showHideModal = isOpen ? "modal display-block" : "modal display-none";
    // const { onSave } = props;
    const [percentCompleted, setPercentCompleted] = React.useState(null);
    const [showPercentCompleted, setShowPercentCompleted] = React.useState(false);
    const [uploadError, setUploadError] = React.useState(null);
    const [hasNewFile, setHasNewFile] = React.useState(false);

    function resetAndOpen() {
        setUploadError(null);
        setShowPercentCompleted(false);
        setPercentCompleted(null)
        // setIsOpen(true);
      }
    
      function saveAndClose() {
        onSave();
        // setIsOpen(false);
      }

      const handleFileChange = (e) => {
        setHasNewFile(!!e.target.value)
      };

    // function uploadFile() {
    //     const fxFileInput = document.getElementById('fxFileInput');
    //     var file = fxFileInput.files[0];
    //     if (!file) return Promise.resolve();
    
    //     setShowPercentCompleted(true);
    
    //     var reader = new FileReader();

    //     return new Promise(function(resolve, reject){
    //       reader.onload = function( e ) {
    //         var fileData = btoa( e.target.result );
    
    //         var contentVersionData = {
    //             "FirstPublishLocationId": parentId,
    //             "Title": file.name,
    //             "PathOnClient": file.name,
    //             "VersionData": fileData
    //           };
    //         const onUploadProgress = function(progressEvent) {
    //             console.log("progress event: ", progressEvent);
    //           setPercentCompleted( Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
    //           console.log(`%c>>>> percentCompleted `, `background-color: yellow;` , percentCompleted, progressEvent );
    //         };
    // console.log("percent Completed: ", percentCompleted);

    //         return api.uploadFile( connection, parentId, contentVersionData, onUploadProgress )
    //           .then(resolve, reject);
    //       };
    
    //       reader.readAsBinaryString( file );
    //     })
    //     .then(saveAndClose)
    //     .catch(function(err) {
    //       setUploadError(err);
    //       console.log(`%c>>>> ERROR `, `background-color: yellow; color:green;` , err );
    //     })
    //   }
    
    return (
    <div
        className={showHideModal} isopen={isOpen}>
        <section className="modal-main">
        <input id='fxFileInput' type="file" className="form-control" onChange={handleFileChange}/>
            {children}
            { console.log("percent complete: ", percentCompleted)}
            {showPercentCompleted && <ProgressBar value={percentCompleted} progress color='success' error={uploadError} />}

            <button onClick={null}>Upload</button>
            <button onClick={handleClose}>Cancel</button>
        </section>
    </div>
    )
}

export default AddFileDialog;