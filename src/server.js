import express from 'express'
import { matchesRouter } from './routes/matches.js'
const app = express()
const port = 8000

app.use(express.json())

app.get('/', (request, response) => {
  response.send('Sportz server is running')
})
app.use('/matches', matchesRouter)
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
