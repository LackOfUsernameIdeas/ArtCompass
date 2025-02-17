import { FC, Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import store from "../../redux/store";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Navbar2 from "./sidemenu";
import { Card } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";
import OtherStatsWidgetCardsComponents from "./components/OtherStatsWidgetCardsComponents";
import { DataType } from "./landing-types";
import { fetchData } from "./helper_functions";
import AIStatsWidgetCardsComponent from "./components/AIStatsWidgetCardsComponents";
import { getAverageMetrics } from "../helper_functions_common";

interface LandingProps {}

const Landing: FC<LandingProps> = ({ ThemeChanger }: any) => {
  // Състояние за задържане на извлечени данни
  const [data, setData] = useState<DataType>({
    usersCount: [], // Броя на потребителите
    topGenres: [], // Топ жанрове
    totalAwards: [], // Общо награди
    averageBoxOfficeAndScores: [], // Среден боксофис и оценки
    averagePrecisionPercentage: "", // Средна прецизност в проценти
    averagePrecisionLastRoundPercentage: "", // Средна прецизност за последния кръг в проценти
    averageRecallPercentage: "", // Среден Recall в проценти
    averageF1ScorePercentage: "" // Среден F1 резултат в проценти
  });

  // useEffect за извличане на данни, когато компонентът се зареди за първи път
  useEffect(() => {
    const fetchDataAndUpdate = async () => {
      fetchData(setData); // Извличаме данни с помощта на функцията fetchData

      try {
        const averageMetrics = await getAverageMetrics(); // Изчакваме да получим данните
        setData((prevData) => ({
          ...prevData,
          averagePrecision: averageMetrics.average_precision, // Обновяваме с новите данни
          averagePrecisionPercentage:
            averageMetrics.average_precision_percentage,
          averagePrecisionLastRound:
            averageMetrics.average_precision_last_round,
          averagePrecisionLastRoundPercentage:
            averageMetrics.average_precision_last_round_percentage,
          averageRecall: averageMetrics.average_recall,
          averageRecallPercentage: averageMetrics.average_recall_percentage,
          averageF1Score: averageMetrics.average_f1_score,
          averageF1ScorePercentage: averageMetrics.average_f1_score_percentage
        }));
      } catch (error) {
        console.error("Error fetching average metrics:", error);
      }
    };

    fetchDataAndUpdate();
  }, []); // Празен масив - изпълнява се само веднъж при зареждане на компонента

  useEffect(() => {
    const rootDiv = document.getElementById("root");
    if (rootDiv) {
    }
    return () => {
      if (rootDiv) {
        rootDiv.className = "";
      }
    };
  }, []);

  // Функция за управление на залепващия елемент при скролиране
  const Topup = () => {
    // Ако скролът е по-голям от 30px и има елемент с клас "landing-body"
    if (window.scrollY > 30 && document.querySelector(".landing-body")) {
      const Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        // Добавя класа "sticky-pin" към всички елементи с клас "sticky"
        e.classList.add("sticky-pin");
      });
    } else {
      const Scolls = document.querySelectorAll(".sticky");
      Scolls.forEach((e) => {
        // Премахва класа "sticky-pin" от всички елементи с клас "sticky"
        e.classList.remove("sticky-pin");
      });
    }
  };

  // Добавя слушател за събитие за скролиране на прозореца
  window.addEventListener("scroll", Topup);

  // Функция за затваряне на менюто на мобилни устройства
  function menuClose() {
    // Получава текущото състояние от Redux store
    const theme = store.getState();
    // Ако ширината на прозореца е по-малка или равна на 992px (мобилно устройство)
    if (window.innerWidth <= 992) {
      // Изпраща действието "close" на ThemeChanger
      ThemeChanger({ ...theme, toggled: "close" });
    }
    // Намира елемента с ID "responsive-overlay"
    const overlayElement = document.querySelector("#responsive-overlay");
    if (overlayElement) {
      // Премахва класа "active" от елемента
      overlayElement.classList.remove("active");
    }
  }

  return (
    <Fragment>
      <HelmetProvider>
        <Helmet>
          <body className="landing-body jobs-landing"></body>
        </Helmet>
      </HelmetProvider>
      <div id="responsive-overlay" onClick={() => menuClose()}></div>
      <aside className="app-sidebar sticky !topacity-0 sticky-pin" id="sidebar">
        <div className="container-xl xl:!p-0">
          <div className="main-sidebar mx-0">
            <nav className="main-menu-container nav nav-pills flex-column sub-open">
              <div className="landing-logo-container my-auto hidden lg:block">
                <div className="responsive-logo"></div>
              </div>
              <div className="slide-left hidden" id="slide-left">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path d="M13.293 6.293 7.586 12l5.707 5.707 1.414-1.414L10.414 12l4.293-4.293z"></path>{" "}
                </svg>
              </div>
              <Navbar2 />
              <div className="slide-right hidden" id="slide-right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="#7b8191"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <path d="M10.707 17.707 16.414 12l-5.707-5.707-1.414 1.414L13.586 12l-4.293 4.293z"></path>{" "}
                </svg>
              </div>
              <div className="lg:flex hidden space-x-2 rtl:space-x-reverse">
                <Link
                  to={`${import.meta.env.BASE_URL}signin/`}
                  className="ti-btn w-[10rem] ti-btn-primary-full m-0 p-2"
                >
                  Влезте в профила си
                </Link>
                <Link
                  to={`${import.meta.env.BASE_URL}signup/`}
                  className="ti-btn w-[10rem] ti-btn-secondary-full m-0 p-2"
                >
                  Създаване на профил
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </aside>
      <div className="main-content !p-0 landing-main dark:text-defaulttextcolor/70">
        <div className="landing-banner !h-auto" id="home">
          <section className="section !pb-0 text-[0.813rem]">
            <div className="container main-banner-container">
              <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center">
                <h2 className="text-2xl opsilion text-defaulttextcolor dark:text-white/80">
                  ДОБРЕ ДОШЛИ!
                </h2>
              </Card>
            </div>
          </section>
        </div>
        <section
          className="section bg-light dark:!bg-black/10 text-defaulttextcolor"
          id="description"
        >
          <div className="container text-center">
            <div className=" justify-center text-center mb-12">
              <div className="xl:col-span-6 col-span-12">
                <h3 className="font-semibold mb-2">Как работи АртКомпас?</h3>
                <span className="text-[#8c9097] dark:text-white/50 text-[0.9375rem] font-normal block">
                  Открийте най-добрите препоръки за вас с помощта на Изкуствен
                  Интелект и станете свидетел на анализ на точността му в три
                  лесни стъпки – регистрирайте се, попълнете кратък въпросник и
                  вижте вашите резултати!
                </span>
              </div>
            </div>
            <div className="grid grid-cols-12 gap-6 text-start">
              <div className="col-span-12 md:col-span-4">
                <div className="box border dark:border-defaultborder/10">
                  <div className="box-body rounded">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <i className="ti ti-file-invoice"></i>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold text-[1.25rem]">
                      Регистрация
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Създайте свой профил, за да станете част от нашата
                      платформа. АртКомпас ви предоставя възможността да
                      изживеете едно уникално кино и библиопреживяване.
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to={`${import.meta.env.BASE_URL}signup`}
                    >
                      Създайте свой профил сега
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 col-span-12">
                <div className="box border dark:border-defaultborder/10">
                  <div className="box-body rounded">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <i className="ti ti-briefcase"></i>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold text-[1.25rem]">
                      Вашият анализ
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Спрямо вашите индивидуални предпояитания и личностни
                      качества, приложението ще анализира поведението на
                      Изкуствения Интелект с помощта на универсални и потвърдени
                      показатели за оценка на машинното обучение!
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Тествайте AI
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="md:col-span-4 col-span-12">
                <div className="box border dark:border-defaultborder/10">
                  <div className="box-body rounded">
                    <div className="mb-4 ms-1">
                      <div className="icon-style">
                        <span className="avatar avatar-lg avatar-rounded bg-primary svg-white">
                          <i className="ti ti-user-plus"></i>
                        </span>
                      </div>
                    </div>
                    <h5 className="font-semibold text-[1.25rem]">
                      Нови препоръки
                    </h5>
                    <p className="opacity-[0.8] mb-4">
                      Съвместно с анализа, приложението също така ще ви насочи
                      към най-подходящите филми и сериали за гледане и книги за
                      четене. Направете първата крачка още сега!
                    </p>
                    <Link
                      className="mx-1 text-primary font-semibold leading-[1]"
                      to="#"
                    >
                      Рзгледайте нови препоръки
                      <i className="ri-arrow-right-s-line align-middle rtl:rotate-180"></i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section bg-light" id="aianalysis">
          <div className="container">
            <AIStatsWidgetCardsComponent data={data} />
            <Card className="dark:border-black/10 bg-bodybg font-semibold text-xl p-4 rounded-lg shadow-lg dark:shadow-xl text-center">
              <h2 className="text-2xl opsilion text-defaulttextcolor dark:text-white/80">
                За да придобиете по-ясна представа за значенията на тези
                показатели за оценка на машинното обучение, моля, разгледайте
                <a
                  href="#accordion"
                  className="side-menu__item text-gray-500 cursor-pointer hover:text-primary/80 transition-all duration-150"
                >
                  {" <<секцията за разяснения>> "}
                </a>
                !
              </h2>
            </Card>
          </div>
        </section>
        <section
          className="section scroll-mt-16 bg-primary text-defaultsize text-defaulttextcolor"
          id="accordion"
        >
          <div className="container text-center">
            <div className="text-sm">
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
                      жанр, емоционално състояние, разполагаемо време за гледане
                    </span>{" "}
                    и други се съобразяват с{" "}
                    <span className="font-semibold">ВАШИТЕ </span> индивидуални
                    потребителски предпочитания. Всичко това се случва с помощта
                    на{" "}
                    <span className="font-semibold">
                      Алгоритъма за релевантност
                    </span>
                    , описан в следващата секция.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="concept">
                  <AccordionTrigger className="opsilion">
                    🔍 Как работи алгоритъмът?
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="mb-10">
                      <span className="font-semibold">
                        Алгоритъмът за релевантност
                      </span>{" "}
                      е сърцето на препоръчителната система, който анализира{" "}
                      <span className="font-semibold">
                        последно регистрираните{" "}
                      </span>
                      предпочитания на потребителя и определя доколко даден филм
                      или сериал съвпада с неговите изисквания. Той използва
                      подход, включващ няколко критерия за оценка, и изчислява
                      общ резултат, който се нарича{" "}
                      <span className="font-semibold">релевантност</span>.
                    </p>
                    <h2 className="text-2xl">Критериите са: </h2>
                    <ul className="space-y-4 mt-3">
                      <li>
                        <strong>✅ Предпочитани жанрове</strong> – Проверява се
                        дали жанровете на предложеното съдържание съвпадат с
                        тези, които потребителят харесва. Ако има съвпадение, то
                        се оценява с висока тежест.
                      </li>
                      <li>
                        <strong>✅ Тип съдържание (филм или сериал)</strong> –
                        Системата преобразува избора на потребителя в
                        стандартизиран формат (напр. "Филм" → "movie") и го
                        сравнява с типа на препоръчаното заглавие.
                      </li>
                      <li>
                        <strong>✅ Настроение на потребителя</strong> – В
                        зависимост от настроението, в което се намира
                        потребителят, се извършва съпоставяне с жанрове, които
                        типично се свързват с това усещане.
                      </li>
                      <li>
                        <strong>✅ Наличност на време</strong> – Алгоритъмът
                        оценява дали продължителността на филма или средната
                        продължителност на епизодите на сериала се вписват в
                        свободното време на потребителя, като използва разумен
                        толеранс за разлики от няколко минути.
                      </li>
                      <li>
                        <strong>✅ Година на издаване</strong> – Ако
                        потребителят има предпочитания за определен времеви
                        период (напр. „публикуван в последните 10 години“),
                        препоръките се филтрират според този критерий.
                      </li>
                      <li>
                        <strong>✅ Целева аудитория</strong> – Системата
                        сравнява таргетираната възрастова група на съдържанието
                        със заявените предпочитания на потребителя.
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="calculation">
                  <AccordionTrigger className="opsilion">
                    🎯 Как се изчислява крайният резултат?
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-4">
                      <li>
                        Всеки критерий има индивидуален принос към крайния
                        резултат, като по-важните фактори (като жанр) получават
                        по-голяма брой точки при съвпадение. Системата изчислява
                        сборна оценка, която показва до каква степен филмът или
                        сериалът е релевантен за потребителя.
                      </li>
                      <li>
                        <strong>
                          {" "}
                          📌 Ако резултатът премине прагът от 5 точки,
                          препоръката се счита за подходяща и се предлага на
                          потребителя.
                        </strong>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                {/* Precision */}
                <AccordionItem value="precision">
                  <AccordionTrigger className="opsilion">
                    ✅ Precision
                  </AccordionTrigger>
                  <AccordionContent>
                    <p>
                      Измерва каква част от препоръките, които сте направили, са{" "}
                      <span className="font-semibold">наистина </span>{" "}
                      релевантни. Високата стойност на{" "}
                      <span className="font-semibold">Precision</span> означава,
                      че когато системата препоръчва нещо, то вероятно ще бъде
                      подходящо за вас.
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
                      <span className="font-semibold">важни (релевантни) </span>{" "}
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
                      <span className="font-semibold">Recall</span>, показвайки
                      колко добре системата намира точния баланс между тях.
                      Високият <span className="font-semibold">F1 Score</span>{" "}
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
        </section>
        <section
          className="section section-bg text-defaultsize text-defaulttextcolor mb-[15rem]"
          id="additionalStats"
        >
          <div className="container">
            <div className=" gap-6 mb-[3rem] justify-center text-center">
              <h3 className="font-semibold mb-2">Други главни статистики:</h3>
            </div>
            <div className="grid grid-cols-12 gap-x-6 justify-center">
              <OtherStatsWidgetCardsComponents data={data} />
            </div>
          </div>
        </section>
      </div>
    </Fragment>
  );
};

export default Landing;
