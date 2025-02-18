import { FC, useEffect, useState, useCallback } from "react";
import AIAnalysisDashboard from "./Components/AIAnalysisDashboard";
import {
  F1ScoreData,
  PrecisionData,
  RecallData,
  RecommendationsAnalysis
} from "./aiAnalysator-types";
import RecommendationsAnalysesWidgets from "@/components/common/recommendationsAnalyses/recommendationsAnalyses";
import { Card } from "@/components/ui/card";
import FadeInWrapper from "@/components/common/loader/fadeinwrapper";
import {
  checkRelevanceForLastSavedRecommendations,
  getF1Score,
  getPrecisionTotal,
  getRecallTotal
} from "./helper_functions";
import { analyzeRecommendations } from "../helper_functions_common";
import ErrorCard from "@/components/common/error/error";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import UserPreferences from "@/components/common/userPreferences/userPreferences";

const AIAnalysator: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [precisionData, setPrecisionData] = useState<PrecisionData | null>(
    null
  );
  const [recallData, setRecallData] = useState<RecallData | null>(null);
  const [f1ScoreData, setF1ScoreData] = useState<F1ScoreData | null>(null);
  const [recommendationsAnalysis, setRecommendationsAnalysis] =
    useState<RecommendationsAnalysis>({
      relevantCount: 0,
      totalCount: 0,
      precisionValue: 0,
      precisionPercentage: 0,
      relevantRecommendations: []
    });
  const [showError, setShowError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      const token =
        localStorage.getItem("authToken") ||
        sessionStorage.getItem("authToken");
      if (!token) return;

      try {
        const lastSavedRecommendationsAndPreferences =
          await checkRelevanceForLastSavedRecommendations(token, setShowError);

        const {
          lastSavedRecommendations,
          relevanceResults,
          lastSavedUserPreferences
        } = lastSavedRecommendationsAndPreferences;

        if (
          lastSavedRecommendations.length > 0 &&
          relevanceResults.length > 0 &&
          lastSavedUserPreferences
        ) {
          const [precisionObject, recallObject] = await Promise.all([
            getPrecisionTotal(token, lastSavedUserPreferences),
            getRecallTotal(token, lastSavedUserPreferences)
          ]);

          const f1ScoreObject = await getF1Score(
            token,
            precisionObject.precision_exact,
            recallObject.recall_exact
          );

          setPrecisionData(precisionObject);
          setRecallData(recallObject);
          setF1ScoreData(f1ScoreObject);

          if (relevanceResults) {
            await analyzeRecommendations(
              lastSavedUserPreferences,
              lastSavedRecommendations,
              setRecommendationsAnalysis,
              false
            );
          }
        } else {
          setShowError(true);
        }
      } catch (error) {
        console.error("Error fetching AI analysis data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNext = useCallback(() => {
    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        recommendationsAnalysis?.relevantRecommendations.length
          ? (prevIndex + 1) %
            recommendationsAnalysis.relevantRecommendations.length
          : 0
      );
      setInTransition(false);
    }, 500);
  }, [recommendationsAnalysis]);

  const handlePrev = useCallback(() => {
    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        recommendationsAnalysis?.relevantRecommendations.length
          ? (prevIndex -
              1 +
              recommendationsAnalysis.relevantRecommendations.length) %
            recommendationsAnalysis.relevantRecommendations.length
          : 0
      );
      setInTransition(false);
    }, 500);
  }, [recommendationsAnalysis]);

  // Показване на съдържание само след като е дошъл отговорът от заявките
  const renderRecommendationsAnalysis =
    recommendationsAnalysis.relevantRecommendations.length > 0;

  const preferences = {
    id: 37,
    user_id: 1,
    preferred_genres_en: "Romance, Horror, Crime",
    preferred_genres_bg: "Романтичен, Ужаси, Криминален",
    mood: "",
    timeAvailability: "1 час",
    preferred_age: "",
    preferred_type: "Филм",
    preferred_actors: "Нямам предпочитания",
    preferred_directors: "Нямам предпочитания",
    preferred_countries: "Нямам предпочитания",
    preferred_pacing: "бързи с много напрежение",
    preferred_depth: "Средни - с ясни сюжетни линии",
    preferred_target_group: "Тийнейджъри",
    interests: null,
    date: "2024-10-31 08:21:09"
  };
  return (
    <FadeInWrapper>
      {!showError ? (
        <div className="p-[1.5rem]">
          <div className="z-10 max-w-6xl w-full mx-auto font-mono text-sm">
            <UserPreferences preferences={preferences} />
            <div className="text-center !text-lg box p-6 flex flex-col gap-6 !rounded-xl justify-center items-center">
              <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto">
                <h2 className="text-4xl opsilion text-defaulttextcolor dark:text-white/80">
                  Искате ли да знаете колко добре се е справил AI-ът с
                  генерирането на препоръки специално за Вас?
                </h2>
              </Card>
              <Card className="bg-white dark:bg-bodybg2/50 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 w-full rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto">
                <h2 className="text-xl text-defaulttextcolor dark:text-white/80">
                  За целта е препоръчително първо да се запознаете със следните
                  понятия:
                </h2>
              </Card>
              <div className="text-sm w-full">
                <Accordion type="single" collapsible className="space-y-4">
                  {/* Relevance */}
                  <AccordionItem value="relevance">
                    <AccordionTrigger className="opsilion">
                      🎯 Релевантност
                    </AccordionTrigger>
                    <AccordionContent>
                      Свойство, което дадена препоръка може да притежава. Дали
                      даден филм или сериал е{" "}
                      <span className="font-semibold">релевантен </span> се
                      определя спрямо това дали неговите характеристики като{" "}
                      <span className="font-semibold">
                        жанр, емоционално състояние, разполагаемо време за
                        гледане
                      </span>{" "}
                      и други се съобразяват с{" "}
                      <span className="font-semibold">ВАШИТЕ </span>{" "}
                      индивидуални потребителски предпочитания. Всичко това се
                      случва с помощта на{" "}
                      <span className="font-semibold">
                        Алгоритъма за релевантност
                      </span>
                      , описан по-надолу в страницата.
                    </AccordionContent>
                  </AccordionItem>

                  {/* Precision */}
                  <AccordionItem value="precision">
                    <AccordionTrigger className="opsilion">
                      ✅ Precision
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Измерва каква част от препоръките, които сте направили,
                        са <span className="font-semibold">наистина </span>{" "}
                        релевантни. Високата стойност на{" "}
                        <span className="font-semibold">Precision</span>{" "}
                        означава, че когато системата препоръчва нещо, то
                        вероятно ще бъде подходящо за вас.
                      </p>
                      <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                        <div className="flex items-center space-x-2 justify-center items-center">
                          <span className="font-semibold">Precision =</span>
                          <div className="text-center">
                            <p className="text-primary text-sm">
                              всички РЕЛЕВАНТНИ препоръки правени някога НА ВАС
                            </p>
                            <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                            <p className="text-secondary text-sm">
                              всички препоръки, които някога са правени НА ВАС
                            </p>
                          </div>
                        </div>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Recall */}
                  <AccordionItem value="recall">
                    <AccordionTrigger className="opsilion">
                      🔍 Recall
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Измерва каква част от всички препоръки, които са
                        определени като релевантни, са били препоръчани на{" "}
                        <span className="font-semibold">ВАС</span>. Високата
                        стойност на Recall означава, че системата{" "}
                        <span className="font-semibold">НЕ </span> пропуска{" "}
                        <span className="font-semibold">
                          важни (релевантни){" "}
                        </span>{" "}
                        препоръки, дори ако включва някои нерелевантни.
                      </p>
                      <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                        <div className="flex items-center space-x-2 justify-center items-center">
                          <span className="font-semibold">Recall =</span>
                          <div className="text-center">
                            <p className="text-primary text-sm">
                              всички РЕЛЕВАНТНИ препоръки правени някога НА ВАС
                            </p>
                            <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                            <p className="text-secondary text-sm">
                              всички препоръки, които са РЕЛЕВАНТНИ на ВАШИТЕ
                              предпочитания, измежду тези в цялата система
                            </p>
                          </div>
                        </div>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  {/* F1 Score */}
                  <AccordionItem value="f1-score">
                    <AccordionTrigger className="opsilion">
                      ⚖️ F1 Score
                    </AccordionTrigger>
                    <AccordionContent>
                      <p>
                        <span className="font-semibold">
                          Балансиран показател
                        </span>
                        , който комбинира стойностите на{" "}
                        <span className="font-semibold">Precision</span> и{" "}
                        <span className="font-semibold">Recall</span>,
                        показвайки колко добре системата намира точния баланс
                        между тях. Високият{" "}
                        <span className="font-semibold">F1 Score</span>{" "}
                        означава, че системата има добро представяне както по
                        отношение на{" "}
                        <span className="font-semibold">
                          точността на препоръките
                        </span>
                        , така и на
                        <span className="font-semibold">
                          покритието спрямо всички възможности
                        </span>
                        .
                      </p>
                      <Card className="bg-white dark:bg-bodybg2 dark:border-black/10 dark:text-defaulttextcolor/70 font-semibold text-xl p-4 rounded-md shadow-lg dark:shadow-xl text-center leading-relaxed mx-auto mt-5">
                        <div className="flex items-center space-x-2 justify-center items-center">
                          <span className="font-semibold">F1 Score =</span>
                          <div className="text-center">
                            <p className="text-primary text-sm">
                              2 x Precision x Recall
                            </p>
                            <div className="border-b border-gray-400 dark:border-gray-600 my-2"></div>
                            <p className="text-secondary text-sm">
                              Precision + Recall
                            </p>
                          </div>
                        </div>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </div>

            {precisionData && recallData && f1ScoreData && (
              <AIAnalysisDashboard
                precisionData={precisionData}
                recallData={recallData}
                f1ScoreData={f1ScoreData}
              />
            )}
            {renderRecommendationsAnalysis && (
              <RecommendationsAnalysesWidgets
                recommendationsAnalysis={recommendationsAnalysis}
                currentIndex={currentIndex}
                handlePrev={handlePrev}
                handleNext={handleNext}
                inTransition={inTransition}
                setInTransition={setInTransition}
                direction={direction}
              />
            )}
          </div>
        </div>
      ) : (
        <ErrorCard
          message="🔍 За да можете да разгледате колко добре се е справил AI-ът с
                генерирането на препоръки за вас, моля, първо генерирайте препоръки за филми и сериали."
          redirectUrl={`${
            import.meta.env.BASE_URL
          }app/recommendations/movies_series`}
          redirectText="Към нови препоръки"
        />
      )}
    </FadeInWrapper>
  );
};

export default AIAnalysator;
