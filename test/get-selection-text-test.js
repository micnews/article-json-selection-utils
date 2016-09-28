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
      type: 'text', content: 'hello, world!'
    }]
  }]);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('getSelectionText() simple selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [
      {type: 'text', mark: true, markClass: 'selection-start'},
      {type: 'text', content: 'hello, world!'},
      {type: 'text', mark: true, markClass: 'selection-end'}
    ]
  }];
  const actual = getSelectionText(articleJson);
  const expected = [{type: 'text', content: 'hello, world!'}];
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
      children: [{type: 'text', content: 'beep boop'}]
    }, {
      type: 'blockquote',
      children: [{
        type: 'paragraph',
        children: [
          {type: 'text', mark: true, markClass: 'selection-start'},
          {type: 'text', content: 'hello, world!'},
          {type: 'text', mark: true, markClass: 'selection-end'}
        ]}
      ]
    }, {
      type: 'paragraph',
      children: [{type: 'text', content: 'foo bar'}]
    }
  ];

  const actual = getSelectionText(articleJson);
  const expected = [{type: 'text', content: 'hello, world!'}];
  t.deepEqual(actual, expected);
});
