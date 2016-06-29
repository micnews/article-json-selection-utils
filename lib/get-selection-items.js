import mapSelectionItems from './map-selection-items';

export default articleJson => {
  const result = [];
  mapSelectionItems(articleJson, item => result.push(item));
  return result;
};
