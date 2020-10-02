const { metadata, findByPath } = require('./example_metadata.js');
//const { metadata_apdax } = require('./metadata_apdax.js');

const defaultLocale = { "Locale Name": "English - United States", "Locale id": "en-us", "Locale Code": "1033", "Language Code": "en" };
const defaultLocaleId = 'en-us';
const defaultLocaleCode = '1033';

function changeLang(newLocale, newLocaleId, newLocaleMap) {
  window.localStorage.localeCode = newLocale;
  window.localStorage.localeMap = newLocaleMap ? datasetToObjectArray(newLocaleMap) : null;
  window.localStorage.localeId = newLocaleId;
  window.localStorage.localeCollator = new Intl.Collator(newLocale, { sensitivity: 'base', numeric: true });
}

/**
 * Find locale id by locale code. Use enumerator of locales from organization.
 * @param {string} localeCode - code of locale w need id for
 * @returns {string} locale code.
 */
function localeIdByCode (localeCode) {
  const locales = window.localStorage.localeMap;
    if (!locales) return null;
  let ret = locales.find(cur => cur["Locale Code"] === localeCode);
  return ret["Locale Id"];
}

/**
 * Non case sensitive string compare
 * @param {String} str1
 * @param {String} str2
 */
function strCompare (str1, str2) {
  if (!str1 && !str2) {
    // This is two empty strings case, we consider it equal
    return true;
  } else if (!str1 || !str2) {
    // We are compare null with string
    return false;
  } else if ( !(typeof str1 === 'string') || !(typeof str2 === 'string')) {
    // One of compares not string
    console.warn("nonCSCompare one of arguments is not a string", str1, str2);
    return false;
  } else {
    // Let's compare strings
    return window.localStorage.localeCollator ? window.localStorage.localeCollator.compare(str1, str2) : str1.toLowerCase() === str2.toLowerCase();
  }
}

/**
 * Non case sensitive string compare
 * @param {String} str1
 * @param {String} str2
 */
function nonCSCompare (str1, str2) {
  if (!str1 && !str2) {
    // This is two empty strings case, we consider it equal
    return true;
  } else if ( (str1 && !(typeof str1 === 'string')) || (str2  && !(typeof str2 === 'string'))) {
    // We compare null or different types
    console.warn("nonCSCompare one of arguments is falsy", str1, str2);
    return false;
  } else if (!str1 || !str2) {
    // We are compare null with string
    return false;
  } else {
    // Let's compare strings
    return str1.toLowerCase() === str2.toLowerCase();
  }
}

/**
 * Get value from object by path
 * @param object - this is actual object to navigate
 * @param path - this is path in format a.b.c[0].d
 * @returns - object found in the location.
 */
function deepGet (object, path) {
  try {
    const elements = path.charAt(0) === '/' ? path.substring(1).replace(/\[/g,"/").replace(/\]/g,'').split('/')
                                            : path.replace(/\[/g,".").replace(/\]/g,'').split('.');
    
    return elements.reduce(function (obj, property) {return obj[property];}, object);
  } catch (err) {
    return undefined;
  }   
}

/**
 * Set value into object by path
 * @param o - this is actual object to navigate
 * @param path - this is path in format a.b.c[0].d
 * @param value - this is value to set
 * @returns - object new state.
 */
function deepSet (object, path, value) {
  try {
    const elements = path.charAt(0) === '/' ? path.substring(1).replace(/\[/g,"/[").replace(/\]/g,'').split('/')
                                            : path.replace(/\[/g,".[").replace(/\]/g,'').split('.');

    let prev_obj = object;
    let prev_name = undefined;

    for (var element of elements) {
      let isArray = element.charAt(0) === '[';
      let name = isArray ? element.substring(1) : element; 

      if (prev_name !== undefined) {
        // Parent object undefined.
        if (prev_obj[prev_name] === undefined || prev_obj[prev_name] === null) {
          prev_obj[prev_name] = isArray ? [] : {};
        }
        prev_obj = prev_obj[prev_name];
      } 
      prev_name = name; 
    }

    if (prev_name === undefined) {
      // Current object can change value 
      prev_obj = value;
    } else {
      // Previous object can change value 
      prev_obj[prev_name] = value;
    }    
    return object;
  } catch (err) {
    return undefined;
  }
}

