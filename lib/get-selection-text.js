import mapSelectionText from './map-selection-text';

export default (articleJson, options = {}) => {
  const result = [];
  mapSelectionText(articleJson, options, text => result.push(text));
  return result;
};
