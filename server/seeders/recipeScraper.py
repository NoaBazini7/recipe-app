import requests
from bs4 import BeautifulSoup
import json
import time
import random

headers = {
    "User-Agent": "Mozilla/5.0"
}


def search_recipes(query):
    url = f"https://www.allrecipes.com/search?q={query}"
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    links = []
    for a in soup.select("a.mntl-card-list-card--extendable"):
        href = a.get("href")
        if href and "/recipe/" in href:
            links.append(href)

    return list(set(links))  # remove duplicates


def parse_recipe(url):
    print(f"🔍 Parsing: {url}")
    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.content, "html.parser")

    title = soup.find("h1").text.strip() if soup.find("h1") else "No title"

    category_elements = soup.select('ul#mntl-universal-breadcrumbs_1-0 li')
    category= category_elements[1].get_text(strip= True)

    # Ingredients
    ingredients = []
    for li in soup.select("ul.mm-recipes-structured-ingredients__list li"):
        text = li.get_text(separator=" ", strip=True)  # Use separator to clean up spacing
        if text:
            ingredients.append(text)

    # Steps

    # Find the ordered list containing the steps
    steps_ol = soup.find('ol', class_='mntl-sc-block-group--OL')

    # Extract all list items inside it
    step_items = steps_ol.find_all('li', class_='mntl-sc-block-group--LI')

    # Extract just the <p> text from each step
    steps = [step.find('p').get_text(strip=True) for step in step_items]


    # Rating
    stars = soup.find('div', class_= 'comp mm-recipes-review-bar__rating mntl-text-block text-label-300');
    rating= stars.get_text(strip=True);

    # Image
    image_tag = soup.select_one("figure.photo img")

    if image_tag:
        # Prefer 'data-src' if available (more reliable than 'src' for lazy-loaded images)
        image_url = image_tag.get("data-src") or image_tag.get("src")
    else:
        image_url = None
    # Calories
    rows = soup.select("table.mm-recipes-nutrition-facts-summary__table tbody tr")
    calories = "Calories not listed"
    if rows:
        first_row = rows[0]
        calories_cell = first_row.select_one("td")
        if calories_cell:
            calories = calories_cell.text.strip()
    # Extract Prep, Cook, and Total Time, and Servings
    prep_time = cook_time = total_time = servings = None

    for item in soup.select("div.mm-recipes-details__item"):
        label = item.find("div", class_="mm-recipes-details__label")
        if label:
            label_text = label.text.strip().lower()
            if "prep time" in label_text:
                prep_time = item.find("div", class_="mm-recipes-details__value").text.strip()
            elif "cook time" in label_text:
                cook_time = item.find("div", class_="mm-recipes-details__value").text.strip()
            elif "total time" in label_text:
                total_time = item.find("div", class_="mm-recipes-details__value").text.strip()
            elif "servings" in label_text:
                servings = item.find("div", class_="mm-recipes-details__value").text.strip()

    prep_time = prep_time or "Prep time not listed"
    cook_time = cook_time or "Cook time not listed"
    total_time = total_time or "Total time not listed"
    servings = servings or "Servings not listed"

    return {
        "title": title,
        "url": url,
        "category": category,
        "ingredients": ingredients,
        "steps": steps,
        "rating": rating,
        "image": image_url,
        "calories": calories,
        "prep_time": prep_time,
        "cook_time": cook_time,
        "total_time": total_time,
        "servings": servings,

    }

def scrape_and_save(search_terms, max_per_term=3):
    all_recipes = []
    for term in search_terms:
        print(f"🔎 Searching for: {term}")
        links = search_recipes(term)
        for link in links[:max_per_term]:
            try:
                recipe = parse_recipe(link)
                print(recipe)
                all_recipes.append(recipe)
                time.sleep(random.uniform(1.5, 3.0))
            except Exception as e:
                print(f"❌ Error: {e}")

    with open("recipes.json", "w", encoding="utf-8") as f:
        json.dump(all_recipes, f, ensure_ascii=False, indent=4)

    print(f"\n✅ Done! {len(all_recipes)} recipes saved to recipes.json")

# Start scraping
search_terms = [
    "breakfast", "lunch", "dinner", "brunch",
    "mexican", "indian", "italian", "japanese", "thai",
    "vegan", "gluten free", "keto", "low carb",
    "cake", "cookies", "brownies", "ice cream",
    "holiday", "party", "bbq", "picnic",
    "chicken", "beef", "tofu", "fish", "shrimp",
    "healthy", "slow cooker", "one pot"
]

scrape_and_save(search_terms, max_per_term=10)