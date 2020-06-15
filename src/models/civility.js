const randomBoolean = max => {
  return Boolean(Math.round(Math.random()));
};

export const shouldAddCivility = () => {
  return randomBoolean() ? "Abu " : "";
};
