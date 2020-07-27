const origins = [
  {
    id: "saudi",
    value: "al-Muhajir",
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
];

const getFromId = (id) => {
  const origin = origins.find((origin) => origin.id === id);
  return origin ? origin.value : "";
};

export { getFromId };

export default origins;
