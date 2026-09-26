import type { RecipeSummary } from '../types'

interface RecipeListItemProps {
  recipe: RecipeSummary
  selected: boolean
  onSelect: () => void
}

export function RecipeListItem({ recipe, selected, onSelect }: RecipeListItemProps) {
  return (
    <article className={`recipe-list-item${selected ? ' selected' : ''}`}>
      <button className="recipe-list-select" type="button" aria-pressed={selected} onClick={onSelect}>
        <img src={recipe.image} alt="" loading="lazy" />
        <span className="recipe-list-copy">
          <strong>{recipe.title}</strong>
          <span>{recipe.category} · {recipe.area}</span>
        </span>
      </button>
    </article>
  )
}