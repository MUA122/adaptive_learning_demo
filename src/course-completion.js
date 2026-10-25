export const FINAL_ASSESSMENT_PASS_PERCENT = 70;

// Placement estimates never bypass required course activities.
export function getCourseCompletion(lessons, lessonDone = {}) {
  const activities = Object.entries(lessons).flatMap(([id, items]) =>
    items.map((_, index) => `${id}-${index}`)
  );
  const completed = activities.filter(id => lessonDone[id] === true).length;
  return { completed, total: activities.length, unlocked: activities.length > 0 && completed === activities.length };
}

export function evaluateFinalAssessment(correct, total) {
  const valid = Number.isInteger(correct) && Number.isInteger(total) && total > 0 && correct >= 0 && correct <= total;
  const percentage = valid ? Math.round(correct / total * 100) : 0;
  return { correct, total, percentage, passed: valid && correct / total * 100 >= FINAL_ASSESSMENT_PASS_PERCENT };
}
