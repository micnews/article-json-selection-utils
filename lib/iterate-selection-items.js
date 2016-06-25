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

  articleJson.forEach(item => {
    const {selectionStart, selectionEnd} = selectionStatus(item);
    if (inSelection || selectionStart) {
      fn(item);
    }
    inSelection = (inSelection || selectionStart) && !selectionEnd;
  });
};