/**
 * Copy object by all levels of the object
 * @param o - this is actual object to copy
 * @returns - complete copy of the object.
 */
function deepCopy(o, nonEmpty = false) {
  var copy = o, k;
  if (o && typeof o === 'object') {
    copy = Object.prototype.toString.call(o) === '[object Array]' ? [] : {};
    for (k in o) {
      if( !nonEmpty || ( o[k] !== null && Object.keys(o[k]).length !== 0 ) ) {
        copy[k] = deepCopy(o[k], nonEmpty);
      }
    }
  }
  return copy;
}

/**
 * Merge object properties into existing object.
 * @param b - object to merge data into
 * @param o - object to copy data from
 * @returns - complete merge of base object with source object.
 */
function deepMerge(b, o) {
  var copy = {}, k;
  
  // Merge of two arrays complex. For now we add one to another
  if ((b && Object.prototype.toString.call(b) === '[object Array]') ||
      (o && Object.prototype.toString.call(o) === '[object Array]' )) {
    return (b ? b : []).concat(o ? o : []);
  }

  if (b !== 'undefined' && b !== null ) { 
    if (typeof b === 'object') {
      for (k in b) {
        if (o && (o[k] !== undefined && o[k] !== null)) {
          // We have this property in source.
          if (typeof o[k] === 'object') {
            copy[k] = deepMerge(b[k], o[k]);
          } else {
            copy[k] = (o[k]) ? o[k] : deepCopy(b[k]);
          }
        } else {
          copy[k] = deepCopy(b[k]);
        }
      }
    } else {
      if (o) {
        copy = deepCopy(o);
      } else {
        copy = b;
      }
    }
  }

  if (o) { 
    if (typeof o === 'object') {
      for (k in o) {
        if (b && (b[k] !== undefined && b[k] !== null)) {
          // This case must be already processed in b branch.
        } else {
          copy[k] = deepCopy(o[k]);
        }
      }
    } else {
      if (b !== undefined && b !== null) {
        // This case must be already processed in b branch.
      } else {
        copy = o;
      }
    }
  }
  return copy;
}

function datasetToObjectArray (ds) {

  let sorted = ds.data.records.slice();
  sorted.sort((a,b)=>a.index > b.index ? 1 : (a.index < b.index ? -1 : 0));

  //console.log("datasetToObjectArray s", sorted);

  let ret = sorted.map( row => {

    let obj = {};

//    console.log("datasetToObjectArray r", row);

    ds.structure.fields.map((field, index) => {
      obj[field.identity.name] = row.values[index];
    });

    return obj;

  });
  //console.log("datasetToObjectArray", ds, ret);

  return ret;

};


/**
 * Return Dataset metadata by path of the dataset
 * @param {string} path to the object
 * @returns {object} object metadata, or null
 */
const getDatasetMetadata = (path) => {
  try 
  {
    if (!path) return null;
    const dspath = path.replace(/:/g,"%");

    let ds = findByPath(dspath);
    if (!ds || ds.object.type.toLowerCase() !== 'dataset') return null;

    return ds;
  }
  catch (e) {
    console.warn("Error in getDatasetMetadata: " + path);
  }
  return null;
};

/**
 * Return veiw metadata by path of the view
 * @param {string} path to the object
 * @returns {object} object metadata, or null
 */
function getViewMetadata (path) {
  try 
  {
    if (!path) return null;
    const vipath = path.replace(/:/g,"%");

    let view = findByPath(vipath);
    if (!view || view.object.type.toLowerCase() !== 'view') return null;

    return view;
  }
  catch (e) {
    console.warn("Error in getViewMetadata: " + path);
  }
  return null;
};

/**
 * Return field of the dataset
 * @param {object} dataset - metadata for dataset
 * @param {string} path - this is path in format a.b.c[0].d or /a/b/c[0]/d
 * @returns {object} object - metadata for field of the dataset or null 
 */
