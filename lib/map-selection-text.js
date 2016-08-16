import {map} from 'immutable-array-methods';
import {set} from 'immutable-object-methods';

export default (articleJson, fn) => {
  let inSelection = false;

  const mapSelected = (child) => {
    if (child.mark && child.markClass === 'selection-start') {
      inSelection = true;
    }
    if (child.mark && child.markClass === 'selection-end') {
      inSelection = false;
    }

    if (child.children) {
      child = set(child, 'children', map(child.children, mapSelected));
    }

    return inSelection && child.content ? fn(child) : child;
  };

  return map(articleJson, (item) => {
    if (!item || !item.children) {
      return item;
    }

    return set(item, 'children', map(item.children, mapSelected));
  });
};
