import { useState } from 'react'
import { Button } from '@/atoms';
import { useGetHealthQuery } from './store/api';

function App() {
  const [count, setCount] = useState(0)
  const { data, isLoading, error } = useGetHealthQuery()

  console.log(data)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <div className='flex flex-col'>
        <h1>Health: {data?.status}</h1>
        <p>Timestamp: {data?.timestamp}</p>
        <p>Database: {data?.database}</p>
        <p>Error: {data?.error}</p>
      </div>
    </div>
  )
}

export default App

