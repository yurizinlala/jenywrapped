export function nextPosition(index, beat, scenes) {
  const count = scenes[index].beats?.length ?? 1;
  if (beat < count - 1) return { index, beat: beat + 1 };
  return { index: Math.min(scenes.length - 1, index + 1), beat: 0 };
}
export function previousPosition(index, beat, scenes) {
  if (beat > 0) return { index, beat: beat - 1 };
  const previous = Math.max(0, index - 1);
  return {
    index: previous,
    beat: Math.max(0, (scenes[previous].beats?.length ?? 1) - 1),
  };
}
