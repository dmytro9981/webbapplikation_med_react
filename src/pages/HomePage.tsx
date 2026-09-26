import { LoaderCircle, Search } from 'lucide-react'
import { useContext, useEffect, useState, type FormEvent } from 'react'
import { RecipeListItem } from '../components/RecipeListItem'
import { RecipePreview } from '../components/RecipePreview'
import { RecipeContext } from '../context/recipe-context'
import { searchRecipes } from '../lib/mealDb'
import type { RecipeSummary } from '../types'

interface RecipeSearchState {
  requestKey: string
  recipes: RecipeSummary[]
  error: string
}

export function HomePage() {
  const [searchText, setSearchText] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [selectedRecipeId, setSelectedRecipeId] = useState('')
  const [searchState, setSearchState] = useState<RecipeSearchState | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const searchQuery = submittedSearch.trim()
  const requestKey = `${searchQuery}:${retryCount}`
  const recipesContext = useContext(RecipeContext)
  if (!recipesContext) throw new Error('HomePage must be used inside RecipeProvider')
  const { myRecipes } = recipesContext

  useEffect(() => {
    let isCurrentRequest = true
    searchRecipes(searchQuery)
      .then((recipes) => {
        if (isCurrentRequest) setSearchState({ requestKey, recipes, error: '' })
      })
      .catch((reason: unknown) => {
        if (isCurrentRequest) {
          setSearchState({
            requestKey,
            recipes: [],
            error: reason instanceof Error ? reason.message : 'Ett oväntat fel uppstod.',
          })
        }
      })
    return () => { isCurrentRequest = false }
  }, [searchQuery, requestKey])

  const hasCurrentResult = searchState?.requestKey === requestKey
  const recipes = hasCurrentResult ? searchState.recipes : []
  const isLoading = !hasCurrentResult
  const searchError = hasCurrentResult ? searchState.error : ''
  const selectedRecipe = [...myRecipes, ...recipes].find((recipe) => recipe.id === selectedRecipeId) ?? myRecipes[0] ?? recipes[0]

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedSearch(searchText.trim())
  }

  return (
    <>
      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">Make room for something good</p>
          <h1>What’s for dinner?</h1>
          <p className="hero-description">Find recipes from around the world, or add a favourite of your own.</p>
          <form className="hero-search" onSubmit={submitSearch} role="search">
            <Search size={19} aria-hidden="true" />
            <input aria-label="Search recipes" placeholder="Search for a dish, like pasta" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
            <button className="search-button" type="submit">Search</button>
          </form>
        </div>
      </section>

      <section className="content-wrap browser-wrap">
        <div className="browser-heading">
          <div>
            <p className="eyebrow">Find something to make</p>
            <h2 className="section-title">Recipes for later</h2>
          </div>
        </div>
        <div className="recipe-browser">
          <section className="recipe-list-panel" aria-label="Recipe list">
            <div className="browser-column-heading">
              <div><h3>Recipes</h3><span>{searchQuery ? `Search: ${searchQuery}` : 'Popular recipes'}</span></div>
              <span className="recipe-count">{recipes.length + myRecipes.length}</span>
            </div>
            <div className="recipe-list" aria-live="polite">
              {myRecipes.map((recipe) => <RecipeListItem key={recipe.id} recipe={recipe} selected={selectedRecipe?.id === recipe.id} onSelect={() => setSelectedRecipeId(recipe.id)} />)}
              {isLoading && <div className="loading-state" role="status"><LoaderCircle size={22} /><span>Finding recipes…</span></div>}
              {!isLoading && searchError && <div className="list-error" role="alert"><p>{searchError}</p><button className="text-link" type="button" onClick={() => setRetryCount((count) => count + 1)}>Try again</button></div>}
              {recipes.map((recipe) => <RecipeListItem key={recipe.id} recipe={recipe} selected={selectedRecipe?.id === recipe.id} onSelect={() => setSelectedRecipeId(recipe.id)} />)}
            </div>
          </section>
          <section className="recipe-preview-panel" aria-label="Recipe details">
            {selectedRecipe && <RecipePreview key={selectedRecipe.id} recipe={selectedRecipe} />}
          </section>
        </div>
      </section>
    </>
  )
}