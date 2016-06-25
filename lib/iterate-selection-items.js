const selectionStatus = ({children = []}) => {
  let selectionStart = false;
  let selectionEnd = false;

  children.forEach(child => {
    selectionStart = selectionStart || child.mark && child.markClass === 'selection-start' || false;
    selectionEnd = selectionEnd || child.mark && child.markClass === 'selection-end' || false;
  });
  return {selectionStart, selectionEnd};
};

export default (articleJson, fn) => {
  let inSelection = false;

  articleJson.forEach((item, index) => {
    const {selectionStart, selectionEnd} = selectionStatus(item);
    if (inSelection || selectionStart) {
      fn(item, index);
    }
    inSelection = (inSelection || selectionStart) && !selectionEnd;
  });
};
