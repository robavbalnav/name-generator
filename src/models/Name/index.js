import { hash } from "../../utils/string";
import { getFromId as getOriginFromId } from "../../data/origins";

import { getSecondName, civility } from "./methods";

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

export const generateName = (inputName, country) => {
  const hashedInput = hash(`${inputName}${country}`);
  const particles = [
    civility(hashedInput),
    capitalize(inputName),
    getSecondName(hashedInput),
    getOriginFromId(country),
  ]
    .filter(Boolean)
    .join(" ");
  return particles;
};
