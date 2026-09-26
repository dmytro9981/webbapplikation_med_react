import { useState, type ReactNode } from 'react'
import type { MyRecipe, NewRecipeData } from '../types'
import { RecipeContext } from './recipe-context'

function readStored<T>(key: string): T[] {
  try {
    const saved = localStorage.getItem(key)
    return saved ? (JSON.parse(saved) as T[]) : []
  } catch {
    return []
  }
}

function writeStored<T>(key: string, value: T[]) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {}
}

export function RecipeProvider({ children }: { children: ReactNode }) {
  const [myRecipes, setMyRecipes] = useState<MyRecipe[]>(() => readStored('skafferiet-recipes'))

  function addRecipe(input: NewRecipeData) {
    const id = `eget-${Date.now()}`
    const newRecipe: MyRecipe = {
      id,
      title: input.title,
      image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
      category: 'My recipe',
      area: 'Homemade',
      source: 'local',
      ingredients: input.ingredients,
      instructions: input.instructions,
    }
    setMyRecipes((currentRecipes) => {
      const updatedRecipes = [newRecipe, ...currentRecipes]
      writeStored('skafferiet-recipes', updatedRecipes)
      return updatedRecipes
    })
    return newRecipe
  }

  return (
    <RecipeContext.Provider value={{ myRecipes, addRecipe }}>
      {children}
    </RecipeContext.Provider>
  )
}