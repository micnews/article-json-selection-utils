import test from 'tapava';
import {getSelectionText} from '../lib';

test('getSelectionText() empty array', t => {
  const actual = getSelectionText([]);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('getSelectionText() no selection', t => {
  const actual = getSelectionText([{
    type: 'paragraph', children: [{
      content: 'hello, world!'
    }]
  }]);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('getSelectionText() simple selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [
      {mark: true, markClass: 'selection-start'},
      {content: 'hello, world!'},
      {mark: true, markClass: 'selection-end'}
    ]
  }];
  const actual = getSelectionText(articleJson);
  const expected = [{content: 'hello, world!'}];
  t.deepEqual(actual, expected);
});

test('getSelectionText() embed', t => {
  const actual = getSelectionText([{
    type: 'embed',
    embedType: 'image'
  }]);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('getSelectionText() nested in blockquote', t => {
  const articleJson = [
    {
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
    }
  ];

  const actual = getSelectionText(articleJson);
  const expected = [{content: 'hello, world!'}];
  t.deepEqual(actual, expected);
});
