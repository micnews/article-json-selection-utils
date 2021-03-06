import {map} from 'immutable-array-methods';

const selectionStatus = ({children = []}) =>
  children.reduce(({selectionStart, selectionEnd}, {mark, markClass, children}) => {
    const childSelectionStatus = children && children.length
      ? selectionStatus({children})
      : {};

    return {
      selectionStart: selectionStart ||
        mark && markClass === 'selection-start' ||
        childSelectionStatus.selectionStart ||
        false,
      selectionEnd: selectionEnd ||
        mark && markClass === 'selection-end' ||
        childSelectionStatus.selectionEnd ||
        false
    };
  }, {});

export default (articleJson, fn) => {
  let inSelection = false;

  return map(articleJson, (item, index) => {
    const {selectionStart, selectionEnd} = selectionStatus(item);
    let result = item;
    if (inSelection || selectionStart) {
      result = fn(item, index);
    }
    inSelection = (inSelection || selectionStart) && !selectionEnd;
    return result;
  });
};
