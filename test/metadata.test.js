const { getDatasetData, getDatasetMetadata, getViewMetadata, getElementMetadata, getElementLabel, getFieldMetadata, getEnumOptions } = require('../metadataApi.js');
const fs = require('fs');

test('test getDatasetMetadata', () => {
  const accessDataset = getDatasetMetadata('/organizations/Apdax/systems/Difhub/applications/System/datasets/Access');
  expect(accessDataset).toStrictEqual(JSON.parse(fs.readFileSync(`./test/getDatasetMetadata.result.json`)));
});
