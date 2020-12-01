import { NextApiHandler } from 'next'

const api: NextApiHandler = async (req, res) => {
  const body = req.body

  const remote = await fetch('http://server.rayriffy.com:9200/game/_search', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(o => o.json())

  res.send(remote)
}

export default api
