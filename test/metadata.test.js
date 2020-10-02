const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('../metadataApi.js');
const fs = require('fs');

test('test getDatasetMetadata', () => {
  const accessDataset = getDatasetMetadata('/organizations/Apdax/systems/Difhub/applications/System/datasets/Access');
  expect(accessDataset).toStrictEqual(JSON.parse(fs.readFileSync(`./test/getDatasetMetadata.result.json`)));
});

test('test getDatasetMetadata', () => {
  const accessDataset = getDatasetMetadata('/organizations/Apdax/systems/Difhub/applications/System/datasets/Access');
  const accessData = getDatasetData(accessDataset, 'en-us', false);
  expect(accessData).toStrictEqual(JSON.parse(fs.readFileSync(`./test/getDatasetData.result.json`)));
});

