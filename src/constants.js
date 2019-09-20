// https://developer.salesforce.com/docs/atlas.en-us.lightning.meta/lightning/ref_aura_attribute.htm
export const DESIGN_ATTRIBUTES = [
  {
    name: 'sObjectName',
    label: 'Page Object API Name',
    type: 'string',
    defaultValue: 'FX5__Ticket__c'
  },
  {
    name: 'recordId',
    label: 'Page Record Id',
    type: 'string',
    defaultValue: 'a0p1N00000CHOabQAH'
  },
  {
    name: 'objType',
    label: 'Grid Sobject Type',
    type: 'string',
    defaultValue: 'FX5__Ticket_Item__c'
  },
  {
    name: 'fieldsList',
    label: 'Grid Columns',
    type: 'string',
    defaultValue:
      'Name, RecordTypeId, FX5__Description__c, Geolocation__c, Locked_Custom_Locked_Field__c,Custom_Locked_Field__c, FX5__Price__c, Extended_Amount__c'
  },
  {
    name: 'displayRecordLink',
    label: 'Show link to full record',
    type: 'boolean',
    defaultValue: true
  },
  {
    name: 'readOnly',
    label: 'Display grid in read only mode',
    type: 'boolean',
    defaultValue: false
  },
  {
    name: 'lookupField',
    label: 'Parent Sobject',
    type: 'string',
    defaultValue: 'FX5__Ticket__c'
  },
  {
    name: 'filter',
    label: 'SOQL Filter',
    type: 'string'
  },
  {
    name: 'parentColApiName',
    label: 'Parent Field',
    type: 'string',
    defaultValue: 'FX5__Parent_Ticket_Item__c'
  },
  {
    name: 'parentRequiredColApiName',
    label: 'Parent Required Field',
    type: 'string'
  },
  {
    name: 'itemRequiredColApiName',
    label: 'Item Required Field',
    type: 'string'
  },
  {
    name: 'isArchivedColApiName',
    label: '"Is Archived" Field name',
    type: 'string'
  },
  {
    name: 'uniqueLabelForLocalStorage',
    label: 'Local Storage Key',
    type: 'string',
    defaultValue: 'LocalStorageTest'
  },
  {
    name: 'stickyColumns',
    label: 'Number of Sticky Columns',
    type: 'number',
    defaultValue: 0
  },
  {
    name: 'rowsPerPage',
    label: 'Initial number of rows fetched',
    type: 'number',
    defaultValue: 1000
  }
];
