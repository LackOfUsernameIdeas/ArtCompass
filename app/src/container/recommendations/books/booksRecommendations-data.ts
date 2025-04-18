import { FilteredBrainData } from "@/container/types_common";
import { BooksUserPreferences } from "./booksRecommendations-types";

export const moodOptions = [
  "Развълнуван/-на 😄",
  "Любопитен/-на 🤔",
  "Тъжен/-на 😢",
  "Щастлив/-а 😊",
  "Спокоен/-йна 😌",
  "Разочарован/-на 😞",
  "Уморен/-на 😴",
  "Нервен/-на 😟",
  "Разгневен/-на 😠",
  "Стресиран/-на 😰",
  "Носталгичен/-на 😭",
  "Безразличен/-на 😐",
  "Оптимистичен/-на 😃",
  "Песимистичен/-на 😔",
  "Весел/-а 😁",
  "Смутен/-на 😳",
  "Озадачен/-на 🤨",
  "Разтревожен/-на 😧",
  "Вдъхновен/-на ✨"
];

export const pacingOptions = [
  "бавни, концентриращи се върху разкази на героите",
  "бързи с много напрежение",
  "Нямам предпочитания"
];
export const depthOptions = [
  "Лесни за проследяване - релаксиращи",
  "Средни - с ясни сюжетни линии",
  "Трудни - с много истории и терминологии, характерни за книгата",
  "Нямам предпочитания"
];

export const targetGroupOptions = [
  "Деца",
  "Тийнейджъри",
  "Възрастни",
  "Семейни",
  "Семейство и деца",
  "Възрастни над 65"
];

export const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;

export const googleBooksPrompt = (userPreferences: BooksUserPreferences) => {
  const genres = userPreferences.genres.map((genre) => genre.en).join(", ");
  return {
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "Ти си изкуствен интелект, който препоръчва книги САМО В Google Books и събира подробна информация за всяка една от тях. Цялата информация трябва да бъде представена в правилен JSON формат с всички стойности преведени на български език, като заглавието на изданието трябва да бъде точно и реално. Книгите не трябва да са измислени, а в действителност да съществуват."
      },
      {
        role: "user",
        content: `Книгите трябва да съответстват на следните лични предпочитания: Любими жанрове: [${genres}]; Емоционално състояние: [${userPreferences.moods}]; Любими автори: [${userPreferences.authors}]; Теми, които ме интересуват: [${userPreferences.interests}]; Произход: [${userPreferences.origin}]; Целева група: [${userPreferences.targetGroup}]; Предпочитам книги, които са ${userPreferences.pacing}. Нивото на задълбочаване на книгите трябва да бъде: [${userPreferences.depth}]. Съобрази се максимално с дадените предпочитания, но се фокусирай главно върху точността и съществуването на препоръчваните книги`
      },
      {
        role: "user",
        content:
          "Събери подробна информация от Google Books и представи данните в следния JSON формат: [{'title_en': string, 'title_bg': string, 'real_edition_title': string, 'origin': string, 'reason': string, 'adaptations': string, 'goodreads_rating': number}, {още 4 препоръки...}]. Обектът трябва да бъде валиден за JavaScript JSON.parse() функцията. Полето \"origin\" описва произхода на книгата по региони, например: 'Руска литература', 'Българска литература', 'Европейска литература' и т.н. В полето \"reason\" трябва да се даде отговор на въпроса: 'Защо тази книга е подходяща за мен?' спрямо предпочитанията, които са посочени. Полето \"real_edition_title\" трябва да съдържа пълното заглавие на изданието точно както е в Google Books, което ще бъде използвано за директно търсене в следния формат: 'точно име - автор - Google Books'. Освен това, точното име и автора в \"real_edition_title\" трябва задължително да са на родния език на автора, например: при английски автор като Arthur C. Clarke, името на произведението също трябва да бъде в английски, при български автор - името на произведението трябва да е на български и т.н. Включи адаптации на книгите (ако има такива), като филми, сериали или театрални постановки, посочвайки имената на адаптациите и годините на издаване/представяне. Всички текстови стойности, включително заглавия, автори, описания, жанрове и произход, трябва да бъдат преведени на български език. Отговори само с валиден JSON обект без допълнителен текст или обяснения."
      }
    ]
  };
};

