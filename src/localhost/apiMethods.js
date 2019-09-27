import { CONTENTDOCUMENTLINK_FIELDS } from '../constants';
import axios from 'axios';

const createDataService = connection => {
  console.log("connection: ", connection);
  let acls = {};
  const descriptions = {};
  const hasPermission = (permission) => {
    return acls[permission]
  };

return {
  describe: sobject => connection.describe(sobject),
  describeFields: sobject =>
    connection.describe(sobject).then(description =>
      description.fields.reduce((fields, field) => {
        fields[field.name] = field;
        return fields;
      }, {})
    ),
  describeChildRelationships: sobject =>
    connection.describe(sobject).then(description => description.childRelationships),
  describePicklist: (sobject, fieldName) =>
    connection.describe(sobject).then(description => {
      return description.fields.find(f => f.name === fieldName).picklistValues;
    }),
  query: soql => connection.query(soql).then(r => r.records),
  queryCount: soql => connection.query(soql).then(r => r.totalSize),
  getUser: () => {
    const r = connection.identity;
    return Promise.resolve({
      ...r,
      id: r.user_id,
      orgId: r.organization_id,
      userType: r.user_type,
      isMultiCurrency: true,
      defaultCurrency: 'USD'
    });
  },
  deleteItems: (sobjectType, ids) => {
    return connection
      .sobject(sobjectType)
      .destroy(ids, { allOrNone: false })
      .then(results => {
        const values = ids.map((id, index) => {
          return {
            id,
            success: results[index].success,
            message: results[index].errors.map(e => e.message).join(' ')
          };
        });
        return {
          deletedRecords: values.filter(r => r.success).map(r => r.id),
          errors: values.filter(r => !r.success)
        };
      });
  },
  //need to move fetchFiles method?
  fetchFiles: (connection, sobjectId, embedded) => {
    let sortOpts = ['ContentDocument.LatestPublishedVersion.SystemModStamp DESC', 'SystemModStamp DESC'];
    console.log("contentDocument fields", CONTENTDOCUMENTLINK_FIELDS);
    if (embedded) {
      // sort by FX5__Sync__c first, so synced files show first in compact view
      sortOpts.splice(0,0,'ContentDocument.LatestPublishedVersion.FX5__Sync__c DESC');
    }
    return connection
      .sobject('ContentDocumentLink')
      .select(CONTENTDOCUMENTLINK_FIELDS.join(', '))
      .where(`LinkedEntityId = '${sobjectId}'`)
      .sort(sortOpts.join(','))
      .execute()
      .then(result => {
        console.log('fetchFiles:', result);
        return result;
      });
  },
  describeGlobal: () => {
    return connection
    .describeGlobal()
    .then(({ sobjects }) => {
      sobjects.reduce((descriptions, sobject) => {
        descriptions[sobject.keyPrefix] = sobject;
        return descriptions;
      }, {});
      console.log("sobject: ", sobjects)
      return sobjects
    });
  },
  fetchDescription: (sobject, descriptions) => {
      console.log("descriptions", descriptions);

      if (descriptions[sobject]) return Promise.resolve(descriptions[sobject]);
      descriptions[sobject] = null;

      return connection
        .sobject(sobject)
        .describe()
        .then(result => {
          result.fieldMap = result.fields.reduce(function(map, field) {
            map[field.name] = field;
            return map;
          }, {});

          var objKey = sobject.toLowerCase();
          var aliasKey = objKey.replace(/__c$/,'').replace(/^\w*__/,'').replace(/_/g,'');

          var obj = result;
          if(objKey !== aliasKey){
            acls[aliasKey + '_read'] = !!obj;
            acls[aliasKey + '_create'] = (obj && obj.createable) || false;
            acls[aliasKey + '_update'] = (obj && obj.updateable) || false;
            acls[aliasKey + '_delete'] = (obj && obj.deletable) || false;
          }

          acls[objKey + '_read'] = !!obj;
          acls[objKey + '_create'] = (obj && obj.createable) || false;
          acls[objKey + '_update'] = (obj && obj.updateable) || false;
          acls[objKey + '_delete'] = (obj && obj.deletable) || false;

          return (descriptions[sobject] = result);
        })
        .catch(error => {
          console.log(`%c>>>>  Error fetching description: `, `background-color: red; color:yellow;`, sobject, error);
          return null;
        });

    },
  getObjectInfo: (connection, sobject, id) => {
      console.log("sobject, id ", sobject, id);
      return connection
        .sobject(sobject)
        .select('Name, FX5__Tracking_Number__c')
        .where(`Id = '0691I00000A7EpXQAV`)
        .execute({ autoFetch: true })
        .then(records => {
          const rec = records[0];
          return rec.FX5__Tracking_Number__c;
        });
    },
  uploadFile: (connection, parentId, contentVersionData, onUploadProgress) => {
    console.log("apiMethods uploadFile");
      if(!contentVersionData) return Promise.reject();

      var requestConfig = {
            headers: {
              ContentType: 'application/json',
              Accept: 'application/json',
              'Authorization': `Bearer ${connection.accessToken}`
            },
            onUploadProgress: onUploadProgress || function noOp() {}
          };
console.log("requestConfig: ", requestConfig);
      const apiVersion = "v42.0";
      const appVersion = "DEV";
console.log("instance url: ", connection.instanceUrl);
console.log("app version: ", appVersion);
      return new Promise(function(resolve, reject) {

        return axios.post(`${appVersion === 'DEV' ? connection.instanceUrl : ''}/services/data/${apiVersion}/sobjects/ContentVersion/`, contentVersionData, requestConfig)
          .then(function(){
            console.log(`>>>> File uploaded successfully : `, contentVersionData.Title);
          })
          .catch(function(err) {
            // Unauthorized has no shape, it's just the string, "Unauthorized"
            // if (err.response && err.response.status === 401) throw err.response;
            // var error = (err.response && err.response.data && err.response.data[0] && (err.response.data[0].errorCode + ': ' + err.response.data[0].message)) || err;
            var error = (err.response && err.response.data && err.response.data[0]) || err;
            reject(error);
          })
          .then(resolve,reject);
      });
    }
};


};

let lightningEventsCallback;
let updateCellCallback;

const events = {
  handleSelectedRows: rowIds => {
    console.log({ rowIds });
  },
  handleOpenRtf: (mode, rowId, apiName, label, rtfCallback) => {
    console.log('handle open RTP:', mode, rowId, apiName, label, rtfCallback);
    const data = {
      source: 'from_rtf',
      itemId: rowId,
      field: apiName,
      value: '<p>Value changed</p>',
      callback: rtfCallback
    };
    updateCellCallback(data);
  },
  initializeLightningEvents: callbackRef => {
    lightningEventsCallback = callbackRef;
  },
  initializeUpdateCell: callbackRef => {
    updateCellCallback = callbackRef;
  }
};

export { lightningEventsCallback, updateCellCallback, createDataService, events };
