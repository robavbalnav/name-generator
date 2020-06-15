import origins from "../data/origins";
import professions from "../data/professions";
import origanizations from "../data/origanizations";

const getRandomInt = max => {
  return Math.floor(Math.random() * Math.floor(max));
};

export const getSecondName = () => {
  const aggregated = [...origins, ...professions];
  const index = getRandomInt(aggregated.length);
  return index === 0 ? aggregated[0] : aggregated[index - 1];
};