export const googleBooksBrainAnalysisPrompt = (
  brainWaveData: FilteredBrainData[]
) => {
  const brainWaveString = JSON.stringify(brainWaveData, null, 2);
  return {
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "Ти си изкуствен интелект, който препоръчва книги САМО В Google Books и събира подробна информация за всяка една от тях. Цялата информация трябва да бъде представена в правилен JSON формат с всички стойности преведени на български език, като заглавието на изданието трябва да бъде точно и реално. Книгите не трябва да са измислени, а в действителност да съществуват."
      },
      {
        role: "user",
        content: `Книгите трябва ЗАДЪЛЖИТЕЛНО да съвпадат със следните данни за мозъчна активност, получени от устройството 'NeuroSky MindWave Mobile 2: EEG Sensor' и задължително трябва да дадеш аргументирана причина защо препоръката е подходяща спрямо данните, а именно:
        ${brainWaveString}.`
      },
      {
        role: "user",
        content:
          "Събери подробна информация от Google Books и представи данните в следния JSON формат: [{'title_en': string, 'title_bg': string, 'real_edition_title': string, 'origin': string, 'reason': string, 'adaptations': string, 'goodreads_rating': number}, {още 4 препоръки...}]. Обектът трябва да бъде валиден за JavaScript JSON.parse() функцията. Полето \"origin\" описва произхода на книгата по региони, например: 'Руска литература', 'Българска литература', 'Европейска литература' и т.н. В полето \"reason\" трябва да се даде отговор на въпроса: 'Защо тази книга е подходяща за мен, спрямо данните от устройството (EEG power spectrums - Alpha, Beta, Gamma... и EEG algorithms - Attention, Mediation), които са посочени?'. Полето \"real_edition_title\" трябва да съдържа пълното заглавие на изданието точно както е в Google Books, което ще бъде използвано за директно търсене в следния формат: 'точно име - автор - Google Books'. Освен това, точното име и автора в \"real_edition_title\" трябва задължително да са на родния език на автора, например: при английски автор като Arthur C. Clarke, името на произведението също трябва да бъде в английски, при български автор - името на произведението трябва да е на български и т.н. Включи адаптации на книгите (ако има такива), като филми, сериали или театрални постановки, посочвайки имената на адаптациите и годините на издаване/представяне. Всички текстови стойности, включително заглавия, автори, описания, жанрове и произход, трябва да бъдат преведени на български език. Отговори само с валиден JSON обект без допълнителен текст или обяснения."
      }
    ]
  };
};

