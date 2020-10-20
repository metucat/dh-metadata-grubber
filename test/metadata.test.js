const fs = require('fs');
const path = require('path');

const { getDatasetData, deepGet, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getElementValue, nonCSCompare, getFieldMetadata, getEnumOptions } = require('../lib/metadata');

test('test getDatasetMetadata', () => {
  const personDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
  expect(personDataset).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, "getDatasetMetadata.result.json"))));
});

test('test getDatasetData', () => {
  const personDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
  const personData = getDatasetData(personDataset, 'en-us', false)
  expect(personData).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getDatasetData.result.json'))));
});

test('test getViewMetadata', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  expect(applicationView).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getViewMetadata.result.json'))));
});


test('test getElementMetadata RU', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const color = getElementMetadata(applicationView, null, '1049');
  expect(color).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getElementMetadata.result.json'))));
});

test('test getElementMetadata US', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const color = getElementMetadata(applicationView, null, '1033');
  expect(color).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getElementMetadataUS.result.json'))));
});

test('test getElementMetadata TR returns default locale', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const color = getElementMetadata(applicationView, null, '1055');
  expect(color).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getElementMetadataTR.result.json'))));
});


test('test getElementLabel', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const elements = getElementMetadata(applicationView, null, '1049');
  metadataForm = elements.find((element) => element.control && element.control.reference && element.control.reference.startsWith('/organizations/Infort Technologies/systems/infrastructure/applications/Control/datasets/FormEditor'));
  const cardCaption = getElementLabel(metadataForm);
  expect(cardCaption).toBe('Контактная Информация');
});

test('test getElementValue', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const elements = getElementMetadata(applicationView, null, '1049');
  metadataForm = elements.find((element) => element.control && element.control.reference && element.control.reference.startsWith('/organizations/Infort Technologies/systems/infrastructure/applications/Control/datasets/FormEditor'));
  const cardList = getElementValue(metadataForm, 'formList');
  expect(cardList).toBe('telecom');
});

test('test deepGet', () => {
  const dataObject = JSON.parse(fs.readFileSync(path.resolve(__dirname, '_dataObject.json')));
  const dataPath = 'telecom[0].value';
  const dataValue = deepGet(dataObject, dataPath);
  expect(dataValue).toBe('34534');
});

test('test nonCSCompare', () => {
  const object = JSON.stringify(JSON.parse(fs.readFileSync(path.resolve(__dirname, '_dataObject.json'))));
  const origin = JSON.stringify(JSON.parse(fs.readFileSync(path.resolve(__dirname, '_dataObject.json'))));
  const isEqual = nonCSCompare(origin, object);
  expect(isEqual).toBe(true);
});

test('test getFieldMetadata', () => {
  const metadataDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
  const metaPath = 'telecom[0].value';
  const dataField = getFieldMetadata(metadataDataset, metaPath);
  expect(dataField).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getFieldMetadata.result.json'))));
});

