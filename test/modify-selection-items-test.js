import test from 'tapava';
import {modifySelectionItems as _modifySelectionItems} from '../lib';

const modifySelectionItems = (articleJson, fn) => _modifySelectionItems(Object.freeze(articleJson), fn);
const shouldNotBeCalled = () => {
  throw new Error('this method should not be called');
};

test('modifySelectionItems() empty array', t => {
  const actual = modifySelectionItems([], shouldNotBeCalled);
  const expected = [];
  t.deepEqual(actual, expected);
});

test('modifySelectionItems() no selection', t => {
  const articleJson = [{
    type: 'paragraph', children: [{
      content: 'hello, world!'
    }]
  }];
  const actual = modifySelectionItems(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('modifySelectionItems() simple selection', t => {
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
  const actual = modifySelectionItems(articleJson, item => ({type: 'header3'}));
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

test('modifySelectionItems() embed', t => {
  const articleJson = [{
    type: 'embed',
    embedType: 'image'
  }];
  const actual = modifySelectionItems(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('modifySelectionItems() before & after embed', t => {
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
      type: 'header3',
      children: [
        {content: 'world!'},
        {mark: true, markClass: 'selection-end'}
      ]
    }
  ];
  const actual = modifySelectionItems(articleJson, item => {
    if (item.type === 'embed') {
      return {embedType: 'image-foo'};
    }
    if (item.type === 'paragraph' || item.type === 'header3') {
      return {type: 'header3'};
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
    }, articleJson[2]
  ];
  t.deepEqual(actual, expected);
  t.is(actual[2], expected[2]);
});
