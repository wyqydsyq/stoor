let storage = {}

const inMemory = {
  getItem (key) {
    return storage[key] || null
  },

  setItem (key, value) {
    storage[key] = value
    return true
  },

  removeItem (key) {
    if (key in storage) {
      return delete storage[key]
    }

    return false
  },

  clear () {
    storage = {}
    return true
  }
}

// http://stackoverflow.com/a/27081419
const isSupported = function (storageType) {
  if (typeof storageType === 'object') {
    try {
      storageType.setItem('localStorage', 1)
      storageType.removeItem('localStorage')
      return true
    } catch (e) {
      return false
    }
  }

  return false
}

class Stoor {
  constructor ({ namespace = '', fallback = inMemory, storage = 'local' } = { }) {
    if (!(this instanceof Stoor)) {
      return new Stoor({ namespace, fallback, storage })
    }

    if (!fallback.getItem || !fallback.setItem || !fallback.removeItem) {
      throw new Error('Invalid fallback provided')
    }

    if (storage === 'session') {
      this.storage = isSupported(window.sessionStorage) ? window.sessionStorage : fallback
    } else {
      this.storage = isSupported(window.localStorage) ? window.localStorage : fallback
    }

    this.namespace = namespace
  }

  get (key, def = null) {
    if (Array.isArray(key)) {
      return key.map(currentKey => {
        const namespacedKey = `${this.namespace}:${currentKey}`
        return JSON.parse(this.storage.getItem(namespacedKey))
      })
    }

    const namespacedKey = `${this.namespace}:${key}`

    try {
      const result = JSON.parse(this.storage.getItem(namespacedKey))
      return result !== null ? result : def
    } catch (error) {
      return def
    }
  }

  set (key, value) {
    if (Array.isArray(key)) {
      return key.map(pair => {
        const [key, value] = pair
        const namespacedKey = `${this.namespace}:${key}`
        return this.storage.setItem(namespacedKey, JSON.stringify(value))
      })
    }

    const namespacedKey = `${this.namespace}:${key}`
    return this.storage.setItem(namespacedKey, JSON.stringify(value))
  }

  remove (key) {
    if (Array.isArray(key)) {
      return key.map(currentKey => {
        const namespacedKey = `${this.namespace}:${currentKey}`
        return this.storage.removeItem(namespacedKey)
      })
    }

    const namespacedKey = `${this.namespace}:${key}`
    return this.storage.removeItem(namespacedKey)
  }

  clear () {
    return this.storage.clear()
  }
}

export default Stoor
