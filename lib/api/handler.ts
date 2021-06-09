import nextConnect from 'next-connect'

export default function getHandler() {
  return nextConnect({
    onError(error, _, res) {
      console.log(error)
      res.writeHead(500, {
        'Content-Type': 'application/json;characterset=utf-8',
      }).write(JSON.stringify({
        error: error.message,
      }))
      res.end()
    },
    onNoMatch(req, res) {
      res.writeHead(405, {
        'Content-Type': 'application/json;characterset=utf-8',
      }).write(JSON.stringify({
        error: `Method ${req.method} not allowed`,
      }))
      res.end()
    },
  })
}
