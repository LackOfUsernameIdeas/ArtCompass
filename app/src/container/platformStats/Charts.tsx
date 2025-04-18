import { Component, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import chroma from "chroma-js";

import {
  ActorData,
  CountryData,
  DirectorData,
  MovieData,
  MovieProsperityData,
  RecommendationData,
  RoleData,
  WriterData
} from "./platformStats-types";

// Генерира данни за heatmap диаграмата
export function generateData(count: any, yrange: any) {
  let i = 0;
  const series = [];
  while (i < count) {
    const x = "w" + (i + 1).toString();
    const y =
      Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    series.push({
      x: x,
      y: y
    });
    i++;
  }
  return series;
}

// Преобразува RGB цвят в HEX формат
const rgbToHex = (rgb: string): string => {
  // Уверява се, че входният цвят е във формат "rgb(r, g, b)"
  const result = rgb.match(/\d+/g);
  if (!result || result.length !== 3) {
    throw new Error("Невалиден RGB формат на цвета");
  }

  return `#${result
    .map((x) => parseInt(x).toString(16).padStart(2, "0")) // Преобразува всяка стойност на RGB в HEX
    .join("")}`;
};

// Обновява основния цвят на базата на CSS променливи
const updatePrimaryColor = () => {
  const rootStyles = getComputedStyle(document.documentElement);
  const primary = rootStyles.getPropertyValue("--primary").trim();
  const primaryWithCommas = primary.split(" ").join(",");
  const primaryHex = rgbToHex(primaryWithCommas);

  return primaryHex;
};

interface GenrePopularityOverTimeProps {
  seriesData: { name: string; data: { x: string; y: number }[] }[];
}

interface State {
  options: any; // Конфигурационни опции за диаграмата
  series?: { name: string; data: (number | null)[] }[]; // По избор, серии за диаграмата
}

// Компонент за визуализация на популярността на жанровете с времето
export class GenrePopularityOverTime extends Component<
  GenrePopularityOverTimeProps,
  State
> {
  private observer: MutationObserver | null = null;

  constructor(props: GenrePopularityOverTimeProps) {
    super(props);

    // Инициализиране на състоянието с актуализирани опции за диаграмата
    this.state = {
      options: this.getUpdatedOptions()
    };
  }

  componentDidMount() {
    // Създаване на наблюдател за промяна в цветовата схема на страницата
    this.observer = new MutationObserver(this.updateColorRange);
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Спиране на наблюдателя при унищожаване на компонента
    this.observer?.disconnect();
  }

  // Актуализира цветовата скала при промяна на цветовата тема
  updateColorRange = () => {
    this.setState({ options: this.getUpdatedOptions() });
  };

  // Генерира и връща актуализирани опции за диаграмата
  getUpdatedOptions() {
    const primaryHex = updatePrimaryColor();
    const colorScale = chroma
      .scale([
        chroma(primaryHex).brighten(1).hex(),
        chroma(primaryHex).saturate(2).darken(2).hex(),
        chroma(primaryHex).darken(5).saturate(1.5).hex(),
        chroma(primaryHex).darken(10).saturate(1.5).hex(),
        chroma(primaryHex).darken(20).saturate(2).hex()
      ])
      .mode("lab")
      .domain([0, 100])
      .colors(1000);

    return {
      chart: { type: "heatmap", toolbar: { show: false } },
      plotOptions: {
        heatmap: {
          shadeIntensity: 0.5,
          radius: 0,
          useFillColorAsStroke: true,
          colorScale: {
            ranges: colorScale.map((color, index) => ({
              from: index * 10,
              to: (index + 1) * 10,
              color: color
            }))
          }
        }
      },
      dataLabels: { enabled: false },
      grid: { borderColor: "" },
      stroke: { width: 1 },
      xaxis: {
        labels: { show: true },
        tickAmount: 12,
        axisTicks: { show: true, interval: 1 }
      },
      yaxis: { labels: { show: true } },
      tooltip: {
        custom: ({ seriesIndex, dataPointIndex, w }: any) => {
          const genre = w.config.series[seriesIndex].name;
          const count = w.config.series[seriesIndex].data[dataPointIndex].y;
          return `
            <div style="padding: 10px;">
              <strong style="font-family: Opsilon; font-size: 1rem; font-weight: normal;">Жанр: <span style="font-family: Equilibrist;"> ${genre}</span></strong><br>
              <span style="font-family: Opsilon; font-weight: normal;">Брой препоръчвания: <span style="font-family: Equilibrist;"> ${count}</span></span>
            </div>
          `;
        }
      },
      legend: { show: false }
    };
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.props.seriesData}
        type="heatmap"
        height={350}
        width="100%"
      />
    );
  }
}

