export default articleJson => {
  let inSelection = false;

  const filterChildren = (children = []) => children.reduce((children, child) => {
    if (child.mark && child.markClass === 'selection-start') {
      inSelection = true;
    }
    if (child.mark && child.markClass === 'selection-end') {
      inSelection = false;
    }

    if (inSelection && child.content) {
      children.push(child);
    }

    return children;
  }, []);

  return articleJson.reduce((result, item) => {
    const children = filterChildren(item.children);

    if (children.length > 0) {
      result.push(item);
    }

    return result;
  }, []);
};
