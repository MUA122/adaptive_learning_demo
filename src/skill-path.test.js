import assert from 'node:assert/strict';
import test from 'node:test';
import { buildSkillPath, scoreDiagnostic, skillGraph } from './skill-path.js';

const concepts = skillGraph.map(({ id }) => ({ id, en: id }));
const stateOf = (path, id) => path.nodes.find(node => node.id === id).state;

test('a skipped diagnostic starts at Level 0 with only Variables unlocked', () => {
  const path = buildSkillPath(concepts);
  assert.equal(path.level, 0);
  assert.equal(path.completed, 0);
  assert.equal(path.next.id, 'variables');
  assert.deepEqual(path.nodes.filter(node => node.state === 'available').map(node => node.id), ['variables']);
});

test('foundations unlock two branches independently', () => {
  const path = buildSkillPath(concepts, { variables: 80 });
  assert.equal(path.level, 1);
  assert.deepEqual(path.nodes.filter(node => node.state === 'available').map(node => node.id), ['loops', 'functions']);
  assert.equal(stateOf(path, 'callstack'), 'locked');
});

test('Recursion requires both Loops and Call Stack', () => {
  const mastery = { variables: 80, functions: 80, callstack: 80 };
  assert.equal(stateOf(buildSkillPath(concepts, mastery), 'recursion'), 'locked');
  const path = buildSkillPath(concepts, { ...mastery, loops: 80 });
  assert.equal(path.next.id, 'recursion');
  assert.equal(path.level, 2);
  assert.equal(stateOf(path, 'recursion'), 'available');
});

test('lesson progress unlocks dependents and survives path reconstruction', () => {
  const progress = { 'variables-0': true, 'variables-1': true };
  assert.equal(stateOf(buildSkillPath(concepts, {}, progress), 'loops'), 'locked');
  const path = buildSkillPath(concepts, {}, { ...progress, 'variables-2': true });
  assert.equal(stateOf(path, 'variables'), 'complete');
  assert.equal(stateOf(path, 'loops'), 'available');
  assert.equal(path.nodes[0].lessonsExplored, 3);
});

test('diagnosis accounts for every answer, including unknown answers', () => {
  const questions = [{ id: 'functions', correct: 0 }, { id: 'functions', correct: 1 }, { id: 'loops', correct: 0 }];
  assert.deepEqual(scoreDiagnostic(questions, [0, -1, -1]), { functions: 40, loops: 0 });
  assert.deepEqual(scoreDiagnostic(questions, [0, 1, 0]), { functions: 80, loops: 80 });
  assert.deepEqual(scoreDiagnostic(questions, []), { functions: 0, loops: 0 });
});

test('a completed assessment can place a student at Trees or course completion', () => {
  const mastery = Object.fromEntries(skillGraph.filter(node => node.id !== 'trees').map(node => [node.id, 80]));
  assert.equal(buildSkillPath(concepts, mastery).level, 3);
  assert.equal(buildSkillPath(concepts, mastery).next.id, 'trees');
  const finished = buildSkillPath(concepts, { ...mastery, trees: 80 });
  assert.equal(finished.completed, 6);
  assert.equal(finished.level, 4);
  assert.equal(finished.nodes.some(node => node.state === 'locked'), false);
});

test('every dependency exists and precedes its dependent in the graph', () => {
  skillGraph.forEach((node, index) => node.requires.forEach(id => {
    const parentIndex = skillGraph.findIndex(parent => parent.id === id);
    assert.ok(parentIndex >= 0 && parentIndex < index, `${node.id} has a valid prerequisite: ${id}`);
  }));
});
