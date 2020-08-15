const origins = [
  {
    id: "saudi",
    value: "al-Saudi",
  },
  {
    id: "german",
    value: "al-Almani",
  },
  {
    id: "american",
    value: "al-Amriki",
  },
  {
    id: "bosnian",
    value: "al-Bosni",
  },
  {
    id: "albanian",
    value: "al-Albani",
  },
  {
    id: "brazilian",
    value: "al-Brazili",
  },
  {
    id: "french",
    value: "al-Faransi",
  },
  {
    id: "tunisian",
    value: "al-Tunsi",
  },
  {
    id: "afghan",
    value: "al-Afghānī",
  },
  {
    id: "algerian",
    value: "al-Jzayry",
  },
  {
    id: "armenian",
    value: "al-Armini",
  },
  {
    id: "australian",
    value: "al'Usturalia",
  },
  {
    id: "austrian",
    value: "al-Namsawi",
  },
  {
    id: "azerbaijani",
    value: "al-Azeri",
  },
  {
    id: "bahraini",
    value: "al-Bahraini",
  },
  {
    id: "belarusian",
    value: "al-Bylarwsyi",
  },
  {
    id: "belgian",
    value: "al-Baljiki",
  },
  {
    id: "british",
    value: "al'Iinjlizia",
  },
  {
    id: "bruneian",
    value: "al-Brunayi",
  },
  {
    id: "bulgarian",
    value: "al-Bulgharia",
  },
  {
    id: "cameroonian",
    value: "al-Kamiruni",
  },
  {
    id: "canadian",
    value: "al-Kandi",
  },
  {
    id: "chadian",
    value: "al-Shadian",
  },
];

const getFromId = (id) => {
  const origin = origins.find((origin) => origin.id === id);
  return origin ? origin.value : "";
};

export { getFromId };

export default origins;
