import test from 'tapava';
import {mapSelectionItems as _mapSelectionItems} from '../lib';

const mapSelectionItems = (articleJson, fn) => _mapSelectionItems(Object.freeze(articleJson), fn);
const shouldNotBeCalled = () => {
  throw new Error('this method should not be called');
};

test('mapSelectionItems() empty array', t => {
  const actual = mapSelectionItems([], shouldNotBeCalled);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('mapSelectionItems() no selection', t => {
  const articleJson = [{
    type: 'paragraph', children: [{
      content: 'hello, world!'
    }]
  }];
  const actual = mapSelectionItems(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('mapSelectionItems() simple selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [{content: 'beep boop'}]
  }, {
    type: 'paragraph',
    children: [
      {mark: true, markClass: 'selection-start'},
      {content: 'hello, world!'},
      {mark: true, markClass: 'selection-end'}
    ],
    'extraAttribute': true
  }, {
    type: 'paragraph',
    children: [{content: 'foo bar'}]
  }];
  const actual = mapSelectionItems(
    articleJson, ({children}) => ({type: 'header3', children}));
  const expected = [
    articleJson[0], {
      type: 'header3',
      children: articleJson[1].children
    },
    articleJson[2]
  ];
  t.deepEqual(actual, expected);
  t.is(actual[0], expected[0]);
  t.is(actual[1].children, expected[1].children);
  t.is(actual[2], expected[2]);
});

test('mapSelectionItems() embed', t => {
  const articleJson = [{
    type: 'embed',
    embedType: 'image'
  }];
  const actual = mapSelectionItems(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('mapSelectionItems() before & after embed', t => {
  const articleJson = [
    {
      type: 'paragraph',
      children: [
        {mark: true, markClass: 'selection-start'},
        {content: 'hello,'}
      ],
      extraAttribute: true
    }, {
      type: 'embed',
      embedType: 'image',
      extraAttribute: true
    }, {
      type: 'header3',
      children: [
        {content: 'world!'},
        {mark: true, markClass: 'selection-end'}
      ],
      extraAttribute: true
    }
  ];
  const actual = mapSelectionItems(articleJson, item => {
    if (item.type === 'embed') {
      return {type: 'embed', embedType: 'image-foo'};
    }
    if (item.type === 'paragraph' || item.type === 'header3') {
      return {type: 'header3', children: item.children};
    }
    shouldNotBeCalled();
  });
  const expected = [
    {
      type: 'header3',
      children: articleJson[0].children
    }, {
      type: 'embed',
      embedType: 'image-foo'
    }, {
      type: 'header3',
      children: articleJson[2].children
    }
  ];
  t.deepEqual(actual, expected);
  t.is(actual[0].children, expected[0].children);
  t.is(actual[2].children, expected[2].children);
});
