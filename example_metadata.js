const fs = require('fs');
const path = require('path');
const rawdata = fs.readFileSync(path.resolve(__dirname, 'example_metadata.json'));
const metadata = JSON.parse(rawdata);

function findByPath(path) {
  if (!path)
    return null;
  
  // remove versions from path
  const clearedPath = path.replace(/\/versions\/\d\.\d\.\d/g, '').replace(/:/g, "%");
  
  const splitPath = clearedPath.split('/').map(el => el.toLowerCase());
  let res;
  
  while (splitPath.length) {
    const step = splitPath.shift();
    
    if (!res)
      res = metadata[step];
    else
      res = res[step];
  }
  
  return res;
}

module.exports = {metadata: metadata, findByPath: findByPath};
