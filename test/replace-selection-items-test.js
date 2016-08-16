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

test('replaceSelectionItems() simple selection', t => {
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
    return {
      type: 'blockquote',
      children: items
    };
  });

  t.deepEqual(actual, expected);
});
