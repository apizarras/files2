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
    name: 'instanceUrl',
    label: 'instanceUrl',
    type: 'string',
    defaultValue: 'https://na73.salesforce.com'
  }
];

export const CONTENTDOCUMENTLINK_FIELDS = [
  "LinkedEntityId",
  "LinkedEntity.Type",
  "ContentDocument.Id",
  "ContentDocument.LatestPublishedVersion.Id",
  "ContentDocument.LatestPublishedVersion.Title",
  "ContentDocument.LatestPublishedVersion.PathOnClient",
  "ContentDocument.LatestPublishedVersion.ContentSize",
  "ContentDocument.LatestPublishedVersion.CreatedBy.Name",
  "ContentDocument.LatestPublishedVersion.CreatedDate",
  "ContentDocument.LatestPublishedVersion.LastModifiedDate",
  "ContentDocument.LatestPublishedVersion.LastModifiedBy.Name",
  "ContentDocument.LatestPublishedVersion.FX5__Sync__c",
]