import { Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import { RecipeFormDialog } from './RecipeFormDialog'

export function AppHeader() {
  const [isRecipeFormOpen, setIsRecipeFormOpen] = useState(false)

  return (
    <>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="The Pantry home">
          <span className="brand-mark">P</span>
          <span className="brand-name">the pantry<span>.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Main menu">
          <button className="icon-button" type="button" aria-label="Add your own recipe" title="Add a recipe" onClick={() => setIsRecipeFormOpen(true)}>
            <Plus size={19} />
          </button>
        </nav>
      </header>
      {isRecipeFormOpen && <RecipeFormDialog onClose={() => setIsRecipeFormOpen(false)} />}
    </>
  )
}