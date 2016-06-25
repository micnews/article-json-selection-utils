import test from 'tapava';
import {getSelectionItems} from '../lib';

test('getSelectionItems() empty array', t => {
  const actual = getSelectionItems([]);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('getSelectionItems() no selection', t => {
  const actual = getSelectionItems([{
    type: 'paragraph', children: [{
      content: 'hello, world!'
    }]
  }]);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('getSelectionItems() simple selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [
      {mark: true, markClass: 'selection-start'},
      {content: 'hello, world!'},
      {mark: true, markClass: 'selection-end'}
    ]
  }];
  const actual = getSelectionItems(articleJson)[0];
  const expected = articleJson[0];
  t.is(actual, expected);
});

test('getSelectionItems() embed', t => {
  const actual = getSelectionItems([{
    type: 'embed',
    embedType: 'image'
  }]);
  const expected = [];
  t.deepEqual(actual, expected);
});
