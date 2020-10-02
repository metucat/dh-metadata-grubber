const { metadata, findByPath } = require('./example_metadata.js');
const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('./metadataApi.js');

const accessDataset = getDatasetMetadata('/organizations/Apdax/systems/Difhub/applications/System/datasets/Access');
const accessData = getDatasetData(accessDataset, 'en-us', false);

console.log("Example of loading dataset data and metadata from metadata.js");

console.log(accessDataset);

console.log(accessData);


const applicationView = getViewMetadata('/Apdax/systems/Difhub/applications/Interface/views/Application color');

console.log("Example of loading view metadata from metadata.js");

console.log(applicationView);

console.log("Example of loading element's description from metadata.js");

const color = getElementMetadata(applicationView, 'Color', 'en-us');

console.log(color.identity.description);
