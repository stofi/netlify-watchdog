require('dotenv').config()
const NetlifyAPI = require('netlify')

const { API_KEY } = process.env
const client = new NetlifyAPI(API_KEY)

const listNetlifySites = async () => await client.listSites()

const simplifySite = ({
  name,
  url,
  state,
  deploy,
}) => ({
  name,
  url,
  state,
  deploy,
})

const getNetlify = async () => {
  const sites = await listNetlifySites()
  const sitesWithBuilds = await sites.reduce(async (prev, curr) => {
    const all = await prev
    const deploys = await client.listSiteDeploys({ siteId: curr.site_id })
    const simpleDeploys = deploys.map(({ state, created_at, updated_at }) => ({
      state,
      created_at: new Date(created_at),
      updated_at: new Date(updated_at),
    }))
    const sortedSimpleDeploys = simpleDeploys.sort(
      ({ created_at: a }, { created_at: b }) => b - a
    )
    all.push({
      ...curr,
      deploy: sortedSimpleDeploys.length ? sortedSimpleDeploys[0] : null,
    })
    return all
  }, [])
  const simpleSites = sitesWithBuilds.map(simplifySite)
  const sortedSimpleSites = simpleSites.sort(
    ({ deploy: { created_at: a } }, { deploy: { created_at: b } }) => b - a
  )
  return sortedSimpleSites
}

module.exports = getNetlify
