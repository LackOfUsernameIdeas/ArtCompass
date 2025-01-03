import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./individualStats-types";
import { checkTokenValidity, fetchData } from "./helper_functions";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../components/common/loader/fadeinwrapper";
import { showNotification } from "../recommendations/helper_functions";
import Notification from "../../components/common/notification/Notification";
import { NotificationState } from "../recommendations/recommendations-types";
import ActorsDirectorsWritersRecommendationsTable from "./Components/ActorsDirectorsWritersRecommendationsTable";
import MoviesAndSeriesRecommendationsTable from "./Components/MoviesAndSeriesRecommendationsTable";
import GenresBarChart from "./Components/GenresBarChart";
import CountWidgets from "./Components/CountWidgets";

interface IndividualStatsProps {}

const IndividualStats: FC<IndividualStatsProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendations: {
      recommendationsCount: {
        movies: 0,
        series: 0
      },
      recommendations: []
    }, // Топ препоръки
    topGenres: [], // Топ жанрове
    sortedDirectorsByRecommendationCount: [], // Режисьори, сортирани по процъфтяване
    sortedActorsByRecommendationCount: [], // Актьори, сортирани по процъфтяване
    sortedWritersByRecommendationCount: [] // Сценаристи, сортирани по процъфтяване
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  const handleNotificationClose = () => {
    // Функция за затваряне на известията
    if (notification?.type === "error") {
      // Ако известието е от тип "грешка", пренасочване към страницата за вход
      navigate("/signin");
    }
    setNotification(null); // Зануляване на известието
  };

  useEffect(() => {
    const validateToken = async () => {
      // Функция за проверка валидността на потребителския токен
      const redirectUrl = await checkTokenValidity(); // Извикване на помощна функция за валидиране на токена
      if (redirectUrl) {
        // Ако токенът е невалиден, показване на известие
        showNotification(
          setNotification, // Функция за задаване на известие
          "Вашата сесия е изтекла. Моля, влезте в профила Ви отново.", // Съобщение за известието
          "error" // Типът на известието (грешка)
        );
      }
    };

    validateToken(); // Стартиране на проверката на токена при първоначално зареждане на компонента

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage

    if (token) {
      setLoading(true);
      fetchData(token, setData, setLoading); // Извличане на данни с помощта на fetchData функцията
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []);

  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  if (
    !data.topRecommendations.recommendations ||
    data.topRecommendations.recommendations.length === 0 ||
    !data.topGenres.length ||
    !data.sortedDirectorsByRecommendationCount.length ||
    !data.sortedActorsByRecommendationCount.length ||
    !data.sortedWritersByRecommendationCount.length
  ) {
    return (
      <FadeInWrapper>
        <div className="flex justify-center items-center bg-bodybg mt-[15rem] text-center p-6 rounded-lg shadow-xl">
          <p className="text-2xl font-extrabold text-defaulttextcolor drop-shadow-lg">
            🔍 За да можете да разгледате Вашите индивидуални статистики, моля,
            първо генерирайте препоръки. Това ще ни позволи да съберем
            необходимите данни и да Ви предоставим подробен анализ 📊, съобразен
            с Вашите предпочитания. ⚙️
          </p>
        </div>
      </FadeInWrapper>
    );
  }

  return (
    <FadeInWrapper>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      <Fragment>
        <div className="md:flex block items-center justify-between my-[1.5rem] page-header-breadcrumb">
          <div>
            <p className="font-semibold text-[1.125rem] text-defaulttextcolor dark:text-defaulttextcolor/70 !mb-0 "></p>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="xl:col-span-12 col-span-12">
            <div
              className="accordion accordionicon-left accordions-items-separate"
              id="accordioniconLeft"
            >
              <div
                className="hs-accordion-group"
                data-hs-accordion-always-open=""
              >
                <div
                  className="hs-accordion accordion-item overflow-hidden active"
                  id="hs-basic-with-title-and-arrow-stretched-heading-one"
                >
                  <button
                    className="hs-accordion-toggle accordion-button hs-accordion-active:text-primary hs-accordion-active:pb-3 group py-0 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-gray-800 transition hover:text-secondary dark:hs-accordion-active:text-primary dark:text-gray-200 dark:hover:text-secondary"
                    aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-one"
                    type="button"
                  >
                    Моите Топ Препоръки - Статистики
                    <svg
                      className="hs-accordion-active:hidden hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary block w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <svg
                      className="hs-accordion-active:block hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary hidden w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div
                    id="hs-basic-with-title-and-arrow-stretched-collapse-one"
                    className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                    aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
                  >
                    <div className="grid grid-cols-12 gap-x-6 mt-5 ml-5 mr-5">
                      <div className="xxl:col-span-6 col-span-12">
                        <MoviesAndSeriesRecommendationsTable
                          data={data.topRecommendations.recommendations}
                        />
                      </div>
                      <div className="xxl:col-span-6 col-span-12">
                        <ActorsDirectorsWritersRecommendationsTable
                          data={data}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-x-6 ml-5 mr-5">
                      <div className="xxl:col-span-6 col-span-12">
                        <GenresBarChart data={data} />
                      </div>
                      <div className="xxl:col-span-6 col-span-12">
                        <CountWidgets data={data} />
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="hs-accordion accordion-item overflow-hidden"
                  id="hs-basic-with-title-and-arrow-stretched-heading-two"
                >
                  <button
                    className="hs-accordion-toggle accordion-button hs-accordion-active:text-primary hs-accordion-active:pb-3 group py-0 inline-flex items-center justify-between gap-x-3 w-full font-semibold text-start text-gray-800 transition hover:text-secondary dark:hs-accordion-active:text-primary dark:text-gray-200 dark:hover:text-secondary"
                    aria-controls="hs-basic-with-title-and-arrow-stretched-collapse-two"
                    type="button"
                  >
                    Моята Колекция за Гледане - Статистики
                    <svg
                      className="hs-accordion-active:hidden hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary block w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 5L8.16086 10.6869C8.35239 10.8637 8.64761 10.8637 8.83914 10.6869L15 5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <svg
                      className="hs-accordion-active:block hs-accordion-active:text-primary hs-accordion-active:group-hover:text-primary hidden w-3 h-3 text-gray-600 group-hover:text-secondary dark:text-[#8c9097] dark:text-white/50"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2 11L8.16086 5.31305C8.35239 5.13625 8.64761 5.13625 8.83914 5.31305L15 11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                  <div
                    id="hs-basic-with-title-and-arrow-stretched-collapse-two"
                    className="hs-accordion-content accordion-body hidden w-full overflow-hidden transition-[height] duration-300"
                    aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-two"
                  >
                    <div className="grid grid-cols-12 gap-x-6 mt-5 ml-5 mr-5">
                      <div className="xxl:col-span-6 col-span-12">
                        <MoviesAndSeriesRecommendationsTable
                          data={data.topRecommendations.recommendations}
                        />
                      </div>
                      <div className="xxl:col-span-6 col-span-12">
                        <ActorsDirectorsWritersRecommendationsTable
                          data={data}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-12 gap-x-6 ml-5 mr-5">
                      <div className="xxl:col-span-6 col-span-12">
                        <GenresBarChart data={data} />
                      </div>
                      <div className="xxl:col-span-6 col-span-12">
                        <CountWidgets data={data} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default IndividualStats;
