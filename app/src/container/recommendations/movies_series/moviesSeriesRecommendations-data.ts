import { BrainData } from "@/container/types_common";
import { MoviesSeriesUserPreferences } from "./moviesSeriesRecommendations-types";

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

export const timeAvailabilityOptions = [
  "1 час",
  "2 часа",
  "3 часа",
  "Нямам предпочитания"
];

export const ageOptions = [
  "Публикуван в последните 3 години",
  "Публикуван в последните 10 години",
  "Публикуван в последните 20 години",
  "Нямам предпочитания"
];

export const pacingOptions = [
  "бавни, концентриращи се върху разкази на героите",
  "бързи с много напрежение",
  "Нямам предпочитания"
];
export const depthOptions = [
  "Лесни за проследяване - релаксиращи",
  "Средни - с ясни сюжетни линии",
  "Трудни - с много истории и терминологии, характерни за филма/сериала",
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

export const moviesSeriesStandardPreferencesPrompt = (
  userPreferences: MoviesSeriesUserPreferences
) => {
  const {
    recommendationType,
    genres,
    moods,
    timeAvailability,
    age,
    actors,
    directors,
    interests,
    countries,
    pacing,
    depth,
    targetGroup
  } = userPreferences;

  const typeText = recommendationType === "Филм" ? "филма" : "сериала";

  return {
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: `You are an AI that recommends movies and series based on user preferences. Provide a list of movies and series, based on what the user has chosen to watch (movie or series), that match the user's taste and preferences, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
      },
      {
        role: "user",
        content: `Препоръчай ми 5 ${typeText} за гледане, които ЗАДЪЛЖИТЕЛНО да съвпадат с моите вкусове и предпочитания, а именно:
              Любими жанрове: ${genres.map((genre) => genre.bg)}.
              Емоционално състояние в този момент: ${moods}.
              Разполагаемо свободно време за гледане: ${timeAvailability}.
              Възрастта на ${typeText} задължително да бъде: ${age}
              Любими актьори: ${actors}.
              Любими филмови режисьори: ${directors}.
              Теми, които ме интересуват: ${interests}.
              Филмите/сериалите могат да бъдат от следните страни: ${countries}.
              Темпото (бързината) на филмите/сериалите предпочитам да бъде: ${pacing}.
              Предпочитам филмите/сериалите да са: ${depth}.
              Целевата група е: ${targetGroup}.
              Дай информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен.
              Задължително искам имената на филмите/сериалите да бъдат абсолютно точно както са официално на български език – така, както са известни сред публиката в България.
              Не се допуска буквален превод на заглавията от английски, ако официалното българско заглавие се различава от буквалния превод.
              Не препоръчвай 18+ филми/сериали.
              Форматирай своя response във валиден JSON формат по този начин:
              {
                'Официално име на ${typeText} на английски, както е прието да бъде': {
                  'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                  'description': 'Описание на ${typeText}',
                  'reason': 'Защо този филм/сериал е подходящ за мен?'
                },
                'Официално име на ${typeText} на английски, както е прието да бъде': {
                  'bgName': 'Официално име на ${typeText} на български, както е прието да бъде, а не буквален превод',
                  'description': 'Описание на ${typeText}',
                  'reason': 'Защо този филм/сериал е подходящ за мен?'
                },
                // ...additional movies
              }. Не добавяй излишни думи или скоби. Избягвай вложени двойни или единични кавички(кавички от един тип едно в друго, които да дават грешки на JSON.parse функцията). Увери се, че всички данни са правилно "escape-нати", за да не предизвикат грешки в JSON формата. 
              JSON формата трябва да е валиден за JavaScript JSON.parse() функцията.`
      }
    ]
  };
};

export const moviesSeriesBrainAnalysisPrompt = (brainWaveData: BrainData[]) => {
  const brainWaveString = JSON.stringify(brainWaveData, null, 2);
  return {
    model: "gpt-4o-2024-08-06",
    messages: [
      {
        role: "system",
        content: `You are an AI that recommends movies and series based on data from the 'NeuroSky MindWave Mobile 2: EEG Sensor'. The device provides insights into the user's brain activity, cognitive state, and emotional levels, such as focus, relaxation, stress, and creativity. Relying on this data, provide a list of movies and series, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
      },
      {
        role: "user",
        content: `Препоръчай ми 5 филма или сериала за гледане, които ЗАДЪЛЖИТЕЛНО да съвпадат с получените данни за мозъчната активност от устройството 'NeuroSky MindWave Mobile 2: EEG Sensor', а именно:
          ${brainWaveString}.
          Дай информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен.
          Задължително искам имената на филмите/сериалите да бъдат абсолютно точно както са официално на български език – така, както са известни сред публиката в България.
          Не се допуска буквален превод на заглавията от английски, ако официалното българско заглавие се различава от буквалния превод.
          Не препоръчвай 18+ филми/сериали.
          Форматирай своя response във валиден JSON формат по този начин:
          {
            'Официално име на филма или сериала на английски, както е прието да бъде': {
              'bgName': 'Официално име на филма или сериала на български, както е прието да бъде, а не буквален превод',
              'description': 'Описание на филма или сериала',
              'reason': 'Защо този филм/сериал е подходящ за мен?'
            },
            'Официално име на филма или сериала на английски, както е прието да бъде': {
              'bgName': 'Официално име на филма или сериала на български, както е прието да бъде, а не буквален превод',
              'description': 'Описание на филма или сериала',
              'reason': 'Защо този филм/сериал е подходящ за мен?'
            }
          }`
      }
    ]
  };
};
