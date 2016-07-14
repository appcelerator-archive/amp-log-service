/* eslint-disable */
import docker from './Docker'
import logStore from './logStore'
import nodePromise from './nodePromise'
import parser from './parser'
import serviceMap from './serviceMap'

async function init () {
  const node = await nodePromise
  const handled = {}
  while (true) {
    const services = await serviceMap()
    const tasks = await docker.listTasksAsync()
    for (const task of tasks) {
      if (!handled[task.ID]) {
        try {
          const serviceName = services[task.ServiceID].Spec.Name
          const container = docker.getContainer(task.Status.ContainerStatus.ContainerID)
          await container.inspectAsync()
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
          parseStream.on('data', (d) => {
            logStore.append(serviceName, d)
          })
          handled[task.ID] = true
        } catch (error) {
          if (error.statusCode !== 404) {
            console.error(error)
          }
        }
      }
    }
    await sleep()
  }
}

export default init()

function sleep (time = 1000) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
