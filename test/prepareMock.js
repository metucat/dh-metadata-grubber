const fs = require('fs');

const { metadata, findByPath } = require('../example_metadata.js');
const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('../metadataApi.js');

const accessDataset = getDatasetMetadata('/organizations/Apdax/systems/Difhub/applications/System/datasets/Access');
fs.writeFileSync('./test/getDatasetMetadata.result.json', JSON.stringify(accessDataset, null, 2));

const accessData = getDatasetData(accessDataset, 'en-us', false);
fs.writeFileSync('./test/getDatasetData.result.json', JSON.stringify(accessData, null, 2));

const applicationView = getViewMetadata('/Apdax/systems/Difhub/applications/Interface/views/Application color');
fs.writeFileSync('./test/getViewMetadata.result.json', JSON.stringify(applicationView, null, 2));