export class MoviesAndSeriesByRatingsChart extends Component<
  { seriesData: MovieData[]; category: string },
  State
> {
  private observer: MutationObserver | null = null;

  constructor(props: { seriesData: MovieData[]; category: string }) {
    super(props);

    // Вземане на първоначалния цвят за темата
    const initialColor = updatePrimaryColor();

    this.state = {
      series: [],
      options: {
        chart: {
          type: "bar",
          toolbar: { show: false }
        },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } },
        grid: { borderColor: "#f2f5f7" },
        dataLabels: { enabled: false },
        xaxis: {
          title: {
            text: [],
            style: {
              fontFamily: "Opsilon",
              letterSpacing: "0.04em"
            }
          },
          categories: [],
          labels: {
            show: true
          }
        },
        yaxis: {
          title: {
            text: "Заглавие",
            style: {
              fontFamily: "Equilibrist",
              fontWeight: "200"
            }
          },
          labels: {
            show: true
          }
        },
        colors: [
          chroma(initialColor).darken(0.6).hex(), // По-светъл цвят за филми
          chroma(initialColor).brighten(0.6).hex() // По-тъмен цвят за сериали
        ]
      }
    };
  }

  static getDerivedStateFromProps(
    nextProps: { seriesData: MovieData[]; category: string },
    prevState: State
  ) {
    if (nextProps.seriesData && nextProps.seriesData.length > 0) {
      const sortCategory = nextProps.category;
      const sortedMovies =
        sortCategory === "IMDb"
          ? nextProps.seriesData.sort((a, b) => b.imdbRating - a.imdbRating)
          : sortCategory === "Metascore"
          ? nextProps.seriesData.sort((a, b) => b.metascore - a.metascore)
          : nextProps.seriesData.sort(
              (a, b) => b.rottenTomatoes - a.rottenTomatoes
            );

      return {
        series: [
          {
            name:
              sortCategory === "IMDb"
                ? "IMDb рейтинг"
                : sortCategory === "Metascore"
                ? "Метаскор"
                : "Rotten Tomatoes рейтинг",
            data: sortedMovies.map((movie) => {
              // Определяне на цвета според типа (филм или сериал)
              const color =
                movie.type === "movie"
                  ? prevState.options.colors[0] // По-светъл цвят за филми
                  : prevState.options.colors[1]; // По-тъмен цвят за сериали

              return {
                x: `${movie.title_bg} (${movie.title_en})`,
                y:
                  sortCategory === "IMDb"
                    ? movie.imdbRating
                    : sortCategory === "Metascore"
                    ? movie.metascore
                    : movie.rottenTomatoes,
                fillColor: color // Използване на динамичен цвят за всеки филм/сериал
              };
            })
          }
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            title: {
              ...prevState.options.xaxis.title,
              text:
                sortCategory === "IMDb"
                  ? "IMDb рейтинг"
                  : sortCategory === "Metascore"
                  ? "Метаскор"
                  : "Rotten Tomatoes рейтинг"
            },
            categories: sortedMovies.map(
              (movie) => `${movie.title_bg} (${movie.title_en})`
            )
          },
          tooltip: {
            custom: ({ seriesIndex, dataPointIndex, w }: any) => {
              const title = w.config.series[seriesIndex].data[dataPointIndex].x;
              const value = w.config.series[seriesIndex].data[dataPointIndex].y;
              return `
                <div style="padding: 10px;">
                  <span style="font-family: Opsilon; font-size: 1rem; font-weight: normal;"> ${title}</span><br>
                  <span style="font-family: Equilibrist;">${
                    sortCategory === "IMDb"
                      ? "IMDb рейтинг"
                      : sortCategory === "Metascore"
                      ? "Метаскор"
                      : "Rotten Tomatoes рейтинг"
                  }: <span style="font-family: Equilibrist;"> ${value}</span></span>
                </div>
              `;
            }
          }
        }
      };
    }

    return null;
  }

  componentDidMount() {
    this.updateColorRange();

    // Инициализиране на MutationObserver за наблюдение на промени в класа на document.documentElement
    this.observer = new MutationObserver(() => {
      this.updateColorRange();
    });

    // Наблюдение на промени в classList на главния елемент на документа (смени на темата)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"]
    });
  }

  componentWillUnmount() {
    // Почистване на MutationObserver при премахване на компонента
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  updateColorRange() {
    const primaryHex = updatePrimaryColor(); // Вземане на актуализирания цвят на темата

    // Дефиниране на различни цветове на базата на актуализирания основен цвят
    const movieColor = chroma(primaryHex).darken(0.6).hex(); // По-светъл цвят за филми
    const seriesColor = chroma(primaryHex).brighten(0.6).hex(); // По-тъмен цвят за сериали

    // Актуализиране на състоянието с новите цветове
    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        colors: [movieColor, seriesColor] // Актуализиране на цветовете за двете категории
      }
    }));
  }

  render() {
    const movieColor = this.state.options.colors[0];
    const seriesColor = this.state.options.colors[1];

    return (
      <div>
        <div className="flex justify-center items-center">
          <div className="flex items-center mr-4">
            <span
              className="w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: movieColor }}
            ></span>
            <span>Филм</span>
          </div>
          <div className="flex items-center">
            <span
              className="w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: seriesColor }}
            ></span>
            <span>Сериал</span>
          </div>
        </div>

        {this.state.series && this.state.series.length > 0 ? (
          <div className="custom-chart">
            <ReactApexChart
              key={JSON.stringify(this.state.options.xaxis.labels.style)}
              options={this.state.options}
              series={this.state.series}
              type="bar"
              height={320}
            />{" "}
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>
    );
  }
}

// Интерфейс за пропсовете на компонента
interface TopCountriesProps {
  topCountries: CountryData[] | null; // Списък с данни за държавите или null, ако няма данни
  is1546: boolean;
}

// Функционален компонент за визуализация на препоръките по държави
export const TopCountriesChart: React.FC<TopCountriesProps> = ({
  topCountries
}) => {
  // Състояние за първичния (основния) цвят на темата
  const [primaryColor, setPrimaryColor] = useState<string>("#ffffff");

  // Ефект за следене на промени в темата
  useEffect(() => {
    // Задаване на началния цвят при първоначално зареждане
    setPrimaryColor(updatePrimaryColor());

    // Създаване на наблюдател за промени в класа на HTML елемента (например смяна на тема)
    const observer = new MutationObserver(() => {
      setPrimaryColor(updatePrimaryColor());
    });

    // Наблюдение на промени в класовете на елемента document.documentElement
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] // Следене само на промените в класовете
    });

    // Премахване на наблюдателя при унищожаване на компонента
    return () => {
      observer.disconnect();
    };
  }, []);

  // Проверка дали има налични данни за държавите
  if (!topCountries) {
    return <div>Зареждане...</div>;
  }

  // Общо препоръки от всички държави
  const totalCount = topCountries.reduce(
    (sum, country) => sum + country.count,
    0
  );

  // Създаване на цветова скала спрямо основния цвят на темата
  const colorScale = chroma
    .scale([
      chroma(primaryColor).brighten(0.5).saturate(1).hex(), // По-светъл цвят
      chroma(primaryColor).brighten(3).saturate(0.5).hex(), // Най-светъл (среден) цвят
      chroma(primaryColor).darken(1).saturate(1).hex() // По-тъмен цвят
    ])
    .mode("lab")
    .domain([0, topCountries.length - 1])
    .colors(topCountries.length);

  return (
    <div>
      {/* Хоризонтален бар за визуализация на държавите */}
      <div className="flex w-full h-[0.3125rem] mb-6 rounded-full overflow-hidden">
        {topCountries.map((country, index) => {
          const widthPercentage = (country.count / totalCount) * 100; // Процентна ширина за всяка държава
          const color = colorScale[index]; // Цвят на текущата държава

          return (
            <div
              key={country.country_en}
              className="flex flex-col justify-center overflow-hidden"
              style={{
                width: `${widthPercentage}%`,
                backgroundColor: color
              }}
              aria-valuenow={widthPercentage}
              aria-valuemin={0}
              aria-valuemax={100}
              title={`${country.country_bg}: ${country.count}`}
            ></div>
          );
        })}
      </div>

      {/* Общо препоръки */}
      <div className="mb-4 text-sm text-gray-500">
        <span className="!font-Equilibrist">
          <strong>Общ брой препоръки:</strong>
        </span>{" "}
        <span className="opsilion">{totalCount}</span>
      </div>

      {/* Външна легенда */}
      <ul className="list-none mb-6 pt-2 crm-deals-status flex flex-col">
        {topCountries.map((country, index) => {
          const color = colorScale[index];

          return (
            <li
              key={country.country_en}
              className="flex items-center text-sm mb-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: color }}
                aria-label={country.country_en}
              ></div>
              <span className="ml-2">
                <span className="font-Equilibrist">
                  <strong>{country.country_bg}</strong>
                </span>
                :
                <span className="text-xl opsilion">
                  {" "}
                  {country.count}{" "}
                  <span className="font-Equilibrist text-sm">пъти</span>
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

// Интерфейс за параметрите на графиката "Филми по просперитет"
interface MoviesByProsperityBubbleChartProps {
  sortedMoviesByProsperity: MovieProsperityData[]; // Сортирани филми по критерий за просперитет
}

// Компонент за визуализация на балонна графика за филми
export class MoviesByProsperityBubbleChart extends Component<
  MoviesByProsperityBubbleChartProps,
  State
> {
  constructor(props: MoviesByProsperityBubbleChartProps) {
    super(props);

    this.state = {
      // Данни за серията и опциите на графиката
      series: [],
      options: {
        chart: {
          type: "bubble", // Тип на графиката - балонна
          events: {
            // Автоматично преизчисление при преоразмеряване на прозореца
            mounted: (chart: any) => {
              chart.windowResizeHandler();
            }
          },
          toolbar: {
            show: false // Скриване на тулбара
          },
          zoom: {
            enabled: false // Деактивиране на мащабирането
          }
        },
        plotOptions: {
          bubble: {
            minBubbleRadius: 5, // Минимален радиус на балон
            maxBubbleRadius: 2000 // Максимален радиус на балон
          }
        },
        dataLabels: { enabled: false }, // Без етикети върху данните
        fill: { opacity: 0.8 }, // Прозрачност на балоните
        colors: [], // Цветове, ще бъдат зададени динамично
        xaxis: {
          tickAmount: 10, // Брой отметки по X-оста
          labels: {
            // Форматиране на стойностите в милиони долари
            formatter: (val: any) => `$${Math.round(val)}M`,
            style: {
              fontFamily: "Equilibrist",
              colors: "#8c9097",
              fontSize: "1rem",
              fontWeight: 600
            }
          },
          title: {
            text: "Приходи от боксофиса (в милиони)",
            style: {
              fontFamily: "Opsilon",
              letterSpacing: "0.07em",
              fontSize: "1.2rem",
              color: "#8c9097"
            }
          }
        },
        yaxis: {
          tickAmount: 7, // Брой отметки по Y-оста
          max: 10, // Максимална стойност
          min: 5, // Минимална стойност
          labels: {
            style: {
              fontFamily: "Equilibrist",
              colors: "#8c9097",
              fontSize: "1rem",
              fontWeight: 600
            }
          },
          title: {
            text: "IMDb рейтинг",
            style: {
              fontFamily: "Opsilon",
              letterSpacing: "0.04rem",
              fontSize: "1.2rem",
              color: "#8c9097"
            }
          }
        },
        legend: {
          show: true, // Показване на легендата
          position: "top", // Позиция - горе
          style: { fontFamily: "Equilibrist" },
          markers: {
            width: 10, // Ширина на маркерите
            height: 10, // Височина на маркерите
            radius: 12 // Радиус на маркерите
          },
          itemMargin: {
            horizontal: 10,
            vertical: 5
          },
          formatter: (seriesName: string) => seriesName // Оптимизирано показване
        },
        tooltip: {
          shared: false,
          intersect: true,
          // Персонализиран изглед на подсказката
          custom: ({ seriesIndex, dataPointIndex, w }: any) => {
            const movieData = w.config.series[seriesIndex].data[dataPointIndex];

            if (movieData) {
              const movieTitleEn = movieData.title_en || "Unknown Movie";
              const movieTitleBg = movieData.title_bg || "Unknown Movie";
              const imdbRating =
                movieData.y !== undefined ? movieData.y : "N/A";
              const boxOffice =
                movieData.x !== undefined ? movieData.x * 1e6 : "N/A";
              const formattedBoxOffice =
                boxOffice !== "N/A" ? `$${boxOffice.toLocaleString()}` : "N/A";

              return `
                <div style="padding: 0.8rem; font-family: Opsilon; font-size: 1rem; letter-spacing: 0.05em; font-weight: normal;">
                  ${movieTitleBg} (${movieTitleEn})<br />
                </div>
                <div style="padding: 0.8rem; font-family: Equilibrist; font-weight: normal;">
                  IMDb рейтинг: ${imdbRating}/10<br />
                  Боксофис: ${formattedBoxOffice}
                </div>
              `;
            }
            return "";
          }
        }
      }
    };
  }

  // Помощна функция за получаване на цвят според жанра
  getColorForGenre(genre: string): string {
    const genreColorMap: { [key: string]: string } = {
      Приключенски: "#1f0302",
      Екшън: "#3e0704",
      Комедия: "#5c0a06",
      Драма: "#7b0e08",
      Трилър: "#9A110A",
      Романтичен: "#ae413b",
      Анимация: "#c2706c",
      "Филм-ноар": "#cd8885"
    };

    const firstGenre = genre.split(",")[0].trim(); // Извличане на първия жанр
    return genreColorMap[firstGenre] || "#8c9097"; // Дефолтен цвят при липса на съвпадение
  }

  // Актуализация на състоянието на базата на новите свойства
  static getDerivedStateFromProps(
    nextProps: MoviesByProsperityBubbleChartProps,
    prevState: State
  ) {
    const { sortedMoviesByProsperity } = nextProps;
    const instance = new MoviesByProsperityBubbleChart(nextProps);
    const genreMap: { [key: string]: any[] } = {};

    // Групиране на данни по жанрове
    sortedMoviesByProsperity.forEach((movie) => {
      const prosperityScore = movie.prosperityScore || 0;
      const boxOffice =
        parseFloat(movie.total_box_office.replace(/[^0-9.-]+/g, "")) / 1e6;
      const imdbRating = parseFloat(movie.imdbRating) || 0;
      const genreColor = movie.genre_bg
        ? instance.getColorForGenre(movie.genre_bg)
        : "#8c9097";
      const titleEnglish = movie.title_en;
      const titleBulgarian = movie.title_bg;
      const genre = movie.genre_bg.split(",")[0].trim();

      if (!genreMap[genre]) {
        genreMap[genre] = [];
      }

      genreMap[genre].push({
        x: boxOffice, // Приходи от боксофис
        y: imdbRating, // IMDb рейтинг
        z: prosperityScore, // Баланс между двете
        title_en: titleEnglish,
        title_bg: titleBulgarian,
        color: genreColor // Пряко задаване на цвета
      });
    });

    const series = Object.keys(genreMap).map((genre) => ({
      name: genre,
      data: genreMap[genre],
      color: instance.getColorForGenre(genre)
    }));

    const colors = [...new Set(series.map((s) => s.color))];

    if (JSON.stringify(series) !== JSON.stringify(prevState.series)) {
      return { series, options: { ...prevState.options, colors } };
    }

    return null;
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options}
        series={this.state.series}
        type="bubble"
        height="350px"
      />
    );
  }
}

interface TreemapProps {
  data: RoleData;
  role: string;
}

interface TreemapState {
  series: any[];
  options: any;
}

export class Treemap extends Component<TreemapProps, TreemapState> {
  private observer: MutationObserver | null = null;

  constructor(props: TreemapProps) {
    super(props);

    // Начален цвят, базиран на темата
    const initialColor = updatePrimaryColor();

    // Генериране на диапазон от цветове (10 цвята), базирани на началния цвят
    const initialColorRange = chroma
      .scale([
        chroma(initialColor).darken(0.5).hex(), // По-тъмен нюанс
        chroma(initialColor).darken(1).hex() // Още по-тъмен нюанс
      ])
      .mode("lab")
      .domain([0, 100])
      .colors(10);

    this.state = {
      series: [
        {
          data: Treemap.formatData(props.data, props.role)
        }
      ],
      options: {
        chart: {
          type: "treemap",
          toolbar: {
            show: false
          }
        },
        colors: initialColorRange,
        legend: {
          show: false
        },
        dataLabels: {
          enabled: true,
          style: {
            fontFamily: "Equilibrist",
            fontWeight: "200"
          }
        },
        tooltip: {
          style: {
            fontFamily: "Opsilon",
            fontSize: "1rem",
            letterSpacing: "0.07em"
          }
        }
      }
    };
  }

  // Метод за извличане на състояние от променени пропсове
  static getDerivedStateFromProps(
    nextProps: TreemapProps,
    prevState: TreemapState
  ) {
    // Проверка дали данните или ролята са променени
    if (
      nextProps.data !== prevState.series[0].data ||
      nextProps.role !== prevState.options.title?.text?.split(" ")[1]
    ) {
      return {
        series: [
          {
            data: Treemap.formatData(nextProps.data, nextProps.role) // Актуализиране на форматираните данни
          }
        ]
      };
    }
    return null; // Няма промяна
  }

  // Метод за форматиране на данните на база роля
  static formatData(data: RoleData, role: string) {
    return data.map((item) => {
      let name = ""; // Име на елемент
      let count = 0; // Брой свързани записи

      // Проверка на типа роля и съответните полета в данните
      if (role === "Actors" && "actor_bg" in item) {
        name = (item as ActorData).actor_bg!;
        count = (item as ActorData).actor_count!;
      } else if (role === "Directors" && "director_bg" in item) {
        name = (item as DirectorData).director_bg!;
        count = (item as DirectorData).director_count!;
      } else if (role === "Writers" && "writer_bg" in item) {
        name = (item as WriterData).writer_bg!;
        count = (item as WriterData).writer_count!;
      }

      return { x: name, y: count }; // Връщане на форматиран обект
    });
  }

  // Метод за извличане на основния цвят на базата на темата
  getPrimaryColor() {
    const root = document.documentElement; // Вземане на кореновия HTML елемент
    const primaryColor = window
      .getComputedStyle(root)
      .getPropertyValue("--primary-color"); // Извличане на CSS променливата
    return primaryColor || "#9A110A"; // Връщане на стандартен червен цвят, ако няма дефиниран
  }

  // Метод за актуализиране на цветния диапазон
  updateColorRange() {
    const primaryHex = updatePrimaryColor(); // Актуализиране на основния цвят
    const newColorRange = chroma
      .scale([
        chroma(primaryHex).darken(0.5).hex(), // По-тъмни нюанси
        chroma(primaryHex).darken(1).hex()
      ])
      .mode("lab")
      .domain([0, 100])
      .colors(10);

    // Актуализиране на цветовете в състоянието
    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        colors: newColorRange
      }
    }));
  }

  componentDidMount() {
    // Добавяне на наблюдател за промени в темата
    this.observer = new MutationObserver(() => {
      this.updateColorRange(); // Актуализиране на цветовете при промяна
    });

    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] // Слушане за промяна на класовете
    });
  }

  componentWillUnmount() {
    // Премахване на наблюдателя при унищожаване на компонента
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  render() {
    return (
      <ReactApexChart
        options={this.state.options} // Опции за диаграмата
        series={this.state.series} // Данни за диаграмата
        type="treemap"
        height={350}
      />
    );
  }
}

