const fs = require('fs');

const { metadata, findByPath } = require('../example_metadata.js');
const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('../metadataApi.js');

const personDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
fs.writeFileSync('./test/getDatasetMetadata.result.json', JSON.stringify(personDataset, null, 2));

const personData = getDatasetData(personDataset, 'en-us', false);
fs.writeFileSync('./test/getDatasetData.result.json', JSON.stringify(personData, null, 2));


const metadataView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
fs.writeFileSync('./test/getViewMetadata.result.json', JSON.stringify(metadataView, null, 2));

const elements = getElementMetadata(metadataView, null, '1049');
fs.writeFileSync('./test/getElementMetadata.result.json', JSON.stringify(elements, null, 2));

const metaPath = 'telecom[0].value';
dataField = getFieldMetadata(personDataset, metaPath);
fs.writeFileSync('./test/getFieldMetadata.result.json', JSON.stringify(dataField, null, 2));
