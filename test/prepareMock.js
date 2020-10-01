const fs = require('fs');

const { metadata, findByPath } = require('../example_metadata.js');
const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('../metadataApi.js');

const accessDataset = getDatasetMetadata('/organizations/Apdax/systems/Difhub/applications/System/datasets/Access');
fs.writeFileSync('./test/getDatasetMetadata.result.json', JSON.stringify(accessDataset));