export class TopRecommendationsBarChart extends Component<
  { seriesData: RecommendationData[] | MovieData[] },
  State
> {
  private observer: MutationObserver | null = null;

  constructor(props: { seriesData: RecommendationData[] }) {
    super(props);

    // Извличане на началния цвят за темата
    const initialColor = updatePrimaryColor();

    // Задаване на отделни цветове за филми и сериали, базирани на основния цвят
    this.state = {
      series: [],
      options: {
        chart: {
          type: "bar", // Тип на диаграмата - хоризонтален бар
          toolbar: { show: false } // Скриване на лентата с инструменти
        },
        plotOptions: { bar: { borderRadius: 4, horizontal: true } }, // Задаване на хоризонтална ориентация и радиус на колоните
        grid: { borderColor: "#f2f5f7" }, // Цвят на мрежата
        dataLabels: { enabled: false }, // Скриване на стойностите върху колоните
        xaxis: {
          title: {
            text: "Брой препоръчвания",
            style: {
              fontFamily: "Opsilon",
              letterSpacing: "0.04rem"
            }
          }, // Заглавие на оста X
          categories: [], // Категории, които ще бъдат зададени динамично
          labels: {
            style: {
              letterSpacing: "0.04rem",
              fontFamily: "Opsilon" // Custom font
            }
          }
        },
        yaxis: {
          title: {
            text: "Заглавие",
            style: {
              fontFamily: "Opsilon",
              letterSpacing: "0.04rem"
            }
          },
          labels: {
            style: {
              fontFamily: "Opsilon", // Apply the Opsilon font to movie names
              letterSpacing: "0.04rem"
            }
          }
        },
        colors: [
          chroma(initialColor).darken(0.6).hex(), // По-ярък цвят за филми
          chroma(initialColor).brighten(0.6).hex() // По-тъмен цвят за сериали
        ],
        legend: {
          show: true, // Показване на легендата
          position: "top", // Разположение на легендата
          labels: {
            colors: ["#000", "#000"] // Цвят на текстовете в легендата
          }
        },
        tooltip: {
          custom: ({ seriesIndex, dataPointIndex, w }: any) => {
            const title = w.config.series[seriesIndex].data[dataPointIndex].x;
            const count = w.config.series[seriesIndex].data[dataPointIndex].y;
            return `
              <div style="padding: 10px;">
                <span style="font-family: Opsilon; font-size: 1rem; font-weight: normal;"> ${title}</span><br>
                <span style="font-family: Equilibrist;">Брой препоръчвания: <span style="font-family: Equilibrist;"> ${count}</span></span>
              </div>
            `;
          }
        }
      }
    };
  }

  // Актуализация на състоянието при промяна на входните данни
  static getDerivedStateFromProps(
    nextProps: { seriesData: RecommendationData[] },
    prevState: State
  ) {
    if (nextProps.seriesData && nextProps.seriesData.length > 0) {
      // Подреждане на филмите/сериалите по брой препоръчвания
      const sortedMovies = nextProps.seriesData.sort(
        (a, b) => b.recommendations - a.recommendations
      );

      // Актуализиране на данните и задаване на цветове според типа
      const updatedSeries = sortedMovies.map((movie) => {
        const isMovie = movie.type === "movie"; // Проверка дали е филм
        const color = isMovie
          ? prevState.options.colors[0] // Цвят за филм
          : prevState.options.colors[1]; // Цвят за сериал

        return {
          x: `${movie.title_bg} (${movie.title_en})`,
          style: { fontFamily: "Opsilon", letterSpacing: "0.04rem" }, // Заглавие (на български и английски)
          y: movie.recommendations, // Брой препоръчвания
          fillColor: color // Цвят на колоната
        };
      });

      return {
        series: [
          {
            name: "Препоръчвания", // Име на серията
            data: updatedSeries,
            style: {
              fontFamily: "Equilibrist",
              letterSpacing: "0.04rem"
            }
          }
        ],
        options: {
          ...prevState.options,
          xaxis: {
            ...prevState.options.xaxis,
            categories: sortedMovies.map(
              (movie) => `${movie.title_bg} (${movie.title_en})`
            ), // Категории за оста X
            style: {
              fontFamily: "Opsilon",
              letterSpacing: "0.04rem"
            }
          }
        }
      };
    }

    return null; // Няма промяна
  }

  componentDidMount() {
    this.updateColorRange(); // Актуализиране на цветовия диапазон

    // Създаване на наблюдател за промени в темата
    this.observer = new MutationObserver(() => {
      this.updateColorRange(); // Актуализиране на цветовете при промяна
    });

    // Наблюдение за промени в класовете на root елемента (смяна на темата)
    this.observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"] // Наблюдение само за промени на класове
    });
  }

  componentWillUnmount() {
    // Премахване на наблюдателя при унищожаване на компонента
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  // Метод за актуализиране на цветовия диапазон при смяна на темата
  updateColorRange() {
    const primaryHex = updatePrimaryColor(); // Извличане на новия цвят на темата

    // Определяне на отделни цветове за филми и сериали
    const movieColor = chroma(primaryHex).darken(0.6).hex(); // Ярък цвят за филми
    const seriesColor = chroma(primaryHex).brighten(0.6).hex(); // Тъмен цвят за сериали

    this.setState((prevState) => ({
      options: {
        ...prevState.options,
        colors: [movieColor, seriesColor] // Актуализиране на цветовете
      }
    }));
  }

  render() {
    const movieColor = this.state.options.colors[0]; // Цвят за филми
    const seriesColor = this.state.options.colors[1]; // Цвят за сериали

    return (
      <div>
        <div className="flex justify-center items-center">
          <div className="flex items-center mr-4">
            <span
              className="opsilion w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: movieColor }}
            ></span>
            <span className="opsilion">Филм</span>
          </div>
          <div className="flex items-center">
            <span
              className="opsilion w-3 h-3 mr-1 rounded-full inline-block"
              style={{ backgroundColor: seriesColor }}
            ></span>
            <span className="opsilion">Сериал</span>
          </div>
        </div>

        {this.state.series && this.state.series.length > 0 ? (
          <div className="custom-chart">
            <ReactApexChart
              options={this.state.options} // Опции за диаграмата
              series={this.state.series} // Данни за диаграмата
              type="bar"
              height={330}
            />
          </div>
        ) : (
          <p>No data available</p> // Текст, ако няма данни
        )}
      </div>
    );
  }
}