function getFieldMetadata (dataset, path) {
  try 
  {
    if (!dataset || !path || dataset.object.type.toLowerCase() !== 'dataset') return null;

    const elements = path.charAt(0) === '/' ? path.substring(1).replace(/\[.*?\]/g,"").split('/')
                                            : path.replace(/\[.*?\]/g,"").split('.');

    let ds = dataset;

    // Iterate path and find field we looking for.
    for (var i = 0; i < elements.length; i++) {
      let field = ds.structure.fields.find(f => nonCSCompare(f.identity.name, elements[i]));
      if (i + 1 === elements.length ) {
        return field;
      } else if (!field || field.type.toLowerCase() !== 'structure') {
        return null;
      } else {
        ds = getDatasetMetadata(field.reference);
        if (!ds) return null
      }
    }
  }
  catch (e) {
    console.warn("Error in getFieldMetadata: " + path, dataset);
  }
  return null;
};

/**
 * Return specified element of the view or all elements of the view for specific locale. 
 * @param {object} view - metadata for view
 * @param {string} element - name of the element
 * @param {string} locale - locale id in which return element data. When not specified use view default.
 * @returns {object} object - metadata for element of the view
 */
function getElementMetadata (view, element, locale) {
  try 
  {
    if (!view || view.object.type.toLowerCase() !== 'view') return null;

    // Let's find definision for view local.
    let base_definision = null;
    let data_definision = null;

    // Find base definision.
    if (view.local) {
      // We have locale defined in view we expect we have
      // base defenision match defined local. 
      base_definision = view.definitions.find(def => (def.locale === view.local));
    } else {
      // We on default locale of the system and will look base on code and id  
      base_definision = view.definitions.find(def => (def.locale === defaultLocaleId || def.locale === defaultLocaleCode));
    }

    // Find definision of current locale.
    if (locale) {
      if (base_definision.locale !== locale) {
        // We on default locale of the system and will look base on code and id  
        data_definision = view.definitions.find(def => (def.locale === locale));

        // Can be competability problem
        if (!data_definision) {
          let localeId = localeIdByCode(locale); 
          if (localeId && base_definision.locale !== localeId) {
            // We on default locale of the system and will look base on code and id  
            data_definision = view.definitions.find(def => (def.locale === localeId));
          }
        }
      }
    } else if (window.localStorage.localeId || window.localStorage.localeCode) {
      // We use current locale if it not same as base. 
      if (base_definision.locale !== window.localStorage.localeId && base_definision.locale !== window.localStorage.localeCode ) {
        // We on default locale of the system and will look base on code and id  
        data_definision = view.definitions.find(def => (def.locale === window.localStorage.localeId || def.locale === window.localStorage.localeCode));
      }
    } else {
      // We use system locale as our data locale if it not same as base
      if (base_definision.locale !== defaultLocaleId || base_definision.locale !== defaultLocaleCode) {
        // We on default locale of the system and will look base on code and id  
        data_definision = view.definitions.find(def => (def.locale === defaultLocaleId || def.locale === defaultLocaleCode));
      }
    }

    // We don't find or we have it same.
    if (!data_definision || data_definision.locale === base_definision.locale) {
      data_definision = base_definision;
      base_definision = null;
    }

    // When specific element requested
    if (element) {  
      // Element by name from base and locale definision. 
      let data_element = (!data_definision) ? null : data_definision.elements.find(elem => nonCSCompare(elem.identity.name, element));
      let base_element = (!base_definision) ? null : base_definision.elements.find(elem => nonCSCompare(elem.identity.name, element));

      if (!data_element && !base_definision) {
        // We don't find element with provided name.
        return null;
      } else if (data_element && !base_element) {
        // We have element only for requested locale.
        return data_element;
      } else if (!data_element && base_element) {
        // We have element only for view default locale.
        return base_element;
      } else {
        // We have both elements and need to merge it.
        return deepMerge(base_element, data_element);
      }
    } else {
      if (!data_definision && !base_definision) {
        // We don't find definisions for locale we have.
        return [];
      } else if (data_definision && !base_definision) {
        // We have elements only for requested locale.
        return data_definision;
      } else if (!data_definision && base_definision) {
        // We have elements only for view default locale.
        return base_definision;
      } else {
        // We have both elements and need to merge it.
        let base_elements = base_definision.elements.map(base_element => {
          let data_element = data_definision.elements.find(elem => nonCSCompare(elem.identity.name, base_element.identity.name));
          return data_element ? deepMerge(base_element, data_element) : base_element;
        });

        // Lets merge with elements, which exist only for requested locale.
        let data_elements = data_definision.elements.filter(data_element => {
          let base_element = base_definision.elements.find(elem => nonCSCompare(elem.identity.name, data_element.identity.name));
          return !base_element;
        });

        return base_elements.concat(data_elements);
      }
    }
  }
  catch (e) {
    console.warn("Error in getElementMetadata: " + element + 'for locale:' + locale, view, e);
  }
  return null;
};

