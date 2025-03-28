export const MENUITEMS = [
  {
    menutitle: "ГЛАВНИ СТРАНИЦИ"
  },
  {
    path: `${import.meta.env.BASE_URL}app/recommendations`,
    icon: <i className="side-menu__icon bx bx-movie-play"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "Нови Препоръки",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
    children: [
      {
        path: `${import.meta.env.BASE_URL}app/recommendations/movies_series`,
        icon: <i className="side-sub-menu__icon ti ti-movie"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ГЛЕДАНЕ"
      },
      {
        path: `${import.meta.env.BASE_URL}app/recommendations/books`,
        icon: <i className="side-sub-menu__icon ti ti-book"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ЧЕТЕНЕ"
      }
    ]
  },
  {
    path: `${import.meta.env.BASE_URL}app/aiAnalysator`,
    icon: <i className="side-menu__icon ti ti-report-analytics"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "AI Анализатор",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  },
  {
    icon: <i className="side-menu__icon ti ti-list-details"></i>,
    type: "sub",
    Name: "",
    active: false,
    selected: false,
    title: "СПИСЪЦИ",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
    children: [
      {
        path: `${import.meta.env.BASE_URL}app/saveLists/movies_series`,
        icon: <i className="side-sub-menu__icon ti ti-movie"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ГЛЕДАНЕ"
      },
      {
        path: `${import.meta.env.BASE_URL}app/saveLists/books`,
        icon: <i className="side-sub-menu__icon ti ti-book"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "ЗА ЧЕТЕНЕ"
      }
    ]
  },
  {
    icon: <i className="side-menu__icon bx bx-line-chart"></i>,
    type: "sub",
    Name: "",
    active: false,
    selected: false,
    title: "Общи Статистики",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
    children: [
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/moviesByProsperityBubbleChart`,
        icon: <i className="side-sub-menu__icon bx bx-movie"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Най-успешни филми по Просперитет, IMDb Рейтинг и Боксофис"
      },
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/actorsDirectorsWritersTable`,
        icon: <i className="side-sub-menu__icon bx bx-user"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Актьори, режисьори и сценаристи по Просперитет"
      },
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/genrePopularityOverTime`,
        icon: <i className="side-sub-menu__icon bx bx-category"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Популярност на жанровете във времето"
      },
      {
        path: `${import.meta.env.BASE_URL}app/platformStats/topRecommendations`,
        icon: <i className="side-sub-menu__icon bx bx-star"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Топ препоръки"
      },
      {
        path: `${
          import.meta.env.BASE_URL
        }app/platformStats/moviesAndSeriesByRatings`,
        icon: <i className="side-sub-menu__icon bx bxs-star-half"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Филми и сериали по оценки"
      },
      {
        path: `${import.meta.env.BASE_URL}app/platformStats/topCountries`,
        icon: <i className="side-sub-menu__icon bx bx-world"></i>,
        type: "link",
        active: false,
        selected: false,
        title: "Топ държави"
      }
    ]
  },
  // {
  //   icon: <i className="side-menu__icon bx bx-bar-chart-alt-2"></i>,
  //   type: "sub",
  //   Name: "",
  //   active: false,
  //   selected: false,
  //   title: "Индивидуални Статистики",
  //   class:
  //     "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
  //   children: [
  //     {
  //       path: `${import.meta.env.BASE_URL}app/individualStats/movies_series`,
  //       type: "link",
  //       active: false,
  //       selected: false,
  //       title: "За Филми/Сериали"
  //     },
  //     {
  //       path: `${import.meta.env.BASE_URL}app/individualStats/books`,
  //       type: "link",
  //       active: false,
  //       selected: false,
  //       title: "За Книги"
  //     }
  //   ]
  // },
  {
    path: `${import.meta.env.BASE_URL}app/individualStats/movies_series`,
    icon: <i className="side-menu__icon bx bx-bar-chart-alt-2"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "Индивидуални Статистики",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  },
  // {
  //   icon: <i className="side-menu__icon bx bx-bar-chart-alt-2"></i>,
  //   type: "sub",
  //   Name: "",
  //   active: false,
  //   selected: false,
  //   title: "Общи статистики",
  //   class:
  //     "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2",
  //   children: [
  //     {
  //       path: ``,
  //       type: "link",
  //       active: false,
  //       selected: false,
  //       title: "Жанрове"
  //     },
  //     {
  //       path: ``,
  //       type: "link",
  //       active: false,
  //       selected: false,
  //       title: "Просперитет"
  //     },
  //     {
  //       path: ``,
  //       type: "link",
  //       active: false,
  //       selected: false,
  //       title: "Актьори"
  //     }
  //   ]
  // },
  {
    menutitle: "КОНТАКТ"
  },
  {
    path: `${import.meta.env.BASE_URL}app/contact`,
    icon: <i className="side-menu__icon bx bx-envelope"></i>,
    type: "link",
    Name: "",
    active: false,
    selected: false,
    title: "За Контакт",
    class:
      "badge !bg-warning/10 !text-warning !py-[0.25rem] !px-[0.45rem] !text-[0.75em] ms-2"
  }
];
