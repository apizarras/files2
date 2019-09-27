import React from 'react';
import { ProgressBar, SetupAssistantStep } from '@salesforce/design-system-react';
import { NONAME } from 'dns';

const AddFileDialog = ({handleClose, children, isOpen, onSave, parentId, connection, ...props  }) => {
    const showHideModal = isOpen ? "modal display-block" : "modal display-none";
    const [percentCompleted, setPercentCompleted] = React.useState(null);
    const [showPercentCompleted, setShowPercentCompleted] = React.useState(false);
    const [uploadError, setUploadError] = React.useState(null);
    const [hasNewFile, setHasNewFile] = React.useState(false);
    console.log("parentId", parentId);
    console.log("props.dataService: ", props.dataService);

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
        setHasNewFile(!!e.target.value)
      };

    function uploadFile() {
      console.log("upload File called");
        const fxFileInput = document.getElementById('fxFileInput');
        console.log("fxFileInput", fxFileInput)
        var file = fxFileInput.files[0];
        if (!file) return Promise.resolve();

        setShowPercentCompleted(true);
      console.log("showpercentcompleted", percentCompleted)//null
        var reader = new FileReader();

        return new Promise(function(resolve, reject){
          console.log("parentId: ", parentId);
          reader.onload = function( e ) {
            var fileData = btoa( e.target.result );
            var contentVersionData = {
                "FirstPublishLocationId": parentId,
                "Title": file.name,
                "PathOnClient": file.name,
                "VersionData": fileData
              };
            const onUploadProgress = function(progressEvent) {
                console.log("progress event: ", progressEvent);
              setPercentCompleted( Math.round( (progressEvent.loaded * 100) / progressEvent.total ));
              console.log(`%c>>>> percentCompleted `, `background-color: yellow;` , percentCompleted, progressEvent );
            };
    console.log("percent Completed: ", percentCompleted); //logging as null
    console.log("props=file ", file);
            //cannot read property 'dataService' of undefined
            console.log("this.props,  ", this.props);
            console.log("this.state ", this.state);

            return props.dataService.uploadFile( connection, parentId, contentVersionData, onUploadProgress )
              .then(resolve, reject);
          };

          reader.readAsBinaryString( file );
        })
        .then(saveAndClose)
        .then(function() {
            console.log("past saveandClose");
        }
        )
        .catch(function(err) {
          setUploadError(err);
          console.log(`%c>>>> ERROR `, `background-color: yellow; color:green;` , err );
        })
      }

    return (
    <div
        className={showHideModal} isopen={isOpen}>
        <section className="modal-main">
        <input id='fxFileInput' type="file" className="form-control" onChange={handleFileChange}/>
            {children}
            {showPercentCompleted && <ProgressBar value={percentCompleted} progress color='primary' error={uploadError} />}

            <button onClick={uploadFile}>Upload</button>
            <button onClick={handleClose}>Cancel</button>
        </section>
    </div>
    )
}

export default AddFileDialog;