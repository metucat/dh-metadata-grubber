const fs = require('fs');
const path = require('path');

const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, changeLang, getElementLabel, getFieldMetadata, getEnumOptions, findByPath } = require('../lib/metadata');

const personDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
fs.writeFileSync(path.resolve(__dirname, 'getDatasetMetadata.result.json'), JSON.stringify(personDataset, null, 2));

const personData = getDatasetData(personDataset, 'en-us', false);
fs.writeFileSync(path.resolve(__dirname, 'getDatasetData.result.json'), JSON.stringify(personData, null, 2));

const metadataView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
fs.writeFileSync(path.resolve(__dirname, 'getViewMetadata.result.json'), JSON.stringify(metadataView, null, 2));

const elementsRU = getElementMetadata(metadataView, null, '1049');
fs.writeFileSync(path.resolve(__dirname, 'getElementMetadata.result.json'), JSON.stringify(elementsRU, null, 2));

const elementsUS = getElementMetadata(metadataView, null, '1033');
fs.writeFileSync(path.resolve(__dirname, 'getElementMetadataUS.result.json'), JSON.stringify(elementsUS, null, 2));

const elementsTR = getElementMetadata(metadataView, null, '1055');
fs.writeFileSync(path.resolve(__dirname, 'getElementMetadataTR.result.json'), JSON.stringify(elementsTR, null, 2));

const metaPath = 'telecom[0].value';
const dataField = getFieldMetadata(personDataset, metaPath);
fs.writeFileSync(path.resolve(__dirname, 'getFieldMetadata.result.json'), JSON.stringify(dataField, null, 2));

const PatientContact = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'mock/PatientContact.json')));
const relationshipField = getFieldMetadata(PatientContact, 'relationship');
fs.writeFileSync(path.resolve(__dirname, 'getFieldMetadataSpace.result.json'), JSON.stringify(relationshipField, null, 2));
