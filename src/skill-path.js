// One prerequisite graph drives both onboarding and the saved learning roadmap.
export const skillGraph = [
  { id: 'variables', level: 0, requires: [], x: 50, y: 106 },
  { id: 'loops', level: 1, requires: ['variables'], x: 26, y: 286 },
  { id: 'functions', level: 1, requires: ['variables'], x: 74, y: 286 },
  { id: 'callstack', level: 2, requires: ['functions'], x: 74, y: 466 },
  { id: 'recursion', level: 2, requires: ['loops', 'callstack'], x: 50, y: 646 },
  { id: 'trees', level: 3, requires: ['recursion'], x: 50, y: 826 },
];

export function buildSkillPath(concepts, mastery = {}, lessonDone = {}) {
  const completed = new Set(skillGraph.filter(({ id }) =>
    (mastery[id] || 0) >= 80 || [0, 1, 2].every(index => lessonDone[`${id}-${index}`])
  ).map(skill => skill.id));
  const nodes = skillGraph.map(skill => ({
    ...concepts.find(concept => concept.id === skill.id),
    ...skill,
    mastery: mastery[skill.id] || 0,
    lessonsExplored: [0, 1, 2].filter(index => lessonDone[`${skill.id}-${index}`]).length,
    state: completed.has(skill.id) ? 'complete'
      : skill.requires.every(id => completed.has(id)) ? 'available' : 'locked',
  }));
  const next = nodes.find(node => node.state === 'available') || nodes[0];
  return { nodes, next, completed: completed.size, level: completed.size === nodes.length ? 4 : next.level };
}

export function scoreDiagnostic(questions, answers) {
  const totals = {};
  questions.forEach((question, index) => {
    const result = totals[question.id] ||= { correct: 0, total: 0 };
    result.total += 1;
    if (answers[index] === question.correct) result.correct += 1;
  });
  return Object.fromEntries(Object.entries(totals).map(([id, result]) =>
    [id, Math.round(result.correct / result.total * 80)]
  ));
}
