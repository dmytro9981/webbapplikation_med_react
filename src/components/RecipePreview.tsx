import { ArrowUpRight, Clock3, LoaderCircle, MapPin } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RecipeContext } from '../context/recipe-context'
import { getRecipeDetails } from '../lib/mealDb'
import type { RecipeDetail, RecipeSummary } from '../types'

interface RecipePreviewProps {
  recipe: RecipeSummary
}

interface RecipeDetailResult {
  id: string
  details: RecipeDetail | null
  error: string
}

export function RecipePreview({ recipe }: RecipePreviewProps) {
  const recipeContext = useContext(RecipeContext)
  if (!recipeContext) throw new Error('RecipePreview must be used inside RecipeProvider')
  const { myRecipes } = recipeContext
  const savedRecipe = recipe.source === 'local' ? myRecipes.find((item) => item.id === recipe.id) : undefined
  const [detailResult, setDetailResult] = useState<RecipeDetailResult | null>(null)
  const [retryKey, setRetryKey] = useState(0)
  const requestId = `${recipe.id}:${retryKey}`

  useEffect(() => {
    if (savedRecipe) return
    let isCurrentRequest = true
    getRecipeDetails(recipe.id)
      .then((recipeDetails) => {
        if (isCurrentRequest) {
          setDetailResult({ id: requestId, details: recipeDetails, error: recipeDetails ? '' : 'Recipe not found.' })
        }
      })
      .catch((reason: unknown) => {
        if (isCurrentRequest) {
          setDetailResult({ id: requestId, details: null, error: reason instanceof Error ? reason.message : 'Could not load the recipe.' })
        }
      })
    return () => { isCurrentRequest = false }
  }, [savedRecipe, recipe.id, requestId])

  const hasCurrentResult = detailResult?.id === requestId
  const recipeDetails = savedRecipe ?? (hasCurrentResult ? detailResult.details : null)
  const isLoading = !savedRecipe && !hasCurrentResult
  const error = hasCurrentResult ? detailResult.error : ''
  if (isLoading) {
    return <div className="loading-state preview-loading" role="status"><LoaderCircle size={25} /><span>Loading recipe details…</span></div>
  }

  if (error || !recipeDetails) {
    return (
      <div className="error-state preview-error" role="alert">
        <strong>Recipe details could not be shown</strong>
        <p>{error || 'Try selecting the recipe again.'}</p>
        <button className="primary-button" type="button" onClick={() => setRetryKey((key) => key + 1)}>Try again</button>
      </div>
    )
  }

  return (
    <article className="recipe-preview">
      <div className="preview-photo-wrap">
        <img className="preview-photo" src={recipeDetails.image} alt={recipeDetails.title} />
      </div>
      <div className="preview-content">
        <p className="recipe-card-meta">{recipeDetails.category}</p>
        <h2>{recipeDetails.title}</h2>
        <div className="detail-facts preview-facts">
          <span><Clock3 size={14} /> Everyday friendly</span>
          <span><MapPin size={14} /> {recipeDetails.area}</span>
          <Link className="text-link" to={`/recipes/${recipeDetails.id}`}>View recipe <ArrowUpRight size={14} /></Link>
        </div>
        <div className="preview-sections">
          <section className="detail-section">
            <h3>Ingredients</h3>
            {recipeDetails.ingredients.length > 0
              ? <ul className="ingredient-list">{recipeDetails.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}</ul>
              : <p className="instructions">No ingredients have been added yet.</p>}
          </section>
          <section className="detail-section">
            <h3>Instructions</h3>
            <p className="instructions">{recipeDetails.instructions}</p>
          </section>
        </div>
      </div>
    </article>
  )
}