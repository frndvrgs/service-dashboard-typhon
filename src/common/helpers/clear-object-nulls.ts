export const clearObjectNulls = (object: Record<string, unknown> | null) => {
  if (!object) return null;
  return Object.fromEntries(
    Object.entries(object).filter(([_key, value]) => value != null),
  );
};
