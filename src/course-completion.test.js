import assert from 'node:assert/strict';
import test from 'node:test';
import { evaluateFinalAssessment, getCourseCompletion } from './course-completion.js';

const lessons = { variables: ['one', 'two', 'three'], loops: ['one', 'two', 'three'] };
const finished = Object.fromEntries(Object.keys(lessons).flatMap(id => [0, 1, 2].map(index => [`${id}-${index}`, true])));

test('completion is locked by default and empty catalogs never unlock it', () => {
  assert.deepEqual(getCourseCompletion(lessons), { completed: 0, total: 6, unlocked: false });
  assert.equal(getCourseCompletion({}).unlocked, false);
});

test('every required lesson must be complete, regardless of unrelated saved data', () => {
  const partial = { ...finished, 'loops-2': false, unrelated: true, variables: 100, loops: 100 };
  assert.deepEqual(getCourseCompletion(lessons, partial), { completed: 5, total: 6, unlocked: false });
  assert.equal(getCourseCompletion(lessons, { ...partial, 'loops-2': 'true' }).unlocked, false);
  assert.deepEqual(getCourseCompletion(lessons, finished), { completed: 6, total: 6, unlocked: true });
});

test('diagnostic mastery cannot replace required activities', () => {
  assert.equal(getCourseCompletion(lessons, { variables: 100, loops: 100 }).unlocked, false);
});

test('only an assessment at or above the displayed pass mark unlocks the next course', () => {
  assert.equal(evaluateFinalAssessment(0, 3).passed, false);
  assert.equal(evaluateFinalAssessment(2, 3).passed, false);
  assert.equal(evaluateFinalAssessment(3, 3).passed, true);
  assert.equal(evaluateFinalAssessment(7, 10).passed, true);
  assert.equal(evaluateFinalAssessment(69, 100).passed, false);
  // Rounding a percentage must not turn a failing score into a pass.
  assert.equal(evaluateFinalAssessment(139, 200).passed, false);
});

test('invalid and missing assessment results cannot pass', () => {
  for (const [correct, total] of [[0, 0], [-1, 3], [4, 3], [undefined, 3], ['3', 3], [1.5, 3]]) {
    assert.equal(evaluateFinalAssessment(correct, total).passed, false);
  }
});
