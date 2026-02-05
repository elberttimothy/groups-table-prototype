import { useState } from 'react'
import { Button } from '@/atoms';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <h1 className="text-5xl font-bold bg-gradient-to-br from-primary-500 to-secondary-500 bg-clip-text text-transparent">
        Autone Prototypes
      </h1>
      <div className="p-8">
        <Button onClick={() => setCount((count) => count + 1)} aria-label="Increment count" id="increment-count">
          Count is {count}
        </Button>
      </div>
      <p className="text-gray-400 text-sm">
        Edit <code className="bg-white/10 px-2 py-1 rounded font-mono">src/App.tsx</code> and save to test HMR
      </p>
    </div>
  )
}

export default App

