import { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/items'

function App() {
  const [items, setItems] = useState([])
  const [queuedItems, setQueuedItems] = useState([]) // items created locally and not yet synced
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [syncing, setSyncing] = useState(false)

  // Initialize: load queued items and fetch remote items
  useEffect(() => {
    const saved = localStorage.getItem('grocery_queue')
    if (saved) {
      try {
        setQueuedItems(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse saved queue', e)
      }
    }

    fetchItems()

    // Periodically attempt to sync queued items
    const interval = setInterval(() => {
      checkAndSyncQueue()
    }, 5000)

    window.addEventListener('online', handleOnline)
    return () => {
      clearInterval(interval)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  const handleOnline = () => {
    setError(null)
    checkAndSyncQueue()
  }

  const saveQueue = (q) => {
    try {
      localStorage.setItem('grocery_queue', JSON.stringify(q))
    } catch (e) {
      console.error('Failed to save queue', e)
    }
  }

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error(response.statusText || 'Network response not ok')
      const data = await response.json()
      if (data && data.success) {
        setItems(data.data)
        setError(null)
      } else {
        setError('Failed to fetch items')
      }
    } catch (err) {
      setError('Failed to fetch items (backend unreachable)')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // Try to sync any queued items to backend
  const checkAndSyncQueue = async () => {
    if (!queuedItems || queuedItems.length === 0) return
    setSyncing(true)
    const remaining = []
    for (let qi of queuedItems) {
      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: qi.text })
        })
        const data = await response.json()
        if (data && data.success) {
          // replace temp item in items list with returned item
          setItems(prev => {
            return prev.map(it => (it._id === qi._id ? data.data : it))
          })
        } else {
          remaining.push(qi)
        }
      } catch (err) {
        console.error('Sync failed for item', qi, err)
        remaining.push(qi)
      }
    }

    setQueuedItems(remaining)
    saveQueue(remaining)
    setSyncing(false)
    if (remaining.length === 0) fetchItems()
  }

  const addDefaultItems = async () => {
    try {
      const defaultItems = [
        { text: 'Milk' },
        { text: 'Bread' }
      ]
      for (let item of defaultItems) {
        await fetch(API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(item)
        })
      }
      // Refresh items after adding defaults
      fetchItems()
    } catch (err) {
      console.error('Error adding default items:', err)
    }
  }

  const addItem = async () => {
    if (!input.trim()) return
    const newItemText = input.trim()
    setInput('')

    // create optimistic temp item
    const tempId = `temp-${Date.now()}`
    const tempItem = { _id: tempId, text: newItemText, completed: false, _temp: true }

    // show immediately in UI
    setItems(prev => [tempItem, ...prev])

    // add to queue for sync
    const newQueue = [{ _id: tempId, text: newItemText }, ...queuedItems]
    setQueuedItems(newQueue)
    saveQueue(newQueue)

    // attempt to sync now (will retry in background if fails)
    try {
      await checkAndSyncQueue()
      setError(null)
    } catch (err) {
      setError('Failed to add item (will retry)')
      console.error(err)
    }
  }

  const deleteItem = async (id) => {
    // if this is a temp queued item, remove locally
    if (id && id.toString().startsWith('temp-')) {
      const remainingQueue = queuedItems.filter(q => q._id !== id)
      setQueuedItems(remainingQueue)
      saveQueue(remainingQueue)
      setItems(prev => prev.filter(i => i._id !== id))
      setError(null)
      return
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })
      const data = await response.json()
      if (data && data.success) {
        fetchItems()
        setError(null)
      } else {
        setError('Failed to delete item')
      }
    } catch (err) {
      setError('Failed to delete item')
      console.error(err)
    }
  }

  const toggleComplete = async (id) => {
    const item = items.find(i => i._id === id)
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          text: item.text, 
          completed: !item.completed 
        })
      })
      const data = await response.json()
      if (data.success) {
        fetchItems()
        setError(null)
      } else {
        setError('Failed to update item')
      }
    } catch (err) {
      setError('Failed to update item')
      console.error(err)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addItem()
    }
  }

  return (
    <div className="container">
      <h1>🛒 Grocery List</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="input-section">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Add a grocery item..."
          className="input-field"
        />
        <button onClick={addItem} className="add-btn">Add</button>
        <button onClick={addDefaultItems} className="default-btn" title="Add default items">📋</button>
      </div>

      <div className="list-section">
        {loading ? (
          <p className="empty-message">Loading items...</p>
        ) : ( 
          (() => {
            // combine queued (local) items and remote items without duplicates
            const queuedIds = new Set(queuedItems.map(q => q._id))
            const displayed = [
              ...queuedItems.map(q => ({ ...q, completed: false, _temp: true })),
              ...items.filter(it => !queuedIds.has(it._id))
            ]

            if (displayed.length === 0) {
              return <p className="empty-message">No items yet. Add one to get started!</p>
            }

            return (
              <ul className="grocery-list">
                {displayed.map(item => (
                  <li key={item._id} className={`list-item ${item.completed ? 'completed' : ''}`}>
                    <input
                      type="checkbox"
                      checked={!!item.completed}
                      onChange={() => item._temp ? null : toggleComplete(item._id)}
                      className="checkbox"
                      disabled={!!item._temp}
                    />
                    <span className="item-text">{item.text}{item._temp ? ' (pending)' : ''}</span>
                    <button
                      onClick={() => deleteItem(item._id)}
                      className="delete-btn"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            )
          })()
        )}
      </div>

      <div className="stats">
        <p>Total items: <strong>{items.length + queuedItems.length}</strong></p>
        <p>Completed: <strong>{items.filter(i => i.completed).length}</strong></p>
      </div>
    </div>
  )
}

export default App