export const googleBooksExampleResponse = `[
  {
    "title_en": "Foundation",
    "title_bg": "Фондация",
    "real_edition_title": "Foundation - Isaac Asimov - Google Books",
    "author": "Айзък Азимов",
    "genres": ["Научна фантастика"],
    "description": "Фондация е първата книга от поредицата на Азимов, където ученът Хари Селдон използва психоистория, за да предвиди колапса на галактическата империя и създава фондация, която да намали Падането до само хилядолетие.",
    "edition_language": "Английски",
    "language": "Български",
    "origin": "Американска литература",
    "date_of_first_issue": 1951,
    "date_of_issue": 1972,
    "goodreads_rating": 4.15,
    "reason": "Първостепенна научна фантастика, която се концентрира върху стратегии и социални динамики.",
    "adaptations": "Сериал 'Foundation' от 2021 г.",
    "page_count": 255
  },
  {
    "title_en": "The Girl with the Dragon Tattoo",
    "title_bg": "Момичето с дракона татуировка",
    "real_edition_title": "The Girl with the Dragon Tattoo - Stieg Larsson - Google Books",
    "author": "Стиг Ларшон",
    "genres": ["Мистерия", "Трилър"],
    "description": "Историята на това криминале следва разследването на изчезването на млада жена преди 40 години, което отвежда журналиста Микаел Блумиквист и хакерката Лисбет Саландер в центъра на семейство, обитавано от много тайни.",
    "edition_language": "Английски",
    "language": "Български",
    "origin": "Шведска литература",
    "date_of_first_issue": 2005,
    "date_of_issue": 2008,
    "goodreads_rating": 4.13,
    "reason": "Сложен и интригуващ трилър с акцент на героите, занимаващ се с теми за справедливост и правдоподобност.",
    "adaptations": "Филм 'The Girl with the Dragon Tattoo' от 2011 г.",
    "page_count": 465
  },
  {
    "title_en": "The Hitchhiker's Guide to the Galaxy",
    "title_bg": "Пътеводител на галактическия стопаджия",
    "real_edition_title": "The Hitchhiker's Guide to the Galaxy - Douglas Adams - Google Books",
    "author": "Дъглас Адамс",
    "genres": ["Научна фантастика", "Комедия"],
    "description": "Започвайки с унищожаването на Земята за небесна магистрала, Артър Дент се изплъзва на космическа одисея из космоса, ръководен от Пътеводителя на стопаджията.",
    "edition_language": "Английски",
    "language": "Български",
    "origin": "Английска литература",
    "date_of_first_issue": 1979,
    "date_of_issue": 1981,
    "goodreads_rating": 4.20,
    "reason": "Забавно и остроумно приключение, което разисква приятелството и безсмисленото във вселената.",
    "adaptations": "Филм 'The Hitchhiker's Guide to the Galaxy' от 2005 г.",
    "page_count": 193
  },
  {
    "title_en": "The Shadow of the Wind",
    "title_bg": "Сянката на вятъра",
    "real_edition_title": "The Shadow of the Wind - Carlos Ruiz Zafón - Google Books",
    "author": "Карлос Руис Сафон",
    "genres": ["Мистерия", "Исторически"],
    "description": "В Барселона през 1945 год. младеж намира мистериозна книга, която го вкарва в свят на свръхестествени събития и трагични истории.",
    "edition_language": "Английски",
    "language": "Български",
    "origin": "Испанска литература",
    "date_of_first_issue": 2001,
    "date_of_issue": 2014,
    "goodreads_rating": 4.30,
    "reason": "Историческа мистерия с емоционална дълбочина и акцент на разказа на героите.",
    "adaptations": "Аудио книга и сценична адаптация в Испания.",
    "page_count": 487
  },
  {
    "title_en": "The Maze Runner",
    "title_bg": "Лабиринтът: Невъзможно бягство",
    "real_edition_title": "The Maze Runner - James Dashner - Google Books",
    "author": "Джеймс Дашнър",
    "genres": ["Научна фантастика", "Мистерия", "Тийн"],
    "description": "Когато Томас се събужда в загадъчен лабиринт без спомени, той се сблъсква с предизвикателства за оцеляване и търсене на истината с помощта на нови приятели.",
    "edition_language": "Английски",
    "language": "Български",
    "origin": "Американска литература",
    "date_of_first_issue": 2009,
    "date_of_issue": 2014,
    "goodreads_rating": 4.03,
    "reason": "Вълнуваща дистопична история с акцент на приятелството и личните предизвикателства.",
    "adaptations": "Филмова трилогия 'The Maze Runner' започваща от 2014 г.",
    "page_count": 375
  }
]`;

