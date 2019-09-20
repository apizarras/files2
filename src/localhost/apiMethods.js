const createDataService = connection => ({
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
  updateItems: (sobjectType, changes) => {
    return connection
      .sobject(sobjectType)
      .update(changes, { allOrNone: false })
      .then(results => {
        return {
          updatedRecords: results.map(r => r.id),
          errors: results
            .filter(r => !r.success)
            .map(r => {
              return { id: r.id, message: r.errors.map(e => e.message).join(' ') };
            })
        };
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
  restApi: connection.getJSON,
  apexRest: (method, payload) => {
    const { accessToken } = connection;
    const encoded = `method=${method}&payload=${payload}`.replace(/\s/g, '+');
    // const namespace = window.location.hostname !== 'localhost' ? '/FXLC' : '';
    const namespace = '/FXLC';
    const url = `${namespace}/restEndpoint?${encoded}`;
    const options = { headers: { Authorization: `Bearer ${accessToken}` } };

    return connection.apex.get(url, options);
  }
});

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
