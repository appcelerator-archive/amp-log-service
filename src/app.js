import express from 'express'
import logApp from './lib/logApp'

const app = express()

export default app

app.use(logApp)

app.listen(80)

// close server gracefully...
// handle ctrl-c
exitOnSignal('SIGINT')
// handle docker stop
exitOnSignal('SIGTERM')

function exitOnSignal(signal) {
  process.on(signal, () => {
    process.exit()
  })
}

process.on('unhandledRejection', (reason, p) => {
  throw reason
})
