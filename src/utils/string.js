export const hash = (s) => {
  return s.split("").reduce((acc, value) => {
    acc = (acc << 5) - acc + value.charCodeAt(0);
    return acc & acc;
  }, 0);
};
