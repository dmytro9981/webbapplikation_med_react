import { X } from 'lucide-react'
import { useContext, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { RecipeContext } from '../context/recipe-context'

interface RecipeFormDialogProps {
  onClose: () => void
}

export function RecipeFormDialog({ onClose }: RecipeFormDialogProps) {
  const recipeContext = useContext(RecipeContext)
  if (!recipeContext) throw new Error('RecipeFormDialog must be used inside RecipeProvider')
  const { addRecipe } = recipeContext
  const navigate = useNavigate()
  const [recipeName, setRecipeName] = useState('')
  const [ingredientText, setIngredientText] = useState('')
  const [instructions, setInstructions] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [formError, setFormError] = useState('')
  const ingredientList = ingredientText.split('\n').map((ingredient) => ingredient.trim()).filter(Boolean)
  const recipeNameError = hasSubmitted && recipeName.trim().length < 2 ? 'Enter a name with at least two characters.' : ''
  const ingredientsError = hasSubmitted && ingredientList.length === 0 ? 'Add at least one ingredient.' : ''
  const instructionsError = hasSubmitted && instructions.trim().length < 10 ? 'Write at least 10 characters of instructions.' : ''

  function saveRecipe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSubmitted(true)
    setFormError('')
    if (recipeName.trim().length < 2 || ingredientList.length === 0 || instructions.trim().length < 10) {
      setFormError('Check the highlighted fields before saving.')
      return
    }
    try {
      const recipe = addRecipe({ title: recipeName.trim(), ingredients: ingredientList, instructions: instructions.trim() })
      onClose()
      navigate(`/recipes/${recipe.id}`)
    } catch {
      setFormError('Could not save the recipe on this device. Check your browser storage.')
    }
  }

  return (
    <div className="form-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className="recipe-form-dialog" role="dialog" aria-modal="true" aria-labelledby="form-title">
        <div className="dialog-heading">
          <div>
            <p className="eyebrow">From your kitchen</p>
            <h2 id="form-title">Add a recipe</h2>
            <p>Your recipe is saved on this device.</p>
          </div>
          <button className="form-close" type="button" aria-label="Close" onClick={onClose}><X size={20} /></button>
        </div>
        <form className="recipe-form" onSubmit={saveRecipe} noValidate>
          <div className="form-field">
            <label htmlFor="recipe-title">Recipe name *</label>
            <input id="recipe-title" value={recipeName} onChange={(event) => setRecipeName(event.target.value)} aria-invalid={Boolean(recipeNameError)} aria-describedby={recipeNameError ? 'title-error' : undefined} />
            {recipeNameError && <span className="field-error" id="title-error">{recipeNameError}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="recipe-ingredients">Ingredients, one per line *</label>
            <textarea id="recipe-ingredients" value={ingredientText} onChange={(event) => setIngredientText(event.target.value)} aria-invalid={Boolean(ingredientsError)} aria-describedby={ingredientsError ? 'ingredients-error' : undefined} />
            {ingredientsError && <span className="field-error" id="ingredients-error">{ingredientsError}</span>}
          </div>
          <div className="form-field">
            <label htmlFor="recipe-instructions">Instructions *</label>
            <textarea id="recipe-instructions" value={instructions} onChange={(event) => setInstructions(event.target.value)} aria-invalid={Boolean(instructionsError)} aria-describedby={instructionsError ? 'instructions-error' : undefined} />
            {instructionsError && <span className="field-error" id="instructions-error">{instructionsError}</span>}
          </div>
          {formError && <p className="form-error-summary" role="alert">{formError}</p>}
          <div className="form-actions">
            <button className="secondary-button" type="button" onClick={onClose}>Cancel</button>
            <button className="primary-button" type="submit">Save recipe</button>
          </div>
        </form>
      </section>
    </div>
  )
}