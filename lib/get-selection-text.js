import iterateSelectionText from './iterate-selection-text';

export default articleJson => {
  const result = [];
  iterateSelectionText(articleJson, text => result.push(text));
  return result;
};
