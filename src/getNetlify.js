require('dotenv').config()
const NetlifyAPI = require('netlify')

const { API_KEY } = process.env
const client = new NetlifyAPI(API_KEY)

const listNetlifySites = async () => await client.listSites()

const simplifySite = ({
  name,
  url,
  state,
  published_deploy: { created_at, updated_at, state: deployState },
}) => ({
  name,
  url,
  state,
  deploy: {
    created_at: new Date(created_at),
    updated_at: new Date(updated_at),
    deployState,
  },
})

const getNetlify = async () => {
  const sites = await listNetlifySites()
  const simpleSites = sites.map(simplifySite)
  const sortedSimpleSites = simpleSites.sort(
    ({ deploy: { created_at: a } }, { deploy: { created_at: b } }) => b - a
  )
  return sortedSimpleSites
}

module.exports = getNetlify
