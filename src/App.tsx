import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { RecipeProvider } from './context/RecipeContext'
import { HomePage } from './pages/HomePage'
import { RecipePage } from './pages/RecipePage'
import './App.css'

function App() {
  return (
    <RecipeProvider>
      <BrowserRouter>
        <div className="app-shell">
          <AppHeader />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/recipes/:recipeId" element={<RecipePage />} />
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>
          <footer className="site-footer">
            <span className="footer-mark">P</span>
            <span>Good food, without the fuss.</span>
            <span className="footer-credit">Recipe data from TheMealDB</span>
          </footer>
        </div>
      </BrowserRouter>
    </RecipeProvider>
  )
}

export default App
