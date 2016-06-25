const selectionStatus = ({children = []}) => {
  let selectionStart = false;
  let selectionEnd = false;

  children.forEach(child => {
    selectionStart = selectionStart || child.mark && child.markClass === 'selection-start' || false;
    selectionEnd = selectionEnd || child.mark && child.markClass === 'selection-end' || false;
  });
  return {selectionStart, selectionEnd};
};

export default articleJson => {
  let inSelection = false;
  const result = [];

  articleJson.forEach(item => {
    const {selectionStart, selectionEnd} = selectionStatus(item);
    if (inSelection || selectionStart) {
      result.push(item);
    }
    inSelection = (inSelection || selectionStart) && !selectionEnd;
  });

  return result;
};
