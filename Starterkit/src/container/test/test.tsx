import { FC, Fragment, useState, useEffect } from "react";
import MovieCard from './moviecard';
import MoreInfo from './moreinfocard';
import loaderIcon from '../../assets/images/loader-icon.png';
import { Movie } from '../../types/types';

interface Test {}

const Test: FC<Test> = () => {
  const [type, setType] = useState("Филм");
  const [genres, setGenres] = useState<{ en: string; bg: string }[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [timeAvailability, setTimeAvailability] = useState("");
  const [actors, setActors] = useState("");
  const [directors, setDirectors] = useState("");
  const [interests, setInterests] = useState("");
  const [countries, setCountries] = useState("");
  const [pacing, setPacing] = useState("");
  const [depth, setDepth] = useState("");
  const [targetGroup, setTargetGroup] = useState("");

  const [submitCount, setSubmitCount] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMoreInfoOpen, setIsMoreInfoOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);;
  const [recommendationList, setRecommendationList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleBubbles, setVisibleBubbles] = useState({ 1: false, 2: false, 3: false });

  const typeOptions = ["Филм", "Сериал", "Нямам предпочитания"];

  const genreOptions = [
    { en: "Action", bg: "Екшън" },
    { en: "Adventure", bg: "Приключенски" },
    { en: "Animation", bg: "Анимация" },
    { en: "Biography", bg: "Биография" },
    { en: "Comedy", bg: "Комедия" },
    { en: "Crime", bg: "Криминален" },
    { en: "Documentary", bg: "Документален" },
    { en: "Drama", bg: "Драма" },
    { en: "Family", bg: "Семейни" },
    { en: "Fantasy", bg: "Фентъзи" },
    { en: "Film-Noir", bg: "Филм-ноар" },
    { en: "History", bg: "Исторически" },
    { en: "Horror", bg: "Ужаси" },
    { en: "Music", bg: "Музика" },
    { en: "Musical", bg: "Мюзикъл" },
    { en: "Mystery", bg: "Мистерия" },
    { en: "Romance", bg: "Романтичен" },
    { en: "Sci-Fi", bg: "Научна фантастика" },
    { en: "Sport", bg: "Спортен" },
    { en: "Thriller", bg: "Трилър" },
    { en: "War", bg: "Военен" },
    { en: "Western", bg: "Уестърн" }
  ];

  const moodOptions = [
    "Развълнуван/-на",
    "Любопитен/-на",
    "Тъжен/-на",
    "Изплашен/-на",
    "Щастлив/-а",
    "Спокоен/-йна",
    "Разочарован/-на",
    "Уморен/-на",
    "Нервен/-на",
    "Уверен/-на",
    "Разгневен/-на",
    "Стресиран/-на",
    "Съсредоточен/-на",
    "Благодарен/-на",
    "Носталгичен/-на",
    "Безразличен/-на",
    "Оптимистичен/-на",
    "Песимистичен/-на",
    "Празен/-на",
    "Весел/-а",
    "Смутен/-на",
    "Озадачен/-на",
    "Разтревожен/-на",
    "Вдъхновен/-на",
    "Досаден/-на"
  ];

  const timeAvailabilityOptions = [
    "1 час",
    "2 часа",
    "3 часа",
    "Нямам предпочитания"
  ];

  const pacingOptions = [
    "бавни, концентриращи се върху разкази на героите",
    "бързи с много напрежение",
    "Нямам предпочитания"
  ];
  const depthOptions = [
    "Лесни за проследяване - релаксиращи",
    "Средни - с ясни сюжетни линии",
    "Трудни - с много истории и терминологии, характерни за филма",
    "Нямам предпочитания"
  ];

  const targetGroupOptions = [
    "Деца",
    "Тийнейджъри",
    "Възрастни",
    "Семейни",
    "Семейство и деца",
    "Възрастни над 65",
    "Нямам предпочитания"
  ];

  const token =
    localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  const openAIKey = import.meta.env.VITE_OPENAI_API_KEY;

  const saveUserPreferences = async (date: string) => {
    try {
      const preferredGenresEn =
        genres.length > 0 ? genres.map((g) => g.en).join(", ") : null;
      const preferredGenresBg =
        genres.length > 0 ? genres.map((g) => g.bg).join(", ") : null;

      const response = await fetch(
        "http://localhost:5000/save-user-preferences",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            token: token,
            preferred_genres_en: preferredGenresEn,
            preferred_genres_bg: preferredGenresBg,
            mood: Array.isArray(moods) ? moods.join(", ") : null,
            timeAvailability,
            preferred_type: type,
            preferred_actors: actors,
            preferred_directors: directors,
            preferred_countries: countries,
            preferred_pacing: pacing,
            preferred_depth: depth,
            preferred_target_group: targetGroup,
            interests: interests || null,
            date: date
          })
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save recommendation");
      }

      const result = await response.json();
      console.log("Recommendation saved successfully:", result);
    } catch (error) {
      console.error("Error saving recommendation:", error);
    }
  };

  const saveRecommendationToDatabase = async (
    recommendation: any,
    date: string
  ) => {
    try {
      // Check if the recommendation object is valid
      if (!recommendation || typeof recommendation !== "object") {
        console.warn("No valid recommendation data found.");
        return; // Exit if the recommendation object is invalid
      }

      // Split the genre string into an array
      const genresEn = recommendation.genre
        ? recommendation.genre.split(", ")
        : null;

      // Translate genres from English to Bulgarian using the genreOptions array
      const genresBg = genresEn.map((genre: string) => {
        const matchedGenre = genreOptions.find(
          (option) => option.en.trim() === genre.trim()
        );
        return matchedGenre ? matchedGenre.bg : null;
      });

      const formattedRecommendation = {
        token,
        imdbID: recommendation.imdbID || null,
        title_en: recommendation.title || null,
        title_bg: recommendation.bgName || null,
        genre_en: genresEn.join(", "),
        genre_bg: genresBg.join(", "),
        reason: recommendation.reason || null,
        description: recommendation.description || null,
        year: recommendation.year || null,
        rated: recommendation.rated || null,
        released: recommendation.released || null,
        runtime: recommendation.runtime || null,
        director: recommendation.director || null,
        writer: recommendation.writer || null,
        actors: recommendation.actors || null,
        plot: recommendation.plot || null,
        language: recommendation.language || null,
        country: recommendation.country || null,
        awards: recommendation.awards || null,
        poster: recommendation.poster || null,
        ratings: recommendation.ratings || [],
        metascore: recommendation.metascore || null,
        imdbRating: recommendation.imdbRating || null,
        imdbVotes: recommendation.imdbVotes || null,
        type: recommendation.type || null,
        DVD: recommendation.DVD || null,
        boxOffice: recommendation.boxOffice || null,
        production: recommendation.production || null,
        website: recommendation.website || null,
        totalSeasons: recommendation.totalSeasons || null,
        date: date
      };

      // Log the formatted recommendation for debugging
      console.log("Formatted Recommendation:", formattedRecommendation);

      const response = await fetch(
        "http://localhost:5000/save-recommendation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formattedRecommendation) // Send the formatted recommendation directly
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save recommendation");
      }

      const result = await response.json();
      console.log("Recommendation saved successfully:", result);
    } catch (error) {
      console.error("Error saving recommendation:", error);
    }
  };

  const generateMovieRecommendations = async (date: string) => {
    try {
      const typeText = type === "Филм" ? "филма" : "сериала";
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openAIKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-2024-08-06",
            messages: [
              {
                role: "system",
                content: `You are an AI that recommends movies and series based on user preferences. Provide a list of movies and series, based on what the user has chosen to watch (movie or series), that match the user's taste and preferences, formatted in Bulgarian, with detailed justifications. Return the result in JSON format as instructed.`
              },
              {
                role: "user",
                content: `Препоръчай ми 5 ${typeText} за гледане, които да са съобразени с моите вкусове и предпочитания, а именно:
              Любими жанрове: ${genres.map((genre) => genre.bg)}.
              Емоционално състояние в този момент: ${moods}.
              Разполагаемо свободно време за гледане: ${timeAvailability}.
              Любими актьори: ${actors}.
              Любими филмови режисьори: ${directors}.
              Теми, които ме интересуват: ${interests}.
              Филмите/сериалите могат да бъдат от следните страни: ${countries}.
              Темпото (бързината) на филмите/сериалите предпочитам да бъде: ${pacing}.
              Предпочитам филмите/сериалите да са: ${depth}.
              Целевата група е: ${targetGroup}.
              Дай информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен. Форматирай своя response във валиден JSON формат по този начин:
              {
                "Официално име на ${typeText} на английски": {
                  "bgName": "Официално име на ${typeText} на български",
                  "description": "Описание на ${typeText}",
                  "reason": "Защо този филм/сериал е подходящ за мен?"
                },
                "Официално име на ${typeText} на английски": {
                  "bgName": "Официално име на ${typeText} на български",
                  "description": "Описание на ${typeText}",
                  "reason": "Защо този филм/сериал е подходящ за мен?"
                },
                // ...additional movies
              }. Не добавяй излишни кавички, думи или скоби, JSON формата трябва да е валиден за JavaScript JSON.parse() функцията.`
              }
            ]
          })
        }
      );

      console.log(
        "prompt: ",
        `Препоръчай ми 5 ${typeText} за гледане, които да са съобразени с моите вкусове и предпочитания, а именно:
              Любими жанрове: ${genres.map((genre) => genre.bg)}.
              Емоционално състояние в този момент: ${moods}.
              Разполагаемо свободно време за гледане: ${timeAvailability}.
              Любими актьори: ${actors}.
              Любими филмови режисьори: ${directors}.
              Теми, които ме интересуват: ${interests}.
              Филмите/сериалите могат да бъдат от следните страни: ${countries}.
              Темпото (бързината) на филмите/сериалите предпочитам да бъде: ${pacing}.
              Предпочитам филмите/сериалите да са: ${depth}.
              Целевата група е: ${targetGroup}.
              Дай информация за всеки отделен филм/сериал по отделно защо той е подходящ за мен. Форматирай своя response във валиден JSON формат по този начин:
              {
                "Официално име на ${typeText} на английски": {
                  "bgName": "Официално име на ${typeText} на български",
                  "description": "Описание на ${typeText}",
                  "reason": "Защо този филм/сериал е подходящ за мен?"
                },
                "Официално име на ${typeText} на английски": {
                  "bgName": "Официално име на ${typeText} на български",
                  "description": "Описание на ${typeText}",
                  "reason": "Защо този филм/сериал е подходящ за мен?"
                },
                // ...additional movies
              }. Не добавяй излишни кавички, думи или скоби, JSON формата трябва да е валиден за JavaScript JSON.parse() функцията.`
      );
      const responseData = await response.json(); // Get the JSON response
      const responseJson = responseData.choices[0].message.content;
      const unescapedData = responseJson
        .replace(/^```json([\s\S]*?)```$/, "$1")
        .replace(/^```JSON([\s\S]*?)```$/, "$1")
        .replace(/^```([\s\S]*?)```$/, "$1")
        .replace(/^'|'$/g, "") // Remove single quotes at the beginning and end
        .trim();
      console.log("unescapedData: ", unescapedData);
      const escapedData = decodeURIComponent(unescapedData);
      console.log("escapedData: ", escapedData);
      const recommendations = JSON.parse(escapedData);
      console.log("recommendations: ", recommendations);

      for (const movieTitle in recommendations) {
        const movieName = movieTitle; // Use the movie title as the search term

        // Step 3: Fetch IMDb ID via Google Custom Search API

        // 27427e59e17b74763, AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA
        // e59ceff412ebc4313, AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw
        let imdbData;

        try {
          // First attempt with the primary key and cx
          let imdbResponse = await fetch(
            `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyDqUez1TEmLSgZAvIaMkWfsq9rSm0kDjIw&cx=e59ceff412ebc4313&q=${encodeURIComponent(
              movieName
            )}`
          );
          imdbData = await imdbResponse.json();

          // Retry with secondary key and cx if the first response is invalid
          if (
            !imdbResponse.ok ||
            imdbResponse.status === 429 ||
            imdbData.error
          ) {
            imdbResponse = await fetch(
              `https://customsearch.googleapis.com/customsearch/v1?key=AIzaSyArE48NFh1befjjDxpSrJ0eBgQh_OmQ7RA&cx=27427e59e17b74763&q=${encodeURIComponent(
                movieName
              )}`
            );
            imdbData = await imdbResponse.json();
          }
        } catch (error) {
          console.error("Error fetching IMDb data:", error);
          continue; // Skip this movie if both requests fail
        }

        // Step 4: Extract the IMDb link from the search results
        if (Array.isArray(imdbData.items)) {
          const imdbLink = imdbData.items.find((item: { link: string }) =>
            item.link.includes("imdb.com/title/")
          );

          if (imdbLink) {
            const imdbUrl = imdbLink.link;
            const imdbId = imdbUrl.match(/title\/(tt\d+)\//)?.[1]; // Extract IMDb ID from the URL
            if (imdbId) {
              const omdbResponse = await fetch(
                `http://www.omdbapi.com/?apikey=89cbf31c&i=${imdbId}&plot=full`
              );
              const omdbData = await omdbResponse.json();

              console.log(
                `OMDb data for ${movieName}: ${JSON.stringify(
                  omdbData,
                  null,
                  2
                )}`
              );

              // Combine OMDb data and OpenAI data into a single object
              const recommendationData = {
                title: movieName,
                bgName: recommendations[movieTitle].bgName,
                description: recommendations[movieTitle].description,
                reason: recommendations[movieTitle].reason,
                year: omdbData.Year,
                rated: omdbData.Rated,
                released: omdbData.Released,
                runtime: omdbData.Runtime,
                genre: omdbData.Genre,
                director: omdbData.Director,
                writer: omdbData.Writer,
                actors: omdbData.Actors,
                plot: omdbData.Plot,
                language: omdbData.Language,
                country: omdbData.Country,
                awards: omdbData.Awards,
                poster: omdbData.Poster,
                ratings: omdbData.Ratings,
                metascore: omdbData.Metascore,
                imdbRating: omdbData.imdbRating,
                imdbVotes: omdbData.imdbVotes,
                imdbID: omdbData.imdbID,
                type: omdbData.Type,
                DVD: omdbData.DVD,
                boxOffice: omdbData.BoxOffice,
                production: omdbData.Production,
                website: omdbData.Website,
                totalSeasons: omdbData.totalSeasons
              };

              setRecommendationList((prevRecommendations) => [
                ...prevRecommendations,
                recommendationData
              ]);

              console.log("recommendationData: ", recommendationData);
              await saveRecommendationToDatabase(recommendationData, date);
            } else {
              console.log(`IMDb ID not found for ${movieName}`);
            }
          }
          // TO DO: Да се измисли какво да се прави ако не се намери филма/сериала
        }
      }

      // Process the API response (e.g., display the recommended movies)
    } catch (error) {
      console.error("Error generating recommendations:", error);
    }
  };
  console.log(submitCount);

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();

      if (submitCount >= 20) {
        alert("Достигнахте максималния брой предложения! :(");
        return;
      }
      if (
        !moods ||
        !timeAvailability ||
        !actors ||
        !directors ||
        !countries ||
        !pacing ||
        !depth ||
        !targetGroup
      ) {
        alert("Моля, попълнете всички задължителни полета!");
        return;
      }

      document.body.classList.add('no-scroll');
      const date = new Date().toISOString();

      event.preventDefault();
      generateMovieRecommendations(date);
      saveUserPreferences(date);

      setSubmitCount((prevCount) => prevCount + 1);
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
      document.body.classList.remove('no-scroll');
    };

    const closeMoreInfo = () => {
      setIsMoreInfoOpen(false);
      setIsModalOpen(true);
      setSelectedMovie(null);
    }

    const handleSeeMore = (movie: any) => {
      setSelectedMovie(movie);
      setIsMoreInfoOpen(true);
      setIsModalOpen(false);
    };

  const toggleGenre = (genre: { en: string; bg: string }) => {
    setGenres((prevGenres) =>
      prevGenres.find((g) => g.en === genre.en)
        ? prevGenres.filter((g) => g.en !== genre.en)
        : [...prevGenres, genre]
    );
  };

  const toggleMood = (mood: string) => {
    setMoods((prevMoods) =>
      prevMoods.includes(mood)
        ? prevMoods.filter((m) => m !== mood)
        : [...prevMoods, mood]
    );
  };

  useEffect(() => {
    if (recommendationList.length > 0) {
      setLoading(false);
    }
  }, [recommendationList]);
  console.log("recommendationList: ", recommendationList);

  const revealBubble = (bubbleIndex: number) => {
    setVisibleBubbles((prev) => ({ ...prev, [bubbleIndex]: true }));
  };

  return (
    <Fragment>
      <div className="flex flex-col items-center justify-start min-h-screen pt-20 page-header-breadcrumb">
        <div className="grid grid-cols-16 gap-1">
          <div className="xl:col-span-6 col-span-16">
            <div className="mb-4">
              <label className="questionTxt bubble left inflate-left">
                Какво търсите - филм или сериал?
              </label>
              <div className="bubble right inflate-right">
                <select
                  id="type"
                  className="form-control selectionList"
                  value={type}
                  onChange={(e) => {
                    setType(e.target.value);
                  }}
                  required
                >
                  {typeOptions.map((option) => (
                    <option key={option} value={option} className="selectionList">
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="questionTxt bubble left inflate-left">
                Кои жанрове Ви се гледат в момента?
              </label>
              <div className="bubble right multiCh MChitem inflate-right">
                {genreOptions.map((genre) => (
                  <div key={genre.en}>
                    <label>
                      <input
                        type="checkbox"
                        value={genre.en}
                        checked={
                          genres.find((g) => g.en === genre.en) !== undefined
                        }
                        onChange={() => {
                          toggleGenre(genre)
                          revealBubble(1);
                        }}
                        required
                      />
                      {genre.bg}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className={`questionTxt bubble left ${visibleBubbles[2] ? 'inflate-left' : ''}`}>
                Как се чувствате в момента?
              </label>
              <div className={`bubble right multiCh MChitem ${visibleBubbles[2] ? 'inflate-right' : ''}`}>
                {moodOptions.map((mood) => (
                  <div key={mood}>
                    <label>
                      <input
                        type="checkbox"
                        value={mood}
                        checked={moods.includes(mood)}
                        onChange={() => {
                          toggleMood(mood);
                        }}
                        required
                      />
                      {mood}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="questionTxt bubble left inflate-left">
                С какво време за гледане разполагате?
              </label>
              <div className="bubble right inflate-right">
                <select
                  id="timeAvailability"
                  className="form-control selectionList"
                  value={timeAvailability}
                  onChange={(e) => setTimeAvailability(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    Изберете време
                  </option>
                  {timeAvailabilityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="questionTxt bubble left inflate-left">
                Кои са вашите любими актьори?
              </label>
              <input
                type="text"
                className="form-control bubble right inflate-right"
                placeholder="Пример: Брад Пит, Леонардо ди Каприо, Ема Уотсън"
                value={actors}
                onChange={(e) => setActors(e.target.value)}
                required
              />
              <label className="bubble right checkboxLabel">
                <input
                  type="checkbox"
                  className="checkboxInput"
                  checked={actors === "Нямам предпочитания"}
                  onChange={() => {
                    setActors(
                      actors === "Нямам предпочитания"
                        ? ""
                        : "Нямам предпочитания"
                    );
                  }}
                  required
                />
                Нямам предпочитания
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="questionTxt bubble left inflate-left">
                Кои филмови режисьори предпочитате?
              </label>
              <input
                type="text"
                className="form-control bubble right bubble right inflate-right selectionList"
                id="formGroupExampleInput2"
                placeholder="Пример: Дъфър брадърс, Стивън Спилбърг, Джеки Чан"
                value={directors}
                onChange={(e) => setDirectors(e.target.value)}
                required
              />
              <label className="bubble right checkboxLabel">
                <input
                  type="checkbox"
                  className="checkboxInput"
                  checked={directors === "Нямам предпочитания"}
                  onChange={() => {
                    setDirectors(
                      directors === "Нямам предпочитания"
                        ? ""
                        : "Нямам предпочитания"
                    );
                  }}
                  required
                />
                Нямам предпочитания
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="questionTxt bubble left inflate-left">
                От кои страни предпочитате да е филмът/сериалът?
              </label>
              <input
                type="text"
                className="form-control bubble right bubble right inflate-right selectionList"
                id="formGroupExampleInput2"
                placeholder="Пример: България, САЩ"
                value={countries}
                onChange={(e) => setCountries(e.target.value)}
                required
              />
              <label className="bubble right checkboxLabel">
                <input
                  type="checkbox"
                  className="checkboxInput"
                  checked={countries === "Нямам предпочитания"}
                  onChange={() => {
                    setCountries(
                      countries === "Нямам предпочитания"
                        ? ""
                        : "Нямам предпочитания"
                    );
                  }}
                  required
                />
                Нямам предпочитания
              </label>
            </div>
            <div className="mb-4">
              <label htmlFor="pacing" className="questionTxt bubble left inflate-left">
                Филми/Сериали с каква бързина на развитие на сюжетното действие
                предпочитате?
              </label>
              <div className="bubble right inflate-right">
                <select
                  id="pacing"
                  className="form-control selectionList"
                  value={pacing}
                  onChange={(e) => setPacing(e.target.value)}
                  required
                >
                <option value="" disabled>
                  Изберете бързина на развитие
                </option>
                {pacingOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="depth" className="questionTxt bubble left inflate-left">
                Филми/Сериали с какво ниво на задълбочаване харесвате?
              </label>
              <div className="bubble right inflate-right">
                <select
                id="depth"
                className="form-control selectionList"
                value={depth}
                onChange={(e) => setDepth(e.target.value)}
                required
              >
                <option value="" disabled>
                  Изберете ниво на задълбочаване
                </option>
                {depthOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="targetGroup" className="questionTxt bubble left inflate-left">
                Каква е вашата целева група?
              </label>
              <div className="bubble right inflate-right">
                <select
                id="targetGroup"
                className="form-control selectionList"
                value={targetGroup}
                onChange={(e) => setTargetGroup(e.target.value)}
                required
              >
                <option value="" disabled>
                  Изберете целева група
                </option>
                {targetGroupOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              </div>
            </div>
            <div className="mb-4">
              <label htmlFor="formGroupExampleInput2" className="questionTxt bubble left inflate-left">
                Какви теми ви интересуват?
              </label>
              <div className="form-text">
                Предпочитате филм/сериал, който засяга определена историческа
                ера, държава или пък такъв, в който се изследва, разгадава
                мистерия или социален проблем? Дайте описание. Можете също така
                да споделите примери за филми/сериали, които предпочитате.
              </div>
              <textarea
                className="form-control bubble right"
                id="formGroupExampleInput2"
                placeholder="Опишете темите, които ви интересуват"
                value={interests}
                onChange={(e) => setInterests(e.target.value)}
                rows={4}
                maxLength={200}
              />
              <div className="text-right mt-2">
                <small>{`${interests.length} / 200`}</small>
              </div>
            </div>
                
            <div>
              <div className="ti-btn-list space-x-2 rtl:space-x-reverse mt-4">
                <button
                  type="button"
                  className={`ti-btn ti-btn-primary-gradient ti-btn-wave`}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
              
              {isMoreInfoOpen && selectedMovie && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                  <div className="box-body">
                    <MoreInfo
                      title={selectedMovie.title}
                      bgName={selectedMovie.bgName}
                      year={selectedMovie.year}
                      runtime={selectedMovie.runtime}
                      director={selectedMovie.director}
                      writer={selectedMovie.writer}
                      imdbRating={selectedMovie.imdbRating}
                      poster={selectedMovie.poster}
                      plot={selectedMovie.plot}
                      reason={selectedMovie.reason}
                      genre={selectedMovie.genre}
                      actors={selectedMovie.actors}
                      country={selectedMovie.country}
                      metascore={selectedMovie.metascore}
                      type={selectedMovie.type}
                      boxOffice={selectedMovie.boxOffice}
                      totalSeasons={selectedMovie.totalSeasons}
                    />
                  </div>
                  <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    onClick={closeMoreInfo}
                  >
                    ✕
                  </button>
                </div>
              )}

              {isModalOpen && (
              <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                <div className="modal-center p-6 w-full max-w-lg max-h-[80vh] relative overflow-y-auto bg-red-800 rounded-lg">
                  <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
                    onClick={closeModal}
                  >
                    ✕
                  </button>
                  {loading ? (
                    // Loading Icon
                    <div className="flex items-center justify-center animate-spin loader-img">
                      <img src={loaderIcon} alt="Loader Icon" />
                    </div>
                  ) : (
                    // Recommendations List
                    <div className="text-center modal-center">
                      <h2 className="text-xl font-semibold mb-4 text-white">
                        Нашите предложения:
                      </h2>
                      <div className="space-y-6">
                        {recommendationList.map((movie, index) => (
                          <MovieCard
                            key={index}
                            title={movie.title}
                            bgName={movie.bgName}
                            reason={movie.reason}
                            poster={movie.poster}
                            onSeeMore={() => handleSeeMore(movie)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Test;
