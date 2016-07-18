/* eslint-disable no-console, babel/no-await-in-loop */
/* serve logs to the browser */
import capture from './capture'
import express from 'express'
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

capture.catch(error => console.error(error))
