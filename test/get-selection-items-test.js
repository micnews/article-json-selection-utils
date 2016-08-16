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
  const actual = getSelectionItems(articleJson);
  const expectedItem = articleJson[1];
  t.is(actual.length, 1, 'should return 1 element');
  t.is(actual[0], expectedItem);
});

test('getSelectionItems() embed', t => {
  const actual = getSelectionItems([{
    type: 'embed',
    embedType: 'image'
  }]);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('getSelectionItems() before & after embed', t => {
  const articleJson = [
    {
      type: 'paragraph',
      children: [
        {mark: true, markClass: 'selection-start'},
        {content: 'hello,'}
      ]
    }, {
      type: 'embed',
      embedType: 'image'
    }, {
      type: 'paragraph',
      children: [
        {content: 'world!'},
        {mark: true, markClass: 'selection-end'}
      ]
    }
  ];
  const actual = getSelectionItems(articleJson);
  const expected = articleJson;
  t.deepEqual(actual, expected);
});

test('getSelectionItems() in blockquote', t => {
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
    }, {
      type: 'blockquote',
      children: [{
        type: 'paragraph',
        children: [
          {content: 'foo'}
        ]}
      ]
    }
  ];

  const actual = getSelectionItems(articleJson);
  const expected = [articleJson[1]];
  t.deepEqual(actual, expected);
});
