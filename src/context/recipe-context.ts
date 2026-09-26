import { createContext } from 'react'
import type { MyRecipe, NewRecipeData } from '../types'

export interface RecipeContextValue {
  myRecipes: MyRecipe[]
  addRecipe: (recipe: NewRecipeData) => MyRecipe
}

export const RecipeContext = createContext<RecipeContextValue | null>(null)