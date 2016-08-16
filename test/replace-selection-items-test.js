import test from 'tapava';
import {replaceSelectionItems} from '../lib';

test('replaceSelectionItems() empty array', t => {
  const articleJson = [];
  const actual = replaceSelectionItems(articleJson, (items) => {
    return 'some other items';
  });
  t.deepEqual(actual, articleJson);
});

test('replaceSelectionItems() no selection', t => {
  const articleJson = [{
    type: 'paragraph', children: [{
      content: 'hello, world!'
    }]
  }];
  const actual = replaceSelectionItems(articleJson, (items) => {
    return 'some other items';
  });
  t.deepEqual(actual, articleJson);
});

test('replaceSelectionItems() wrap selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [{content: 'beep boop'}]
  }, {
    type: 'paragraph',
    children: [
      {mark: true, markClass: 'selection-start'},
      {content: 'hello, world!'},
      {mark: true, markClass: 'selection-end'}
    ]
  }, {
    type: 'paragraph',
    children: [{content: 'foo bar'}]
  }];
  const expected = [{
    type: 'paragraph',
    children: [{content: 'beep boop'}]
  }, {
    type: 'blockquote',
    children: [{
      type: 'paragraph',
      children: [
        {mark: true, markClass: 'selection-start'},
        {content: 'hello, world!'},
        {mark: true, markClass: 'selection-end'}
      ]}
    ]
  }, {
    type: 'paragraph',
    children: [{content: 'foo bar'}]
  }];
  const actual = replaceSelectionItems(articleJson, (items) => {
    return [{
      type: 'blockquote',
      children: items
    }];
  });

  t.deepEqual(actual, expected);
});

test('replaceSelectionItems() unwrap selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [{content: 'beep boop'}, {mark: true, markClass: 'selection-start'}]
  }, {
    type: 'blockquote',
    children: [{
      type: 'paragraph',
      children: [

        {content: 'hello, world!'},
        {mark: true, markClass: 'selection-end'}
      ]}
    ]
  }, {
    type: 'paragraph',
    children: [{content: 'foo bar'}]
  }, {
    type: 'blockquote',
    children: [{
      type: 'paragraph',
      children: [
        {content: 'foo'}
      ]}
    ]
  }];
  const expected = [{
    type: 'paragraph',
    children: [{content: 'beep boop'}, {mark: true, markClass: 'selection-start'}]
  }, {
    type: 'paragraph',
    children: [
      {content: 'hello, world!'},
      {mark: true, markClass: 'selection-end'}
    ]
  }, {
    type: 'paragraph',
    children: [{content: 'foo bar'}]
  }, {
    type: 'blockquote',
    children: [{
      type: 'paragraph',
      children: [
        {content: 'foo'}
      ]}
    ]
  }];
  const actual = replaceSelectionItems(articleJson, (items) => {
    return items.reduce((a, b) => {
      if (b.type === 'blockquote') {
        return a.concat(b.children);
      }

      a.push(b);
      return a;
    }, []);
  });

  t.deepEqual(actual, expected);
});
