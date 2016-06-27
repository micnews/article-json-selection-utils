import {map} from 'immutable-array-methods';
import {set} from 'immutable-object-methods';

export default (articleJson, fn) => {
  let inSelection = false;

  return map(articleJson, (item) => {
    if (!item || !item.children) {
      return item;
    }

    return set(item, 'children', map(item.children, child => {
      if (child.mark && child.markClass === 'selection-start') {
        inSelection = true;
      }
      if (child.mark && child.markClass === 'selection-end') {
        inSelection = false;
      }

      let result = child;

      if (inSelection && child.content) {
        result = fn(child);
      }

      return result;
    }));
  });
};
