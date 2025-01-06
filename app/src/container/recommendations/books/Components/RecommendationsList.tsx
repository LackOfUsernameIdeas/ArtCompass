import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { RecommendationsProps } from "../booksRecommendations-types";
import RecommendationCard from "./RecommendationCard";
import { PlotModal } from "./PlotModal";

export const RecommendationsList: FC<RecommendationsProps> = ({
  recommendationList,
  handleBookmarkClick,
  bookmarkedMovies
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const animationDuration = 500;

  if (!recommendationList.length) {
    return <div>No recommendations available.</div>;
  }

  const handleNext = () => {
    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendationList.length - 1 ? 0 : prevIndex + 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const handlePrevious = () => {
    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? recommendationList.length - 1 : prevIndex - 1
      );
      setIsExpanded(false);
      setInTransition(false);
    }, 500);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="relative flex items-center justify-between">
      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <svg
          onClick={handlePrevious}
          className="absolute top-1/2 transform -translate-y-1/2 text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200 md:left-[-4rem] lg:left-[-4rem] xl:left-[-6rem] 2xl:left-[-10rem]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "5rem",
            height: "5rem",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
          }}
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </CSSTransition>

      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames={`slide-${direction}`}
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <RecommendationCard
          recommendationList={recommendationList}
          currentIndex={currentIndex}
          isExpanded={isExpanded}
          openModal={openModal}
          handleBookmarkClick={handleBookmarkClick}
          bookmarkedMovies={bookmarkedMovies}
        />
      </CSSTransition>

      <CSSTransition
        in={!inTransition}
        timeout={animationDuration}
        classNames="arrows"
        onExited={() => setInTransition(false)}
        unmountOnExit
      >
        <svg
          onClick={handleNext}
          className="absolute top-1/2 transform -translate-y-1/2 text-6xl cursor-pointer hover:text-primary hover:scale-110 transition duration-200 md:right-[-4rem] lg:right-[-4rem] xl:right-[-6rem] 2xl:right-[-10rem]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            width: "5rem",
            height: "5rem",
            filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))"
          }}
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </CSSTransition>

      <CSSTransition
        in={isModalOpen}
        timeout={300}
        classNames="fade-no-transform"
        unmountOnExit
      >
        <PlotModal
          recommendationList={recommendationList}
          currentIndex={currentIndex}
          closeModal={closeModal}
        />
      </CSSTransition>
    </div>
  );
};
