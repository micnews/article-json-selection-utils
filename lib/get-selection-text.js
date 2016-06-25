export default articleJson => {
  let inSelection = false;

  return articleJson.reduce((result, {children = []}) => {
    children.forEach(child => {
      if (child.mark && child.markClass === 'selection-start') {
        inSelection = true;
      }
      if (child.mark && child.markClass === 'selection-end') {
        inSelection = false;
      }

      if (inSelection && child.content) {
        result.push(child);
      }
    });

    return result;
  }, []);
};
