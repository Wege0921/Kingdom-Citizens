'use client'

interface LocalProgress {
  sermonId: string
  userId: string
  progressPercent: number
  status: 'in_progress' | 'completed'
  lastReadAt: string
}

const DB_NAME = 'kingdom-local-data'
const PROGRESS_STORE = 'reading_progress'
const DB_VERSION = 1

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(PROGRESS_STORE)) {
        db.createObjectStore(PROGRESS_STORE, { keyPath: 'sermonId' })
      }
    }
  })
}

export async function saveLocalProgress(progress: LocalProgress): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(PROGRESS_STORE, 'readwrite')
  const store = tx.objectStore(PROGRESS_STORE)
  await new Promise<void>((resolve, reject) => {
    const req = store.put(progress)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
  db.close()
}

export async function getLocalProgress(sermonId: string): Promise<LocalProgress | null> {
  const db = await openDB()
  const tx = db.transaction(PROGRESS_STORE, 'readonly')
  const store = tx.objectStore(PROGRESS_STORE)
  const result = await new Promise<LocalProgress | undefined>((resolve, reject) => {
    const req = store.get(sermonId)
    req.onsuccess = () => resolve(req.result as LocalProgress | undefined)
    req.onerror = () => reject(req.error)
  })
  db.close()
  return result ?? null
}

export async function getAllLocalProgress(): Promise<LocalProgress[]> {
  const db = await openDB()
  const tx = db.transaction(PROGRESS_STORE, 'readonly')
  const store = tx.objectStore(PROGRESS_STORE)
  const result = await new Promise<LocalProgress[]>((resolve, reject) => {
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result as LocalProgress[])
    req.onerror = () => reject(req.error)
  })
  db.close()
  return result
}

export async function clearLocalProgress(sermonId: string): Promise<void> {
  const db = await openDB()
  const tx = db.transaction(PROGRESS_STORE, 'readwrite')
  const store = tx.objectStore(PROGRESS_STORE)
  await new Promise<void>((resolve, reject) => {
    const req = store.delete(sermonId)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
  db.close()
}
