import { useState, useEffect } from 'react'
import {
  Plus,
  Filter,
  Trash2,
  CheckCircle2,
  Circle,
  Edit3,
  Save,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'

import { useToast } from '@/hooks/use-toast'

interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  completedAt?: Date
}

type FilterType = 'all' | 'active' | 'completed'

export const TodoApp = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [inputValue, setInputValue] = useState('')
  const [filter, setFilter] = useState<FilterType>('all')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const { toast } = useToast()

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos')
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
          completedAt: todo.completedAt ? new Date(todo.completedAt) : undefined,
        }))
        setTodos(parsedTodos)
      } catch {
        console.error('Failed to parse todos')
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed
    if (filter === 'completed') return todo.completed
    return true
  })

  const addTodo = () => {
    if (!inputValue.trim()) return
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text: inputValue.trim(),
      completed: false,
      createdAt: new Date(),
    }
    setTodos([newTodo, ...todos])
    setInputValue('')
    toast({ description: 'Todo added ✨' })
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
    toast({ description: 'Todo deleted 🗑️' })
  }

  const toggleTodo = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              completedAt: !todo.completed ? new Date() : undefined,
            }
          : todo
      )
    )
  }

  const startEditing = (id: string, value: string) => {
    setEditingId(id)
    setEditValue(value)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditValue('')
  }

  const saveEditing = () => {
    if (!editingId || !editValue.trim()) return
    setTodos(
      todos.map((todo) =>
        todo.id === editingId ? { ...todo, text: editValue.trim() } : todo
      )
    )
    setEditingId(null)
    setEditValue('')
    toast({ description: 'Todo updated ✏️' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Magic Todo Maker <Badge variant="secondary">TS + Tailwind + Toast</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add a task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <Button onClick={addTodo}>
            <Plus className="w-4 h-4 mr-2" /> Add
          </Button>
        </div>

        <Tabs value={filter} onValueChange={(val) => setFilter(val as FilterType)}>
          <TabsList className="mb-2">
            <TabsTrigger value="all">
              <Filter className="w-4 h-4 mr-1" />
              All
            </TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value={filter}>
            <ul className="space-y-2">
              {filteredTodos.map((todo) => (
                <li
                  key={todo.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <div className="flex items-center gap-2 flex-1">
                    <button onClick={() => toggleTodo(todo.id)}>
                      {todo.completed ? (
                        <CheckCircle2 className="text-green-500" />
                      ) : (
                        <Circle className="text-gray-400" />
                      )}
                    </button>

                    {editingId === todo.id ? (
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="flex-1"
                      />
                    ) : (
                      <span
                        className={`flex-1 ${
                          todo.completed ? 'line-through text-gray-500' : ''
                        }`}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2 ml-2">
                    {editingId === todo.id ? (
                      <>
                        <Button onClick={saveEditing} size="sm" variant="secondary">
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button onClick={cancelEditing} size="sm" variant="ghost">
                          <X className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => startEditing(todo.id, todo.text)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteTodo(todo.id)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
