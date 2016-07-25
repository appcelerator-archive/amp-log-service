/* promisified Docker instance */
import Container from 'dockerode/lib/container'
import Docker from 'dockerode/lib/docker'
import Exec from 'dockerode/lib/exec'
import Image from 'dockerode/lib/image'
import Network from 'dockerode/lib/network'
import Node from 'dockerode/lib/node'
import { promisifyAll } from 'bluebird'
import Service from 'dockerode/lib/service'
import Task from 'dockerode/lib/task'
import Volume from 'dockerode/lib/volume'

promisifyAll(Container.prototype)
promisifyAll(Docker.prototype)
promisifyAll(Exec.prototype)
promisifyAll(Image.prototype)
promisifyAll(Network.prototype)
promisifyAll(Node.prototype)
promisifyAll(Service.prototype)
promisifyAll(Task.prototype)
promisifyAll(Volume.prototype)

export default new Docker({
  socketPath: '/var/run/docker.sock'
})
