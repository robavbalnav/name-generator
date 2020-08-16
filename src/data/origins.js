const origins = [
  {
    id: "saudi",
    value: "alsewdy",
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
    value: "altuwnisiu",
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
  {
    id: "chinese",
    value: "al-Sinaa",
  },
  {
    id: "croatian",
    value: "alkuruatia",
  },
  {
    id: "cypriot",
    value: "alqubrusiu",
  },
  {
    id: "danish",
    value: "al-Danmarki",
  },
  {
    id: "dutch",
    value: "al-Hulandi",
  },
  {
    id: "egyptian",
    value: "al-Misria",
  },
  {
    id: "eritrean",
    value: "al-Iirytrin",
  },
  {
    id: "finnish",
    value: "al-Finlandia",
  },
  {
    id: "georgian",
    value: "al-Jawrajia",
  },
  {
    id: "greek",
    value: "al-Yunania",
  },
  {
    id: "icelander",
    value: "al-Ayslandr",
  },
  {
    id: "indian",
    value: "al-Hindiin",
  },
  {
    id: "indonesian",
    value: "al-Iindunisi",
  },
  {
    id: "iranian",
    value: "al-Iiraniun",
  },
  {
    id: "iraqi",
    value: "al-Eiraqiin",
  },
  {
    id: "irish",
    value: "al-Ayralandia",
  },
  {
    id: "israeli",
    value: "al-Iisrayiyli",
  },
  {
    id: "italian",
    value: "al-Iitalia",
  },
  {
    id: "japanese",
    value: "alyabania",
  },
  {
    id: "jordanian",
    value: "al-Urduniyun",
  },
  {
    id: "kazakhstani",
    value: "al-Kazakhstani",
  },
  {
    id: "kuwaiti",
    value: "al-Kuaytiin",
  },
  {
    id: "lebanese",
    value: "al-Lubnaniin",
  },
  {
    id: "liberian",
    value: "al-Libiria",
  },
  {
    id: "libyan",
    value: "alliybia",
  },
  {
    id: "macedonian",
    value: "al-Maqduwni",
  },
  {
    id: "maldivan",
    value: "juzur almaldif",
  },
  {
    id: "malian",
    value: "almalii",
  },
  {
    id: "maltese",
    value: "almalitia",
  },
  {
    id: "mauritanian",
    value: "almuritaniu",
  },
  {
    id: "mexican",
    value: "almaksiki",
  },
  {
    id: "moroccan",
    value: "almaghribiu",
  },
  {
    id: "namibian",
    value: "alnamibiu",
  },
  {
    id: "nepalese",
    value: "alnybaly",
  },
  {
    id: "new zealander",
    value: "alnywzylandi",
  },
  {
    id: "nigerian",
    value: "alnayjiriiyn",
  },
  {
    id: "norwegian",
    value: "alnirwijia",
  },
  {
    id: "omani",
    value: "aleumani",
  },
  {
    id: "pakistani",
    value: "albakistaniu",
  },
  {
    id: "polish",
    value: "albulandia",
  },
  {
    id: "portuguese",
    value: "walburtughalia",
  },
  {
    id: "qatari",
    value: "alqatari",
  },
  {
    id: "romanian",
    value: "alruwmaniu",
  },
  {
    id: "russian",
    value: "alrws",
  },
  {
    id: "rwandan",
    value: "alrawandan",
  },
  {
    id: "scottish",
    value: "al'iiskutlandiu",
  },
  {
    id: "senegalese",
    value: "alsinighal",
  },
  {
    id: "serbian",
    value: "alsirbia",
  },
  {
    id: "singaporean",
    value: "alsinghafuri",
  },
  {
    id: "slovakian",
    value: "alsslufakia",
  },
  {
    id: "slovenian",
    value: "alsslufiniu",
  },
  {
    id: "somali",
    value: "alsuwmaliu",
  },
  {
    id: "south african",
    value: "janub 'iifriqia",
  },
  {
    id: "south korean",
    value: "kuria aljanubia",
  },
  {
    id: "spanish",
    value: "al'iisbania",
  },
  {
    id: "sri lankan",
    value: "alsrilankia",
  },
  {
    id: "sudanese",
    value: "alsudani",
  },
  {
    id: "swedish",
    value: "alsuwidia",
  },
  {
    id: "swiss",
    value: "alsuwisriiyn",
  },
  {
    id: "syrian",
    value: "alsuwriu",
  },
  {
    id: "thai",
    value: "alttaylandia",
  },
  {
    id: "togolese",
    value: "altuwghuliz",
  },
  {
    id: "togolese",
    value: "altuwghuliz",
  },
  {
    id: "turkish",
    value: "alturki",
  },
  {
    id: "ugandan",
    value: "al'uwghandiu",
  },
  {
    id: "ukrainian",
    value: "al'uwkraniu",
  },
  {
    id: "uzbekistani",
    value: "alawzbkstany",
  },
  {
    id: "vietnamese",
    value: "alfiatnamia",
  },
  {
    id: "yemenite",
    value: "alyamani",
  },
  {
    id: "zimbabwean",
    value: "zambabwi",
  },
];

const getFromId = (id) => {
  const origin = origins.find((origin) => origin.id === id);
  return origin ? origin.value : "";
};

export { getFromId };

export default origins;
