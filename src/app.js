import express from 'express'
import logs from './lib/logs'

const app = express()

export default app

app.use(logs)

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
