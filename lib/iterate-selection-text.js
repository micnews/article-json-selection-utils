export default (articleJson, fn) => {
  let inSelection = false;

  articleJson.forEach(({children = []}, itemIndex) => {
    children.forEach((child, index) => {
      if (child.mark && child.markClass === 'selection-start') {
        inSelection = true;
      }
      if (child.mark && child.markClass === 'selection-end') {
        inSelection = false;
      }

      if (inSelection && child.content) {
        fn(child, index, itemIndex);
      }
    });
  });
};
