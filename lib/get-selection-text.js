import mapSelectionText from './map-selection-text';

export default articleJson => {
  const result = [];
  mapSelectionText(articleJson, text => result.push(text));
  return result;
};