export const goodreadsPrompt = (userPreferences: BooksUserPreferences) => {
  const genres = userPreferences.genres.map((genre) => genre.en).join(", ");
  return {
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content:
          "You are an AI that recommends books based on the user's preferences. You must recommend books that exist on Goodreads, ensuring that all titles and details correspond to real entries from Goodreads. Inventing books or providing fictional information is absolutely prohibited. Не е задължително всяка книга да отговаря на всички лични предпочитания, но е препоръчително всяко предпочитание да е изпълнено чрез поне една книга. Препоръчително е да изпълняваш предпочитанията на потребителя, но ако не намираш достатъчно книги, отговарящи на тях - можеш да се отклониш от някое стига да се изпълнява друго (пример: предпочитана държава на произход България не значи, че книгите трябва да са само български, но е препоръчително да са предимно такива; предпочитан жанр драма не значи, че книгите трябва да са само драматични, но е препоръчително да са предимно такива). Препоръчително е да предложиш 5 книги, но в крайни ситуации, в които нямаш предложение не измисляй свои заглавия - по-добре е да предложиш нещо което не отговаря до такава степен на някое предпочитание. Не препоръчвай само популярни или известни книги - нека има разнообразие. Не препоръчвай една книга повече от веднъж на резултат."
      },
      {
        role: "user",
        content: `Обърни внимание на следните лични предпочитания: Любими жанрове: [[${genres}]; Емоционално състояние: [${userPreferences.moods}]; Любими автори: [${userPreferences.authors}]; Предпочитан регион на произход: [${userPreferences.origin}]; Теми, които ме интересуват: [${userPreferences.interests}]; Целева група: [${userPreferences.targetGroup}]; Предпочитам книги, които са ${userPreferences.pacing}. Нивото на задълбочаване на книгите трябва да бъде: [${userPreferences.depth}].`
      },
      {
        role: "user",
        content:
          "Събери подробна информация от Goodreads и представи данните в следния JSON формат: [{'title_en': string, 'title_bg': string, 'real_edition_title': 'точно име - автор - Goodreads', 'origin': string, 'reason': string, 'adaptations': string}, {още 4 препоръки...}]. Обектът трябва да бъде валиден за JavaScript JSON.parse() функцията. Полето \"origin\" описва произхода на книгата по региони, например: 'Руска литература', 'Българска литература', 'Европейска литература' и т.н. В полето \"reason\" трябва да се даде отговор на въпроса: 'Защо тази книга е подходяща за мен?' спрямо предпочитанията, които са посочени. Полето \"real_edition_title\" трябва да съдържа точното и пълното заглавие на изданието точно както е в Goodreads, което ще бъде използвано за директно търсене. Включи адаптации на книгите (ако има такива), като филми, сериали или театрални постановки, посочвайки имената на адаптациите и годините на издаване/представяне. Всички текстови стойности, включително заглавия, автори, описания, жанрове и произход, трябва да бъдат преведени на български език. Отговори само с валиден JSON обект без допълнителен текст или обяснения."
      }
    ]
  };
};

