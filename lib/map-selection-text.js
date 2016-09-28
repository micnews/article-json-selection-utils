import {map} from 'immutable-array-methods';
import {set} from 'immutable-object-methods';

export default (articleJson, options, fn) => {
  if (typeof options === 'function') {
    fn = options;
    options = {};
  }

  const {includeBoundary = false} = options;
  let inSelection = false;

  const mapSelected = (child) => {
    const selectionStart = child.mark && child.markClass === 'selection-start';
    const selectionEnd = child.mark && child.markClass === 'selection-end';

    if (selectionStart) {
      inSelection = true;
    }

    if (selectionEnd) {
      inSelection = false;
    }

    if (child.children) {
      child = set(child, 'children', map(child.children, mapSelected));
    }

    const shouldMap = inSelection && !selectionStart ||
      (includeBoundary && (selectionStart || selectionEnd)) &&
      child.type === 'text';

    return shouldMap ? fn(child) : child;
  };

  return map(articleJson, (item) => {
    if (!item || !item.children) {
      return item;
    }

    return set(item, 'children', map(item.children, mapSelected));
  });
};
