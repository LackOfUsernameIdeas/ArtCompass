import { FC, useEffect, useState } from "react";
import { Quiz } from "./Components/Quiz";
import { useNavigate } from "react-router-dom";
import { checkTokenValidity } from "../../helper_functions_common";
import {
  removeFromReadlist,
  saveToReadlist,
  showNotification
} from "../../helper_functions_common";
import FadeInWrapper from "../../../components/common/loader/fadeinwrapper";
import Notification from "../../../components/common/notification/Notification";
import { NotificationState } from "./booksRecommendations-types";
import BookmarkAlert from "./Components/BookmarkAlert";

interface BooksRecommendationsProps {}

const BooksRecommendations: FC<BooksRecommendationsProps> = () => {
  const navigate = useNavigate();
  const [notification, setNotification] = useState<NotificationState | null>(
    null // Състояние за съхраняване на текущото известие (съобщение и тип)
  );

  const [bookmarkedBooks, setBookmarkedBooks] = useState<{
    [key: string]: any;
  }>({});

  const [alertVisible, setAlertVisible] = useState(false); // To control alert visibility
  const [currentBookmarkStatus, setCurrentBookmarkStatus] = useState(false); // Track current bookmark status

  useEffect(() => {
    const validateToken = async () => {
      const redirectUrl = await checkTokenValidity();
      if (redirectUrl) {
        showNotification(
          setNotification,
          "Вашата сесия е изтекла. Моля, влезте в профила Ви отново.",
          "error"
        );
      }
    };

    validateToken();
  }, []);

  const handleNotificationClose = () => {
    if (notification?.type === "error") {
      navigate("/signin");
    }
    setNotification(null);
  };

  const handleBookmarkClick = (book: {
    google_books_id: string;
    [key: string]: any;
  }) => {
    setBookmarkedBooks((prev) => {
      const isBookmarked = !!prev[book.google_books_id];
      const updatedBookmarks = { ...prev };
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");

      if (isBookmarked) {
        // Remove the book from bookmarks if it's already bookmarked
        delete updatedBookmarks[book.google_books_id];

        removeFromReadlist(book.google_books_id, token).catch((error) => {
          console.error("Error removing from watchlist:", error);
        });
      } else {
        // Add the book to bookmarks if it's not already bookmarked
        updatedBookmarks[book.google_books_id] = book;

        saveToReadlist(book, token).catch((error) => {
          console.error("Error saving to watchlist:", error);
        });
      }

      setCurrentBookmarkStatus(!isBookmarked); // Update the current bookmark status
      setAlertVisible(true); // Show the alert

      return updatedBookmarks; // Return the updated bookmarks object
    });
  };
  console.log("bookmarkedBooks: ", bookmarkedBooks);

  const handleDismiss = () => {
    setAlertVisible(false);
  };

  return (
    <>
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
      <FadeInWrapper>
        <Quiz
          bookmarkedBooks={bookmarkedBooks}
          handleBookmarkClick={handleBookmarkClick}
          setBookmarkedBooks={setBookmarkedBooks}
        />
      </FadeInWrapper>
    </>
  );
};

export default BooksRecommendations;
