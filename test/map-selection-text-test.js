import test from 'tapava';
import {mapSelectionText as _mapSelectionText} from '../lib';
import {mergeDeep} from 'immutable-object-methods';

const mapSelectionText = (articleJson, options, fn) => _mapSelectionText(Object.freeze(articleJson), options, fn);
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
      type: 'text', content: 'hello, world!'
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
      {type: 'text', mark: true, markClass: 'selection-start'},
      {type: 'text', content: 'hello, world!'},
      {type: 'text', mark: true, markClass: 'selection-end'}
    ]
  }];
  const actual = mapSelectionText(articleJson, (item) => (mergeDeep(item, {italic: true})));
  const expected = [{
    type: 'paragraph',
    children: [
      {type: 'text', mark: true, markClass: 'selection-start'},
      {type: 'text', content: 'hello, world!', italic: true},
      {type: 'text', mark: true, markClass: 'selection-end'}
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
      {type: 'text', content: 'before'},
      {type: 'text', mark: true, markClass: 'selection-start'},
      {type: 'text', content: 'hello'}
    ]
  }, {
    type: 'embed',
    embedType: 'image'
  }, {
    type: 'header3',
    children: [
      {type: 'text', content: 'world!'},
      {type: 'text', mark: true, markClass: 'selection-end'},
      {type: 'text', content: 'after'}
    ]
  }];
  const actual = mapSelectionText(articleJson, (item) => (mergeDeep(item, {italic: true})));
  const expected = [{
    type: 'paragraph',
    children: [
      {type: 'text', content: 'before'},
      {type: 'text', mark: true, markClass: 'selection-start'},
      {type: 'text', content: 'hello', italic: true}
    ]
  }, {
    type: 'embed',
    embedType: 'image'
  }, {
    type: 'header3',
    children: [
      {type: 'text', content: 'world!', italic: true},
      {type: 'text', mark: true, markClass: 'selection-end'},
      {type: 'text', content: 'after'}
    ]
  }];
  t.deepEqual(actual, expected);
});

test('mapSelectionText() nested in blockquote', t => {
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
          {type: 'text', content: 'hello, '},
          {type: 'text', mark: true, markClass: 'selection-end'},
          {type: 'text', content: 'world!'}
        ]}
      ]
    }, {
      type: 'paragraph',
      children: [{type: 'text', content: 'foo bar'}]
    }
  ];

  const actual = mapSelectionText(articleJson, (item) => (mergeDeep(item, {italic: true})));
  const expected = [
    {
      type: 'paragraph',
      children: [{type: 'text', content: 'beep boop'}]
    }, {
      type: 'blockquote',
      children: [{
        type: 'paragraph',
        children: [
          {type: 'text', mark: true, markClass: 'selection-start'},
          {type: 'text', content: 'hello, ', italic: true},
          {type: 'text', mark: true, markClass: 'selection-end'},
          {type: 'text', content: 'world!'}
        ]}
      ]
    }, {
      type: 'paragraph',
      children: [{type: 'text', content: 'foo bar'}]
    }
  ];
  t.deepEqual(actual, expected);
});

test('mapSelectionText() includeBoundary=true', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [
      {type: 'text', mark: true, markClass: 'selection-start'},
      {type: 'text', content: 'hello, world!'},
      {type: 'text', mark: true, markClass: 'selection-end'}
    ]
  }];
  const actual = mapSelectionText(articleJson, {includeBoundary: true}, (item) => (mergeDeep(item, {italic: true})));
  const expected = [{
    type: 'paragraph',
    children: [
      {type: 'text', mark: true, markClass: 'selection-start', italic: true},
      {type: 'text', content: 'hello, world!', italic: true},
      {type: 'text', mark: true, markClass: 'selection-end', italic: true}
    ]
  }];
  t.deepEqual(actual, expected);
});
