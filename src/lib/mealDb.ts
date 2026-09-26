import type { MealDbMeal, RecipeDetail, RecipeSummary } from '../types'

const API_BASE = 'https://www.themealdb.com/api/json/v1/1'
const MAX_SEARCH_RESULTS = 12

async function request<T>(path: string): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${API_BASE}/${path}`)
  } catch {
    throw new Error('Could not reach the recipe service. Check your internet connection.')
  }

  if (!response.ok) {
    throw new Error(`The recipe service returned error ${response.status}. Please try again later.`)
  }

  return response.json() as Promise<T>
}

function toSummary(meal: MealDbMeal): RecipeSummary {
  return {
    id: meal.idMeal,
    title: meal.strMeal,
    image: meal.strMealThumb,
    category: meal.strCategory || 'Recipe',
    area: meal.strArea || 'Unknown',
    source: 'api',
  }
}

export async function searchRecipes(searchText: string): Promise<RecipeSummary[]> {
  const path = searchText
    ? `search.php?s=${encodeURIComponent(searchText)}`
    : 'filter.php?c=Seafood'
  const result = await request<{ meals: MealDbMeal[] | null }>(path)
  return (result.meals ?? []).slice(0, MAX_SEARCH_RESULTS).map(toSummary)
}

export async function getRecipeDetails(recipeId: string): Promise<RecipeDetail | null> {
  const result = await request<{ meals: MealDbMeal[] | null }>(`lookup.php?i=${encodeURIComponent(recipeId)}`)
  const meal = result.meals?.[0]

  if (!meal) return null

  const ingredients = Array.from({ length: 20 }, (_, index) => {
    const number = index + 1
    const name = meal[`strIngredient${number}`]?.trim()
    const measure = meal[`strMeasure${number}`]?.trim()
    return name ? `${measure ? `${measure} ` : ''}${name}`.trim() : ''
  }).filter(Boolean)

  return {
    ...toSummary(meal),
    ingredients,
    instructions: meal.strInstructions || 'Instructions are not available for this recipe.',
  }
}