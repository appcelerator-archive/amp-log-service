import docker from './Docker'

async function getServiceMap() {
  const services = await docker.listServicesAsync()
  const map = {}
  for (const service of services) {
    map[service.ID] = service
  }
  return map
}

export default getServiceMap
