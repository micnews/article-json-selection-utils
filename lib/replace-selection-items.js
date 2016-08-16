import {splice} from 'immutable-array-methods';
import getSelectionItems from './get-selection-items';

export default (articleJson, fn) => {
  const items = getSelectionItems(articleJson);

  if (!items.length) {
    return articleJson;
  }

  const selectionStartIndex = articleJson.indexOf(items[0]);
  const deleteCount = items.length;
  return splice(articleJson, selectionStartIndex, deleteCount, fn(items));
};
