// Вида на уведомлението.
export type NotificationType = "success" | "error" | "warning";

// Интерфейс за уведомление, което съдържа съобщение и тип на уведомлението.
export interface NotificationState {
  message: string;
  type: NotificationType;
}

// Общи данни за режисьори, актьори и писатели
export interface CommonData {
  avg_imdb_rating: number; // Среден рейтинг в IMDb
  avg_metascore: number; // Среден Metascore
  total_box_office: string; // Общо приходи от бокс офис
  avg_rotten_tomatoes: string; // Среден рейтинг в Rotten Tomatoes
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации
  prosperityScore: number; // Индекс на просперитет
  movie_series_count: number; // Брой филми и сериали
  total_recommendations: number; // Общо препоръки
  recommendations_count?: number; // Брой препоръки за конкретен елемент
  saved_count?: number; // Брой пъти запазвано
}

// Данни за режисьори, включително общи данни
export interface DirectorData extends CommonData {
  director_en: string; // Име на режисьора на английски
  director_bg: string; // Име на режисьора на български
}

// Данни за актьори, включително общи данни
export interface ActorData extends CommonData {
  actor_en: string; // Име на актьора на английски
  actor_bg: string; // Име на актьора на български
}

// Данни за писатели, включително общи данни
export interface WriterData extends CommonData {
  writer_en: string; // Име на писателя на английски
  writer_bg: string; // Име на писателя на български
}

// Интерфейс за филм с всички основни данни за филма.
export interface MovieSeriesRecommendation {
  id: number; // Уникален идентификатор за записа в базата данни
  user_id: number; // Идентификатор на потребителя, който е направил препоръката
  imdbID: string; // Уникален идентификатор на филма/сериала от IMDb
  title_en: string; // Заглавие на филма/сериала на английски език
  title_bg: string; // Заглавие на филма/сериала на български език
  genre_en: string; // Жанрове на английски език (като низ)
  genre_bg: string; // Жанрове на български език (като низ)
  reason: string; // Причина за препоръката
  recommendations: string; // Препоръки, свързани със съдържанието
  description: string; // Описание на филма/сериала
  year: string; // Година на излизане
  rated: string; // Оценка за възрастово ограничение
  released: string; // Дата на излизане
  runtime: string; // Продължителност на филма/епизода
  director: string; // Режисьор на филма/сериала
  writer: string; // Сценарист на филма/сериала
  actors: string; // Актьори във филма/сериала
  plot: string; // Сюжет на филма/сериала
  language: string; // Език на филма/сериала
  country: string; // Страна на произход
  awards: string; // Награди, спечелени от филма/сериала
  poster: string; // URL на постера на филма/сериала
  ratings: string; // Рейтинги от различни източници (напр. IMDb, Rotten Tomatoes)
  metascore: string; // Metascore рейтинг на филма/сериала
  imdbRating: string; // IMDb рейтинг на филма/сериала
  imdbVotes: string; // Общ брой гласове в IMDb
  type: string; // Тип съдържание (напр. "movie", "series")
  DVD: string; // Дата на излизане на DVD (ако е налично)
  boxOffice: string; // Приходи от боксофиса
  production: string; // Продуцентска компания
  website: string; // Официален уебсайт на филма/сериала
  totalSeasons: string; // Общ брой сезони (ако е сериал)
  oscar_wins: string; // Брой спечелени Оскари
  oscar_nominations: string; // Брой номинации за Оскар
  total_wins: string; // Общо спечелени награди
  total_nominations: string; // Общо номинации за награди
  prosperityScore: number; // Индекс на популярност или успех на съдържанието
}

// Интерфейс за книга с всички основни данни за книгата.
export interface BookRecommendation {
  id: string; // ID на книгата
  user_id: string; // ID на потребителя, свързан с книгата
  google_books_id: string; // Google Books идентификатор
  goodreads_id: string; // Goodreads идентификатор
  title_en: string; // Английско заглавие на книгата
  title_bg: string; // Българско заглавие на книгата
  real_edition_title: string; // Реално заглавие на изданието
  author: string | Promise<string>; // Име на автора (може да е обещание)
  publisher: string; // Издателство
  genre_en: string | Promise<string>; // Жанрове на английски (може да е обещание)
  genre_bg: string | Promise<string>; // Жанрове на български (може да е обещание)
  description: string | Promise<string>; // Описание на книгата (може да е обещание)
  language: string | Promise<string>; // Езици на книгата (може да е обещание)
  origin: string; // Страна на произход
  literary_awards: string; // Награди на книгата
  setting: string; // Мястото, в което се развива сюжета
  characters: string; // Героите в сюжета
  series: string; // Поредица
  date_of_first_issue: string; // Дата на първо издание
  date_of_issue: string; // Дата на издаване
  goodreads_rating: number; // Goodreads рейтинг
  goodreads_ratings_count: number; // Брой гласове в Goodreads
  goodreads_reviews_count: number; // Брой ревюта в Goodreads
  reason: string; // Причина за препоръката
  adaptations: string; // Адаптации на книгата
  ISBN_10: string; // ISBN-10
  ISBN_13: string; // ISBN-13
  page_count: string; // Брой страници
  book_format: string; // Вид на книгата (тип корица, е-книги)
  imageLink: string; // Линк към изображение на книгата
  source: string; // Източник (напр. Google Books)
}
