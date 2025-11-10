// src/App.tsx
import './App.css'
import { TodoApp } from './components/TodoApp'

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground w-full">
      <TodoApp />
    </div>
  )
}

export default App
