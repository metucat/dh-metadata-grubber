const fs = require('fs');
const path = require('path');

const { getDatasetData, deepGet, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('../metadataApi.js');

test('test getDatasetMetadata', () => {
  const accessDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
  expect(accessDataset).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, "getDatasetMetadata.result.json"))));
});

test('test getDatasetData', () => {
  const accessDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
  const accessData = getDatasetData(accessDataset, 'en-us', false)
  expect(accessData).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getDatasetData.result.json'))));
});

test('test getViewMetadata', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  expect(applicationView).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getViewMetadata.result.json'))));
});


test('test applicationView', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const color = getElementMetadata(applicationView, null, '1049');
  expect(color).toStrictEqual(JSON.parse(fs.readFileSync(path.resolve(__dirname, 'getElementMetadata.result.json'))));
});


test('test getElementLabel', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const elements = getElementMetadata(applicationView, null, '1049');
  metadataForm = elements.find((element) => element.control && element.control.reference && element.control.reference.startsWith('/organizations/Infort Technologies/systems/infrastructure/applications/Control/datasets/FormEditor'));
  const cardCaption = getElementLabel(metadataForm);
  expect(cardCaption).toBe('Контактная Информация');
});

test('test deepGet', () => {
  const dataObject = JSON.parse(fs.readFileSync(path.resolve(__dirname, '_dataObject.json')));
  const dataPath = 'telecom[0].value';
  const dataValue = deepGet(dataObject, dataPath);
  expect(dataValue).toBe('34534');
});

