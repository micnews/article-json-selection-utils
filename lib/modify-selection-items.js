import {mergeDeep} from 'immutable-object-methods';
import {set} from 'immutable-array-methods';
import iterateSelectionItems from './iterate-selection-items';

export default (articleJson, fn) => {
  let result = articleJson;

  iterateSelectionItems(articleJson, (item, index) => {
    const changes = fn(item);
    const newItem = mergeDeep(item, changes);
    result = set(result, index, newItem);
  });

  return result;
};