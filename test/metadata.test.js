const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('../metadataApi.js');
const fs = require('fs');

test('test getDatasetMetadata', () => {
  const accessDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
  expect(accessDataset).toStrictEqual(JSON.parse(fs.readFileSync(`./test/getDatasetMetadata.result.json`)));
});

test('test getDatasetData', () => {
  const accessDataset = getDatasetMetadata('/organizations/Infort Technologies/systems/Client/applications/User/datasets/Person');
  const accessData = getDatasetData(accessDataset, 'en-us', false)
  expect(accessData).toStrictEqual(JSON.parse(fs.readFileSync(`./test/getDatasetData.result.json`)));
});

test('test getViewMetadata', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  expect(applicationView).toStrictEqual(JSON.parse(fs.readFileSync(`./test/getViewMetadata.result.json`)));
});


test('test applicationView', () => {
  const applicationView = getViewMetadata('/organizations/Infort Technologies/systems/Client/applications/User/views/ContactInfoCard');
  const color = getElementMetadata(applicationView, null, '1049');
  expect(color).toStrictEqual(JSON.parse(fs.readFileSync(`./test/getElementMetadata.result.json`)));
});
