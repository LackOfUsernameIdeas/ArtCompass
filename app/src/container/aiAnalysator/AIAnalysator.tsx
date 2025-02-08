import { FC, useState } from "react";
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

const precisionData: PrecisionData = {
  precision_exact: 0.2932098765432099,
  precision_fixed: 0.29,
  precision_percentage: 29.32,
  relevant_recommendations_count: 95,
  total_recommendations_count: 324
};

const recallData: RecallData = {
  recall_exact: 0.8260869565217391,
  recall_fixed: 0.83,
  recall_percentage: 82.61,
  relevant_user_recommendations_count: 95,
  relevant_platform_recommendations_count: 115,
  total_user_recommendations_count: 324,
  total_platform_recommendations_count: 380
};

const f1ScoreData: F1ScoreData = {
  f1_score_exact: 0.6679841897233201,
  f1_score_fixed: 0.67,
  f1_score_percentage: 66.8
};

const recommendationsAnalysis: RecommendationsAnalysis = {
  relevantCount: 4,
  totalCount: 5,
  precisionValue: 0.8,
  precisionPercentage: 80,
  relevantRecommendations: [
    {
      imdbID: "tt10986410",
      title_en: "Ted Lasso",
      title_bg: "Тед Ласо",
      isRelevant: true,
      relevanceScore: 5,
      criteriaScores: {
        genres: 0,
        type: 1,
        mood: 1,
        timeAvailability: 1,
        preferredAge: 1,
        targetGroup: 1
      }
    },
    {
      imdbID: "tt0758745",
      title_en: "Friday Night Lights",
      title_bg: "Светлините на града: Петък вечер",
      isRelevant: true,
      relevanceScore: 5,
      criteriaScores: {
        genres: 0,
        type: 1,
        mood: 1,
        timeAvailability: 1,
        preferredAge: 1,
        targetGroup: 1
      }
    },
    {
      imdbID: "tt3398540",
      title_en: "Haikyu!!",
      title_bg: "Хайкю!!",
      isRelevant: true,
      relevanceScore: 5,
      criteriaScores: {
        genres: 0,
        type: 1,
        mood: 1,
        timeAvailability: 1,
        preferredAge: 1,
        targetGroup: 1
      }
    },
    {
      imdbID: "tt2891574",
      title_en: "Ballers",
      title_bg: "Играчи",
      isRelevant: true,
      relevanceScore: 5,
      criteriaScores: {
        genres: 0,
        type: 1,
        mood: 1,
        timeAvailability: 1,
        preferredAge: 1,
        targetGroup: 1
      }
    },
    {
      imdbID: "tt7221388",
      title_en: "Cobra Kai",
      title_bg: "Кобра Кай",
      isRelevant: true,
      relevanceScore: 5,
      criteriaScores: {
        genres: 0,
        type: 1,
        mood: 1,
        timeAvailability: 1,
        preferredAge: 1,
        targetGroup: 1
      }
    }
  ]
};

const AIAnalysator: FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inTransition, setInTransition] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  // const [recommendationsAnalysis, setRecommendationsAnalysis] =
  //   useState<RecommendationsAnalysis>({
  //     relevantCount: 0,
  //     totalCount: 0,
  //     precisionValue: 0,
  //     precisionPercentage: 0,
  //     relevantRecommendations: []
  //   });

  const handleNext = () => {
    setDirection("right");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === recommendationsAnalysis.relevantRecommendations.length - 1
          ? 0
          : prevIndex + 1
      );
      setInTransition(false);
    }, 500);
  };

  const handlePrev = () => {
    setDirection("left");
    setInTransition(true);

    setTimeout(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0
          ? recommendationsAnalysis.relevantRecommendations.length - 1
          : prevIndex - 1
      );
      setInTransition(false);
    }, 500);
  };

  return (
    <FadeInWrapper>
      <div className="p-[1.5rem]">
        <div className="z-10 max-w-5xl w-full mx-auto font-mono text-sm">
          <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center">
            <h2 className="!text-3xl text-defaulttextcolor dark:text-white/80">
              Искате ли да знаете колко добре се е справил AI-ът с генерирането
              на препоръки за филми и сериали?
            </h2>
            <hr className="my-4 border-defaulttextcolor/70" />
            <p className="text-gray-600 !text-lg">
              Примерно описание...Ако намерите някакъв проблем в нашето
              приложение или имате препоръки, напишете ни и ние ще отговорим
              възможно най-бързо!
            </p>
          </Card>
          <AIAnalysisDashboard
            precisionData={precisionData}
            recallData={recallData}
            f1ScoreData={f1ScoreData}
          />
          <RecommendationsAnalysesWidgets
            recommendationsAnalysis={recommendationsAnalysis}
            currentIndex={currentIndex}
            handlePrev={handlePrev}
            handleNext={handleNext}
            inTransition={inTransition}
            setInTransition={setInTransition}
            direction={direction}
          />
        </div>
      </div>
    </FadeInWrapper>
  );
};

export default AIAnalysator;
