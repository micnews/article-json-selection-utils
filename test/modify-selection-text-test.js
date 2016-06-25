import test from 'tapava';
import {modifySelectionText as _modifySelectionText} from '../lib';

const modifySelectionText = (articleJson, fn) => _modifySelectionText(Object.freeze(articleJson), fn);
const shouldNotBeCalled = () => {
  throw new Error('this method should not be called');
};

test('modifySelectionText() empty array', t => {
  const articleJson = [];
  const actual = modifySelectionText(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('modifySelectionText() no selection', t => {
  const articleJson = [{
    type: 'paragraph', children: [{
      content: 'hello, world!'
    }]
  }];
  const actual = modifySelectionText(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});

test('modifySelectionText() simple selection', t => {
  const articleJson = [{
    type: 'paragraph',
    children: [
      {mark: true, markClass: 'selection-start'},
      {content: 'hello, world!'},
      {mark: true, markClass: 'selection-end'}
    ]
  }];
  const actual = modifySelectionText(articleJson, item => ({italic: true}));
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

test('modifySelectionText() embed', t => {
  const articleJson = [{
    type: 'embed',
    embedType: 'image'
  }];
  const actual = modifySelectionText(articleJson, shouldNotBeCalled);
  const expected = articleJson;
  t.is(actual, expected);
});
