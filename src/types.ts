export interface RecipeSummary {
  id: string
  title: string
  image: string
  category: string
  area: string
  source: 'api' | 'local'
}

export interface RecipeDetail extends RecipeSummary {
  ingredients: string[]
  instructions: string
}

export interface MealDbMeal {
  idMeal: string
  strMeal: string
  strMealThumb: string
  strCategory?: string | null
  strArea?: string | null
  strInstructions?: string | null
  [key: string]: string | null | undefined
}

export interface MyRecipe extends RecipeDetail {
  source: 'local'
}

export interface NewRecipeData {
  title: string
  ingredients: string[]
  instructions: string
}