export const goodreadsBrainAnalysisPrompt = (
  brainWaveData: FilteredBrainData[]
) => {
  const brainWaveString = JSON.stringify(brainWaveData, null, 2);
  return {
    model: "gpt-4-turbo",
    messages: [
      {
        role: "system",
        content: `You are an AI that recommends books based on data from the 'NeuroSky MindWave Mobile 2: EEG Sensor' and gives a well argumented reason why the book is relevant based on the provided data. 
        The device provides insights into the user's brain activity, cognitive state and emotional levels by measuring EEG power spectrums (Delta, Theta, low and high Alpha, low and high Beta, low and high Gamma) 
        and using data from EEG algorithms - Attention and Mediation. Relying on both the brain wave data and the eeg algorithm data, provide a list of books, formatted in Bulgarian, with detailed justifications.
        You must recommend books that exist on Goodreads, ensuring that all titles and details correspond to real entries from Goodreads. 
        Inventing books or providing fictional information is absolutely prohibited.
        Return the result in JSON format as instructed.`
      },
      {
        role: "user",
        content: `Обърни внимание на следните данни за мозъчна активност:
        ${brainWaveString}.`
      },
      {
        role: "user",
        content:
          "Събери подробна информация от Goodreads и представи данните в следния JSON формат: [{'title_en': string, 'title_bg': string, 'real_edition_title': 'точно име - автор - Goodreads', 'origin': string, 'reason': string, 'adaptations': string}, {още 4 препоръки...}]. Обектът трябва да бъде валиден за JavaScript JSON.parse() функцията. Полето \"origin\" описва произхода на книгата по региони, например: 'Руска литература', 'Българска литература', 'Европейска литература' и т.н. В полето \"reason\" трябва да се даде отговор на въпроса: 'Защо тази книга е подходяща за мен, спрямо данните от устройството (EEG power spectrums - Alpha, Beta, Gamma... и EEG algorithms - Attention, Mediation), които са посочени?'. Полето \"real_edition_title\" трябва да съдържа точното и пълното заглавие на изданието точно както е в Goodreads, което ще бъде използвано за директно търсене. Включи адаптации на книгите (ако има такива), като филми, сериали или театрални постановки, посочвайки имената на адаптациите и годините на издаване/представяне. Всички текстови стойности, включително заглавия, автори, описания, жанрове и произход, трябва да бъдат преведени на български език. Отговори само с валиден JSON обект без допълнителен текст или обяснения."
      }
    ]
  };
};

export const goodreadsExampleResponse = `[
  {
      "title_en": "One of Us Is Lying",
      "title_bg": "Един от нас лъже",
      "real_edition_title": "One of Us Is Lying - Karen M. McManus - Goodreads",
      "origin": "Американска литература",
      "reason": "Книгата е с мистериозен сюжет и се фокусира върху дълбочинната разработка на героите, което отговаря на търсенето за бавна книга, идеална за тийнеджъри.",
      "adaptations": "Телевизионен сериал 'One of Us Is Lying', 2021"
  },
  {
      "title_en": "A Study in Charlotte",
      "title_bg": "Проучване върху Шарлот",
      "real_edition_title": "A Study in Charlotte - Brittany Cavallaro - Goodreads",
      "origin": "Американска литература",
      "reason": "Тази книга представя мистерия с развитие на героите и тийнеджърски акценти, което я прави подходяща за читатели, търсещи увлекателни личности и ясни сюжетни линии.",
      "adaptations": "Няма известни адаптации"
  },
  {
      "title_en": "Truly Devious",
      "title_bg": "Истински коварна",
      "real_edition_title": "Truly Devious - Maureen Johnson - Goodreads",
      "origin": "Американска литература",
      "reason": "Тази мистериозна книга е със средна степен на задълбочаване и основана на разгръщането на различни характери, подходяща за тийнеджъри, които обичат постепенното разкриване на историята.",
      "adaptations": "Няма известни адаптации"
  },
  {
      "title_en": "The Inheritance Games",
      "title_bg": "Игрите на наследството",
      "real_edition_title": "The Inheritance Games - Jennifer Lynn Barnes - Goodreads",
      "origin": "Американска литература",
      "reason": "Книгата предлага сложна мистерия, но е поднесена по начин, който е достъпен и разбираем за тийнеджери, със стабилно развитие на героите.",
      "adaptations": "Няма известни адаптации"
  },
  {
      "title_en": "We Were Liars",
      "title_bg": "Ние бяхме лъжци",
      "real_edition_title": "We Were Liars - E. Lockhart - Goodreads",
      "origin": "Американска литература",
      "reason": "Книгата е със среден ритъм и фокус върху взаимоотношенията между персонажите, представяйки дълбок мистериозен сюжет, подходящ за емоционално тъжни тийнеджъри.",
      "adaptations": "Адаптация в разработка"
  }
]`;
