import iterateSelectionItems from './iterate-selection-items';

export default articleJson => {
  const result = [];
  iterateSelectionItems(articleJson, item => result.push(item));
  return result;
};
