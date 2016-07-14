/* eslint-disable no-console, babel/no-await-in-loop */
import express from 'express'
import init from './init'
import logStore from './logStore'

const app = express()

export default app

app.get('/:service', wrap(async (req, res) => {
  const service = req.params.service
  res.write('<pre>')
  logStore.dump(service).forEach(writeLine)
  logStore.on(service, writeLine)
  setTimeout(() => {
    logStore.removeListener(service, writeLine)
    res.end('</pre>')
  }, 1000 * (60 + 30))
  function writeLine (line) {
    res.write(line)
  }
}))

function wrap (fn) {
  return function runner (req, res, next) {
    fn(req, res, next).catch(next)
  }
}

init.catch(error => console.error(error))
