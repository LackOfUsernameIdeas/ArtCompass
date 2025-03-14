import { FC, useState } from "react";
import { CSSTransition } from "react-transition-group";

export const BrainAnalysisQuestions = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(true);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  // Example questions for brain analysis
  const questions = [
    {
      question: "Analyzing your emotional response to drama",
      description:
        "The device is measuring your brain's reaction to dramatic scenes",
      image: "example image 1"
    },
    {
      question: "Examining your response to comedy",
      description:
        "The device is detecting patterns in your response to humorous content",
      image: "example image 2"
    },
    {
      question: "Testing your engagement with action sequences",
      description:
        "The system is tracking how your brain processes fast-paced content",
      image: "example image 3"
    },
    {
      question: "Analyzing your attention to detail",
      description:
        "The device is measuring how your brain focuses on visual details",
      image: "example image 4"
    },
    {
      question: "Examining your emotional memory connections",
      description:
        "The system is detecting how your brain connects emotions to memories",
      image: "example image 5"
    }
  ];

  const totalQuestions = questions.length;
  const currentQuestion = questions[currentQuestionIndex];

  // Function to handle moving to the next question
  const handleNext = () => {
    setShowQuestion(false);
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
      } else {
        setIsAnalysisComplete(true);
      }
      setShowQuestion(true);
    }, 500);
  };

  return (
    <div>
      <CSSTransition
        in={showQuestion}
        timeout={500}
        classNames="fade"
        unmountOnExit
      >
        <div className="w-full max-w-4xl">
          {isAnalysisComplete ? (
            <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
              <h2 className="text-xl font-semibold break-words">
                Brain Analysis Complete
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                Your brain profile has been analyzed. Here are your personalized
                recommendations.
              </p>
              <div className="flex justify-center mt-6">
                <div className="next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-4 cursor-pointer hover:scale-105 transition-all duration-300">
                  View Recommendations
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="question bg-opacity-70 border-2 text-white rounded-lg p-4 glow-effect transition-all duration-300">
                <h2 className="text-xl font-semibold break-words">
                  {currentQuestion.question}
                </h2>
                <p className="text-sm text-gray-500 mt-2">
                  {currentQuestion.description}
                </p>
              </div>

              {/* Display example image div */}
              <div className="mt-8 border-2 rounded-lg p-4 bg-opacity-50 bg-black text-white">
                <div className="flex justify-center items-center h-64 bg-gray-800 rounded-lg">
                  <p className="text-lg text-center">{currentQuestion.image}</p>
                </div>
                <div className="mt-4 flex justify-center">
                  <div className="h-4 w-full max-w-md bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-secondary transition-all duration-3000 ease-linear"
                      style={{
                        width: `${
                          ((currentQuestionIndex + 1) / totalQuestions) * 100
                        }%`
                      }}
                    ></div>
                  </div>
                </div>
                <p className="text-center mt-2 text-gray-400">
                  Analyzing brain responses... {currentQuestionIndex + 1}/
                  {totalQuestions}
                </p>
              </div>

              {/* Next button similar to QuizQuestions */}
              <div
                onClick={handleNext}
                className="next glow-next bg-opacity-70 text-white font-bold rounded-lg p-6 mt-6 flex justify-center items-center transition-all duration-300 ease-in-out transform opacity-100 cursor-pointer hover:scale-105"
              >
                {currentQuestionIndex === totalQuestions - 1
                  ? "Complete Analysis"
                  : "Next Question"}
              </div>
            </>
          )}
        </div>
      </CSSTransition>
    </div>
  );
};
