export const metricConfig = {
  fpr: {
    title: "FPR",
    description: "Честота на неподходящи предложени препоръки (FP)",
    tooltip: (
      <>
        Измерва колко от всички <strong>НЕподходящи</strong> препоръки в
        системата всъщност <strong>са</strong> препоръчани на потребителя.
        Колкото <strong>по-ниска</strong> е стойността, толкова{" "}
        <strong>по-малко</strong> грешни препоръки прави моделът.
      </>
    )
  },
  specificity: {
    title: "Specificity",
    description: "Честота на неподходящи пропуснати препоръки (TN)",
    tooltip: (
      <>
        Измерва колко от всички <strong>НЕподходящи</strong> препоръки в
        системата всъщност <strong>НЕ</strong> са препоръчани на потребителя.
        Докато <strong>Recall (TPR)</strong> се фокусира върху това да даде
        представа доколко моделът пропуска релевантни препоръки (FN),{" "}
        <strong>Specificity (TNR)</strong> показва доколко добре моделът избягва
        да предлага нерелевантни препоръки (TN) –{" "}
        <strong>да не ги счита за релевантни</strong>.
      </>
    )
  },
  fnr: {
    title: "FNR",
    description: "Честота на подходящи пропуснати препоръки (FN)",
    tooltip: (
      <>
        Измерва колко от всички <strong>подходящи</strong> препоръки в системата
        всъщност <strong>НЕ</strong> са препоръчани на потребителя. Колкото
        <strong>по-висока</strong> е стойността, толкова <strong>повече</strong>{" "}
        подходящи (релевантни) препоръки моделът <strong>НЕ</strong> успява да
        препоръча.
      </>
    )
  },
  accuracy: {
    title: "Accuracy",
    description: "Обща точност",
    tooltip: (
      <>
        Общата точност на модела отчита както{" "}
        <strong>верните положителни (TP)</strong>, така и{" "}
        <strong>верните отрицателни (TN)</strong> предположения на ИИ. Както
        може ИИ да ни препоръча нещо, което е сметнал за подходящо и то наистина
        да е такова, така може и да <strong>ПРОПУСНЕ</strong> нещо, което в
        действителност <strong>НЕ Е</strong> подходящо за нас. Технически,{" "}
        <strong>ИИ пак е направил вярно предположение</strong>.
      </>
    )
  }
};
