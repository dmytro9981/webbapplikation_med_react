import { ArrowLeft, Clock3, LoaderCircle, MapPin } from 'lucide-react'
import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { RecipeContext } from '../context/recipe-context'
import { getRecipeDetails } from '../lib/mealDb'
import type { RecipeDetail } from '../types'

interface RecipePageState {
  requestKey: string
  details: RecipeDetail | null
  error: string
}

export function RecipePage() {
  const { recipeId = '' } = useParams()
  const recipesContext = useContext(RecipeContext)
  if (!recipesContext) throw new Error('RecipePage must be used inside RecipeProvider')
  const { myRecipes } = recipesContext
  const savedRecipe = myRecipes.find((recipe) => recipe.id === recipeId)
  const [detailResult, setDetailResult] = useState<RecipePageState | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const requestKey = `${recipeId}:${retryCount}`

  useEffect(() => {
    if (savedRecipe) return
    let isCurrentRequest = true
    getRecipeDetails(recipeId)
      .then((recipeDetails) => {
        if (isCurrentRequest) {
          setDetailResult({
            requestKey,
            details: recipeDetails,
            error: recipeDetails ? '' : 'Recipe not found.',
          })
        }
      })
      .catch((reason: unknown) => {
        if (isCurrentRequest) {
          setDetailResult({
            requestKey,
            details: null,
            error: reason instanceof Error ? reason.message : 'Could not load the recipe.',
          })
        }
      })
    return () => { isCurrentRequest = false }
  }, [savedRecipe, recipeId, requestKey])

  const hasCurrentResult = detailResult?.requestKey === requestKey
  const isLoading = !savedRecipe && !hasCurrentResult
  const error = hasCurrentResult ? detailResult.error : ''
  const recipeToShow = savedRecipe ?? (hasCurrentResult ? detailResult.details : null)

  return (
    <div className="detail-wrap">
      <Link className="back-link" to="/"><ArrowLeft size={15} /> Back to recipes</Link>
      {isLoading && <div className="loading-state" role="status"><LoaderCircle size={25} /><span>Loading recipe…</span></div>}
      {!isLoading && error && (
        <div className="error-state" role="alert">
          <strong>Recipe could not be shown</strong><p>{error}</p>
          {!error.includes('found') && <button className="primary-button" type="button" onClick={() => setRetryCount((count) => count + 1)}>Try again</button>}
        </div>
      )}
      {!isLoading && recipeToShow && (
        <article className="recipe-detail">
          <img className="detail-photo" src={recipeToShow.image} alt={recipeToShow.title} />
          <div className="recipe-detail-copy">
            <p className="eyebrow">{recipeToShow.category}</p>
            <h1 className="recipe-title">{recipeToShow.title}</h1>
            <p className="detail-intro">A recipe to bring everyone to the table. Gather your ingredients and cook at your own pace.</p>
            <div className="detail-facts">
              <span><Clock3 size={15} /> Everyday friendly</span>
              <span><MapPin size={15} /> {recipeToShow.area}</span>
            </div>
          </div>
          <div className="recipe-methods">
            <section className="detail-section">
              <h2>Ingredients</h2>
              {recipeToShow.ingredients.length > 0
                ? <ul className="ingredient-list">{recipeToShow.ingredients.map((ingredient, index) => <li key={`${ingredient}-${index}`}>{ingredient}</li>)}</ul>
                : <p className="instructions">No ingredients are available for this recipe.</p>}
            </section>
            <section className="detail-section">
              <h2>Instructions</h2>
              <p className="instructions">{recipeToShow.instructions}</p>
            </section>
          </div>
        </article>
      )}
    </div>
  )
}