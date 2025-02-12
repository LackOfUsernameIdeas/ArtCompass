import { FC, Fragment } from "react";
import { MoviesByProsperityDataType } from "../../platformStats-types";
import { MoviesByProsperityBubbleChart } from "../../charts";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";

interface MoviesByProsperityComponentProps {
  data: MoviesByProsperityDataType;
}

const MoviesByProsperityComponent: FC<MoviesByProsperityComponentProps> = ({
  data
}) => {
  return (
    <Fragment>
      <div className="xl:col-span-6 col-span-12">
        <div className="flex flex-col md:flex-row gap-8 box p-6 rounded-lg shadow-lg dark:text-gray-300 text-[#333335]">
          {/* Лява част */}
          <div className="md:w-1/2 flex flex-col justify-center items-center text-center text-sm">
            <p>
              Тук може да видите най-успешните филми според{" "}
              <span className="font-semibold text-primary">IMDb рейтинг</span> и
              приходи от{" "}
              <span className="font-semibold text-primary">боксофиса</span>.
            </p>
            <p>
              Филмите са разпределени по жанрове, като всеки жанр е отбелязан с{" "}
              <span className="font-semibold text-primary">различен цвят</span>.
            </p>
            <p>
              <span className="font-semibold text-primary">Оста X</span>{" "}
              представя приходите от боксофиса в милиони долари.
            </p>
            <p>
              <span className="font-semibold text-primary">Оста Y</span>{" "}
              представя{" "}
              <span className="font-semibold text-primary">
                рейтинга в IMDb
              </span>
              .
            </p>
            <p>
              Големината на кръговете отразява{" "}
              <span className="font-semibold text-primary">просперитета</span>{" "}
              на филма.
            </p>
          </div>

          {/* Дясна част*/}
          <div className="md:w-1/2 text-sm">
            <Accordion type="single" collapsible className="space-y-4">
              {/* IMDb */}
              <AccordionItem value="imdb">
                <AccordionTrigger className="opsilion">
                  🎬 IMDb рейтинг
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  Средна оценка, която даден филм получава от потребителите на
                  IMDb. Оценките варират от{" "}
                  <span className="font-semibold">1 до 10</span> и отразяват
                  популярността и качеството на филма.
                </AccordionContent>
              </AccordionItem>

              {/*Боксофис*/}
              <AccordionItem value="boxoffice">
                <AccordionTrigger className="opsilion">
                  💰 Боксофис
                </AccordionTrigger>
                <AccordionContent className="pl-4">
                  Общата сума на приходите от продажба на билети в киносалоните.
                  Измерва се в{" "}
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
                    се получава като се изчисли сборът на стойностите на няколко
                    критерии. За всеки критерий се задава определено процентно
                    отношение, което отразява неговата важност спрямо
                    останалите:
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

        {/* Bubble Chart Box */}
        <div className="box custom-box h-[27.75rem] mt-6">
          <div className="box-header">
            <div className="box-title opsilion">
              Най-успешни филми по Просперитет, IMDb Рейтинг и Боксофис
            </div>
          </div>
          <div className="box-body">
            <div id="bubble-simple">
              <MoviesByProsperityBubbleChart
                sortedMoviesByProsperity={data.sortedMoviesByProsperity}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default MoviesByProsperityComponent;
