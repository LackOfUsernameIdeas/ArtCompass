import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./watchlist-types";
import { fetchData } from "./helper_functions";
import {
  checkRecommendationExistsInWatchlist,
  validateToken
} from "../../helper_functions_common";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";
import MoviesAndSeriesTable from "./Components/MoviesAndSeriesTable";
import BookmarkAlert from "./Components/BookmarkAlert";
import ErrorCard from "../../../components/common/error/error";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

const Watchlist: FC = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendationsWatchlist: {
      savedCount: {
        movies: 0,
        series: 0
      },
      watchlist: []
    } // Запазени филми/сериали в списък за гледане
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)
  const [bookmarkedMovies, setBookmarkedMovies] = useState<{
    [key: string]: any;
  }>({});
  const [alertVisible, setAlertVisible] = useState(false); // To control alert visibility
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false); // Track current bookmark status

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
    validateToken(setNotification); // Стартиране на проверката на токена при първоначално зареждане на компонента

    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken"); // Вземане на токен от localStorage или sessionStorage

    if (token) {
      setLoading(true);
      fetchData(token, setData, setLoading); // Извличане на данни с помощта на fetchData функцията
      console.log("fetching"); // Лог за следене на извличането на данни
    }
  }, []);

  useEffect(() => {
    const loadBookmarkStatus = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (token) {
        const updatedBookmarks: { [key: string]: any } = {};
        if (data.topRecommendationsWatchlist.watchlist) {
          for (const movie of data.topRecommendationsWatchlist.watchlist) {
            try {
              const isBookmarked = await checkRecommendationExistsInWatchlist(
                movie.imdbID,
                token
              );
              if (isBookmarked) {
                updatedBookmarks[movie.imdbID] = movie;
              }
            } catch (error) {
              console.error("Error checking watchlist status:", error);
            }
          }
        }
        setBookmarkedMovies(updatedBookmarks);
      }
    };

    loadBookmarkStatus();
  }, [data.topRecommendationsWatchlist.watchlist]);

  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  console.log("data: ", data);

  if (
    !data.topRecommendationsWatchlist.watchlist ||
    data.topRecommendationsWatchlist.watchlist.length === 0
  ) {
    return (
      <ErrorCard
        message="🔍 За да можете да разгледате Вашия списък за гледане, моля, първо генерирайте филми или сериали и ги добавете в списъка! 📋"
        redirectUrl={`${
          import.meta.env.BASE_URL
        }app/recommendations/movies_series`}
        redirectText="Генерирайте нови препоръки за филми/сериали"
      />
    );
  }

  const handleDismiss = () => {
    setAlertVisible(false);
  };

  return (
    <FadeInWrapper>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={handleNotificationClose}
        />
      )}
      {alertVisible && (
        <BookmarkAlert
          isBookmarked={currentBookmarkStatus}
          onDismiss={handleDismiss}
        />
      )}
      <Fragment>
        <div className="mt-[1.5rem]">
          <div className="text-center !text-lg box p-6 flex flex-col md:flex-row gap-6 justify-center items-stretch">
            <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed md:w-1/2 mx-auto flex-grow flex items-center justify-center">
              <h2 className="text-lg font-Equilibrist text-defaulttextcolor dark:text-white/80">
                В тази страница можете да разгледате подробна информация за
                добавените от вас филми и сериали в{" "}
                <span className="font-bold text-primary">
                  списъка ви за гледане
                </span>
                !
              </h2>
            </Card>
            <div className="md:w-1/2 text-sm">
              <Accordion type="single" collapsible className="space-y-4">
                {/* Metascore */}
                <AccordionItem value="metascore">
                  <AccordionTrigger className="opsilion">
                    💡Metascore рейтинг
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    <span className="font-semibold">Metascore</span> е оценка от
                    платформата{" "}
                    <span className="font-semibold">Metacritic</span>, която
                    събира рецензии от критици и ги преобразува в обща числова
                    стойност{" "}
                    <span className="font-semibold">(от 0 до 100)</span>.{" "}
                    <span className="font-semibold">
                      Средният Metascore рейтинг
                    </span>{" "}
                    е усреднената стойност на тези оценки за даден/и филм/и.
                  </AccordionContent>
                </AccordionItem>

                {/* Боксофис */}
                <AccordionItem value="boxoffice">
                  <AccordionTrigger className="opsilion">
                    💰 Боксофис
                  </AccordionTrigger>
                  <AccordionContent className="pl-4">
                    Общата сума на приходите от продажба на билети в
                    киносалоните. Измерва се в{" "}
                    <span className="font-semibold">
                      милиони или милиарди долари
                    </span>{" "}
                    и е ключов показател за търговския успех на филма.
                  </AccordionContent>
                </AccordionItem>

                {/* Просперитет */}
                <AccordionItem value="prosperity">
                  <AccordionTrigger className="opsilion">
                    🎉 Просперитетен рейтинг
                  </AccordionTrigger>
                  <AccordionContent className="px-5 py-3 space-y-3">
                    <p>
                      <strong className="text-lg">Просперитетът </strong>
                      се получава като се изчисли сборът на стойностите на
                      няколко критерии. За всеки критерий се задава определено
                      процентно отношение, което отразява неговата важност
                      спрямо останалите:
                    </p>
                    <ul className="list-disc coollist pl-6 pt-3 space-y-1">
                      <li>
                        <strong>30%</strong> за спечелени награди
                      </li>
                      <li>
                        <strong>25%</strong> за номинации
                      </li>
                      <li>
                        <strong>15%</strong> за приходите от боксофис
                      </li>
                      <li>
                        <strong>10%</strong> за Метаскор
                      </li>
                      <li>
                        <strong>10%</strong> за IMDb рейтинг
                      </li>
                      <li>
                        <strong>10%</strong> за Rotten Tomatoes рейтинг
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>

          <MoviesAndSeriesTable
            type="watchlist"
            data={data.topRecommendationsWatchlist.watchlist}
            setBookmarkedMovies={setBookmarkedMovies}
            setCurrentBookmarkStatus={setCurrentBookmarkStatus}
            setAlertVisible={setAlertVisible}
            bookmarkedMovies={bookmarkedMovies}
          />
        </div>
      </Fragment>
    </FadeInWrapper>
  );
};

export default Watchlist;