/**
 * Return label from element of the view
 * @param {object} element - metadata for element
 * @returns {string} label text
 */
function getElementLabel (element) {
  return !element || !element.text ? '' : element.text;
};

/**
 * Return property from element of the view
 * @param {object} element - metadata for element
 * @param {string} name of the property
 * @returns {string} property value
 */
function getElementProperty (element, name) {
  if (!element || !element.properties)
    return '';

  let property = element.properties.find(prop => nonCSCompare(prop.identity.name, name));
  if (!property) 
    return '';

  return property.value; 
};

/**
 * Return value from control of element
 * @param {object} element - metadata for element
 * @param {string} path - dot delimeted or slash delimeted path to value in element control
 * @returns {string} value from element control.
 */
function getElementValue (element, path) {
  if (!element || !element.control || !element.control.value)
    return null;

  let value = deepGet(element.control.value, path);
  if (!value)
    return null;

  return value;
};

/**
 * Return array of data records from dataset with data
 * @param {object} dataset - metadata for dataset
 * @param {string} locale - locale in which to return record when translations exist in records. When not specified use one from local store.
 * @param {string} usage - return value by unique usage without translations
 * @returns {array} array of records
 */
function getDatasetData (dataset, locale, usage) {
  if (!dataset) return [];
  if (!locale) {
    locale = typeof(window) !== "undefined" && window.localStorage && window.localStorage.locale ? window.localStorage.locale : defaultLocale;  
  }

  let sorted = dataset.data.records.slice();
  sorted.sort((a, b) => a.index > b.index ? 1 : (a.index < b.index ? -1 : 0));

  let ret = sorted.map(row => {
    let obj = {};
    if (locale) { 
      let indexTranslations = dataset.structure.fields.findIndex((field) => nonCSCompare(field.identity.name, 'translations') || nonCSCompare(field.usage, 'translations')); 
      let translation = (indexTranslations < 0 || !row.values[indexTranslations]) ? null : JSON.parse(row.values[indexTranslations]).find((tr) => nonCSCompare(locale, tr.Locale)); 
      dataset.structure.fields.map((field, index) => {
        if (index != indexTranslations) {
          if (usage) {
            if (!obj[field.identity.name] && !nonCSCompare(field.usage, 'translations')) obj[field.usage] = translation && translation[field.usage] ? translation[field.usage] : row.values[index];
          } else {
            obj[field.identity.name] = translation && translation[field.usage] ? translation[field.usage] : row.values[index];
          }
        }
      });
    } else {
      dataset.structure.fields.map((field, index) => {
        if (usage) {
          if (!obj[field.identity.name] && !nonCSCompare(field.usage, 'translations')) obj[field.usage] = row.values[index];
        } else {
          obj[field.identity.name] = row.values[index];
        }
      });
    }
    return obj;
  });
  return ret;
};

/**
 * Return array of options for enumerator
 * @param {object} field - field we are looking for options from
 * @param {string} locale - locale in which to return options if translation exist.
 * @returns {array} array of enumerator options
 */
function getEnumOptions (field, locale) {
  if (!field || !nonCSCompare(field.type,'Enum') || !field.reference)  return [];

  const dataset = getDatasetMetadata(field.reference);
  if (!dataset) return [];
    
  return getDatasetData(dataset, locale, true);
}


module.exports = {
  defaultLocale,
  defaultLocaleId,
  defaultLocaleCode,

  getEnumOptions,
  deepMerge,
  getDatasetMetadata,
  getDatasetData,
  getViewMetadata,
  getElementMetadata,
  deepCopy,
  changeLang,
  localeIdByCode,
  strCompare,
  nonCSCompare,
  deepGet,
  deepSet,
  datasetToObjectArray,
  getElementProperty,
  getFieldMetadata,
  getElementLabel,
  getElementValue
};
