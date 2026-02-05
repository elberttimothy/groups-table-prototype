import { useState } from 'react'
import { Button } from './components/Button/Button'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app">
      <h1>Autone Prototypes</h1>
      <div className="card">
        <Button onClick={() => setCount((count) => count + 1)}>
          Count is {count}
        </Button>
      </div>
      <p className="read-the-docs">
        Edit <code>src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
}

export default App

