import {map} from 'immutable-array-methods';
import {set} from 'immutable-object-methods';

export default (articleJson, fn) => {
  let inSelection = false;

  const mapSelected = (child) => {
    if (child.mark && child.markClass === 'selection-end') {
      inSelection = false;
    }

    if (child.children) {
      child = set(child, 'children', map(child.children, mapSelected));
    }

    const result = inSelection && child.type === 'text' ? fn(child) : child;

    if (child.mark && child.markClass === 'selection-start') {
      inSelection = true;
    }

    return result;
  };

  return map(articleJson, (item) => {
    if (!item || !item.children) {
      return item;
    }

    return set(item, 'children', map(item.children, mapSelected));
  });
};
