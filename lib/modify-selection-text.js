import {mergeDeep, setIn} from 'immutable-object-methods';
import iterateSelectionText from './iterate-selection-text';

export default (articleJson, fn) => {
  let result = articleJson;

  iterateSelectionText(articleJson, (item, index, itemIndex) => {
    const changes = fn(item);
    const newItem = mergeDeep(item, changes);
    result = setIn(result, [itemIndex, 'children', index], newItem);
  });

  return result;
};
