import test from 'tapava';
import {mapSelectionText as _mapSelectionText} from '../lib';

const mapSelectionText = (articleJson, fn) => _mapSelectionText(Object.freeze(articleJson), fn);
const shouldNotBeCalled = () => {
  throw new Error('this method should not be called');
};

test('mapSelectionText() empty array', t => {
  const articleJson = [];
  const actual = mapSelectionText(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('mapSelectionText() no selection', t => {
  const articleJson = [{
    type: 'paragraph', children: [{
      content: 'hello, world!'
    }]
  }];
  const actual = mapSelectionText(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('mapSelectionText() simple selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [
      {mark: true, markClass: 'selection-start'},
      {content: 'hello, world!'},
      {mark: true, markClass: 'selection-end'}
    ]
  }];
  const actual = mapSelectionText(articleJson, ({content}) => ({italic: true, content}));
  const expected = [{
    type: 'paragraph',
    children: [
      {mark: true, markClass: 'selection-start'},
      {content: 'hello, world!', italic: true},
      {mark: true, markClass: 'selection-end'}
    ]
  }];
  t.deepEqual(actual, expected);
});

test('mapSelectionText() embed', t => {
  const articleJson = [{
    type: 'embed',
    embedType: 'image'
  }];
  const actual = mapSelectionText(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('mapSelectionText() selection over multiple text elements', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [
      {content: 'before'},
      {mark: true, markClass: 'selection-start'},
      {content: 'hello'}
    ]
  }, {
    type: 'embed',
    embedType: 'image'
  }, {
    type: 'header3',
    children: [
      {content: 'world!'},
      {mark: true, markClass: 'selection-end'},
      {content: 'after'}
    ]
  }];
  const actual = mapSelectionText(articleJson, ({content}) => ({italic: true, content}));
  const expected = [{
    type: 'paragraph',
    children: [
      {content: 'before'},
      {mark: true, markClass: 'selection-start'},
      {content: 'hello', italic: true}
    ]
  }, {
    type: 'embed',
    embedType: 'image'
  }, {
    type: 'header3',
    children: [
      {content: 'world!', italic: true},
      {mark: true, markClass: 'selection-end'},
      {content: 'after'}
    ]
  }];
  t.deepEqual(actual, expected);
});

test('mapSelectionText() nested in blockquote', t => {
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
          {content: 'hello, '},
          {mark: true, markClass: 'selection-end'},
          {content: 'world!'}
        ]}
      ]
    }, {
      type: 'paragraph',
      children: [{content: 'foo bar'}]
    }
  ];

  const actual = mapSelectionText(articleJson, ({content}) => ({italic: true, content}));
  const expected = [
    {
      type: 'paragraph',
      children: [{content: 'beep boop'}]
    }, {
      type: 'blockquote',
      children: [{
        type: 'paragraph',
        children: [
          {mark: true, markClass: 'selection-start'},
          {content: 'hello, ', italic: true},
          {mark: true, markClass: 'selection-end'},
          {content: 'world!'}
        ]}
      ]
    }, {
      type: 'paragraph',
      children: [{content: 'foo bar'}]
    }
  ];
  t.deepEqual(actual, expected);
});
