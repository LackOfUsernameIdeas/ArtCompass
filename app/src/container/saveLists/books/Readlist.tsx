import { FC, Fragment, useEffect, useState } from "react";
import { DataType } from "./readlist-types";
import { fetchData, handleBookmarkClick } from "./helper_functions";
import {
  checkRecommendationExistsInReadlist,
  validateToken
} from "../../helper_functions_common";
import { useNavigate } from "react-router-dom";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "../../types_common";
import BooksTable from "./Components/BooksTable";
import BookmarkAlert from "./Components/BookmarkAlert";
import ErrorCard from "../../../components/common/error/error";

interface ReadlistProps {}

const Readlist: FC<ReadlistProps> = () => {
  // Състояния за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    topRecommendationsReadlist: [] // Запазени книги в списък за четене
  });

  const [notification, setNotification] = useState<NotificationState | null>(
    null
  ); // Състояние за показване на известия (например съобщения за грешки, успехи или предупреждения)
  const [bookmarkedBooks, setBookmarkedBooks] = useState<{
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
        if (data.topRecommendationsReadlist) {
          for (const book of data.topRecommendationsReadlist) {
            try {
              const isBookmarked = await checkRecommendationExistsInReadlist(
                import.meta.env.VITE_BOOKS_SOURCE === "GoogleBooks"
                  ? book.google_books_id
                  : book.goodreads_id,
                token
              );
              if (isBookmarked) {
                updatedBookmarks[
                  import.meta.env.VITE_BOOKS_SOURCE === "GoogleBooks"
                    ? book.google_books_id
                    : book.goodreads_id
                ] = book;
              }
            } catch (error) {
              console.error("Error checking readlist status:", error);
            }
          }
        }
        setBookmarkedBooks(updatedBookmarks);
      }
    };

    loadBookmarkStatus();
  }, [data.topRecommendationsReadlist]);

  if (loading) {
    return (
      <FadeInWrapper loadingTimeout={30000}>
        <div></div>
      </FadeInWrapper>
    );
  }

  console.log("data: ", data);

  if (
    !data.topRecommendationsReadlist ||
    data.topRecommendationsReadlist.length === 0
  ) {
    return (
      <ErrorCard
        message="🔍 За да можете да разгледате Вашите списъци, моля, първо генерирайте препоръки. 
          Това ще ни позволи да съберем необходимите данни и да Ви предоставим 
          подробен анализ 📊, съобразен с Вашите предпочитания. ⚙️"
      />
    );
  }

  const handleDismiss = () => {
    setAlertVisible(false);
  };

  console.log("data", data);
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
                    id="hs-basic-with-title-and-arrow-stretched-collapse-one"
                    className="hs-accordion-content w-full overflow-hidden transition-[height] duration-300"
                    aria-labelledby="hs-basic-with-title-and-arrow-stretched-heading-one"
                  >
                    <div className="grid grid-cols-12 gap-x-6 mt-5 ml-5 mr-5">
                      <BooksTable
                        data={data.topRecommendationsReadlist}
                        handleBookmarkClick={handleBookmarkClick}
                        bookmarkedBooks={bookmarkedBooks}
                      />
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

export default Readlist;
