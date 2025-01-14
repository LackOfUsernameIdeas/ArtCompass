import sys
import json
import requests
from bs4 import BeautifulSoup

# Check if a URL argument is passed
if len(sys.argv) < 2:
    print("Error: URL is required.")
    sys.exit(1)

# Get the URL from command-line argument
URL = sys.argv[1]

# Function to handle scraping
def scrape_contributor():
    # Send a GET request to fetch the page content
    response = requests.get(URL)
    
    # Check if the request was successful
    if response.status_code != 200:
        print(f"Error: Failed to fetch the page. Status code: {response.status_code}")
        sys.exit(1)

    # Parse the page content with BeautifulSoup
    soup = BeautifulSoup(response.content, 'html.parser')


    # Find the book title
    title_section = soup.find('div', class_='BookPageTitleSection__title')
    book_title = "N/A"
    if title_section:
        title_element = title_section.find('h1', {'data-testid': 'bookTitle'})
        if title_element:
            book_title = title_element.get_text(strip=True)

    # Find the <div> containing contributor links
    contributor_list = soup.find('div', class_='ContributorLinksList')

    if not contributor_list:
        print({"contributors": ["N/A"]})
        sys.exit(0)

    # Extract all contributor names and roles
    contributors = []
    for contributor_link in contributor_list.find_all('a', class_='ContributorLink'):
        name = contributor_link.find('span', class_='ContributorLink__name')
        role = contributor_link.find('span', class_='ContributorLink__role')

        if name:
            contributor_info = {"name": name.get_text(strip=True)}
            if role:
                contributor_info["role"] = role.get_text(strip=True)
            contributors.append(contributor_info)


    # Extract the exact rating value
    rating_div = soup.find('div', class_='RatingStatistics__rating')
    rating = "N/A"
    if rating_div:
        rating = rating_div.get_text(strip=True)
        rating = f"{rating} от 5"

    # Extract the rating count and reviews count
    ratings_count = "N/A"
    reviews_count = "N/A"

    # Find the div that contains both ratings and reviews information
    rating_stats_div = soup.find('div', class_='RatingStatistics__meta')

    if rating_stats_div:
        # Extract ratings count
        ratings_count_elem = rating_stats_div.find('span', {'data-testid': 'ratingsCount'})
        if ratings_count_elem:
            ratings_count = ratings_count_elem.get_text(strip=True)
            # Remove any unwanted text like "ratings"
            ratings_count = ratings_count.replace('ratings', '').strip()

        # Extract reviews count
        reviews_count_elem = rating_stats_div.find('span', {'data-testid': 'reviewsCount'})
        if reviews_count_elem:
            reviews_count = reviews_count_elem.get_text(strip=True)
            # Remove any unwanted text like "reviews"
            reviews_count = reviews_count.replace('reviews', '').strip()

    # Extract the description
    description_div = soup.find('div', {'data-testid': 'description'})
    description = "N/A"
    if description_div:
        description_text = description_div.get_text(strip=True)
        description = description_text

    # Extract genres
    genres_list = soup.find('div', {'data-testid': 'genresList'})
    genres = []
    # If the genresList div exists, extract the genres from it
    if genres_list:
        # Find all the genre buttons (both visible and hidden)
        genre_buttons = genres_list.find_all('a', class_='Button--tag')
        
        # Iterate through each genre button and get the genre name
        for genre_button in genre_buttons:
            genre_name = genre_button.get_text(strip=True)
            if genre_name:
                genres.append(genre_name)

    # Extract Pages count separately
    pages_format_div = soup.find('p', {'data-testid': 'pagesFormat'})
    pages_count = "N/A"
    if pages_format_div:
        pages_count = pages_format_div.get_text(strip=True)

    first_publication_info_div = soup.find('p', {'data-testid': 'publicationInfo'})
    first_publication_info = "N/A"
    if first_publication_info_div:
        first_publication_info = first_publication_info_div.get_text(strip=True)

    # Extract Literary Awards
    literary_awards_div = soup.find('div', class_='TruncatedContent')
    literary_awards = []
    if literary_awards_div:
        awards = literary_awards_div.find_all('a', {'data-testid': 'award'})
        for award in awards:
            literary_awards.append(award.get_text(strip=True))

    # Extract Original Title
    original_title_div = soup.find('div', {'data-testid': 'originalTitle'})
    original_title = "N/A"
    if original_title_div:
        original_title = original_title_div.get_text(strip=True)

    # Extract Series Information
    series_div = soup.find('div', {'data-testid': 'series'})
    series = "N/A"
    if series_div:
        series = series_div.get_text(strip=True)

    # Extract Setting
    setting_div = soup.find('div', {'data-testid': 'setting'})
    setting = "N/A"
    if setting_div:
        setting = setting_div.get_text(strip=True)

    # Extract Characters
    characters_div = soup.find('div', {'data-testid': 'characters'})
    characters = []
    if characters_div:
        character_links = characters_div.find_all('a')
        for character in character_links:
            characters.append(character.get_text(strip=True))

    # Extract Published date
    published_div = soup.find('div', {'data-testid': 'contentContainer'})
    published = "N/A"
    if published_div:
        published = published_div.get_text(strip=True)

    # Extract ISBNs (both ISBN10 and ISBN13)
    isbn13 = "N/A"
    isbn10 = "N/A"
    
    isbn_section = soup.find('div', class_='DescListItem')
    if isbn_section:
        isbn13_tag = isbn_section.find('span', class_='Text Text__subdued')
        if isbn13_tag:
            isbn13 = isbn13_tag.get_text(strip=True)

        isbn10_tag = isbn_section.find('div', {'data-testid': 'contentContainer'})
        if isbn10_tag:
            isbn10 = isbn10_tag.get_text(strip=True)

    # Extract Language
    language_div = soup.find('div', {'data-testid': 'contentContainer'})
    language = "N/A"
    if language_div:
        language = language_div.get_text(strip=True)

    # Print the result
    result = {
        "title": book_title,
        "contributors": contributors,
        "rating": rating,
        "ratings_count": ratings_count,
        "reviews_count": reviews_count,
        "description": description,
        "genres": genres,
        "pages_count": pages_count,
        "first_publication_info": first_publication_info,
        "literary_awards": literary_awards,
        "original_title": original_title,
        "series": series,
        "setting": setting,
        "characters": characters,
        "isbn13": isbn13,
        "isbn10": isbn10,
        "language": language,
        "published": published
    }
    print(json.dumps(result))

if __name__ == "__main__":
    scrape_contributor()
