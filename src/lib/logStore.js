import EventEmitter from 'events'

class LogStore extends EventEmitter {
  constructor(...args) {
    super(...args)
    this.data = {}
  }
  append(service, data) {
    this.data[service] = this.data[service] || []
    this.data[service].push(data)
    this.emit(service, data)
  }
  dump(service) {
    return this.data[service] || []
  }
}

export default new LogStore()
