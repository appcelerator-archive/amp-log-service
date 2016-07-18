/* capture the logs */
/* eslint-disable babel/no-await-in-loop */
import docker from './docker'
import logStore from './logStore'
import parser from './parser'
import serviceMap from './serviceMap'

async function capture () {
  const node = await docker.getNode('').inspectAsync()
  const handled = {}
  // poll tasks
  while (true) { // eslint-disable-line no-constant-condition
    const services = await serviceMap()
    const tasks = await docker.listTasksAsync()
    for (const task of tasks) {
      if (!handled[task.ID]) {
        try {
          // get details
          const serviceName = services[task.ServiceID].Spec.Name
          const container = docker.getContainer(task.Status.ContainerStatus.ContainerID)
          await container.inspectAsync()
          // parse logs
          const parseStream = parser({
            service: serviceName,
            node: node.Description.Hostname,
            slot: task.Slot
          }, {})
          const logs = await container.logsAsync({
            follow: true,
            stdout: true,
            stderr: true
          })
          logs.pipe(parseStream)
          // append to log store
          parseStream.on('data', (d) => {
            logStore.append(serviceName, d)
          })
          handled[task.ID] = true
        } catch (error) {
          if (error.statusCode !== 404) { // eslint-disable-line max-depth
            console.error(error) // eslint-disable-line no-console
          }
        }
      }
    }
    await sleep()
  }
}

export default capture()

function sleep (time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
