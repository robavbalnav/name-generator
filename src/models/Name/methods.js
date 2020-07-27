import professions from "../../data/professions";
import organizations from "../../data/organizations";

export const getSecondName = (hash) => {
  const aggregated = [...organizations, ...professions];
  return aggregated[hash % aggregated.length];
};

export const civility = (hash) => {
  return hash % 2 ? "Abu" : "";
};
