import { Router } from 'express'
import {
  createMatchSchema,
  listMatchesQuerySchema,
} from '../validation/matches.js'
import { matches } from '../db/schema.js'
import { db } from '../db/db.js'
import { getMatchStatus } from '../utils/match-status.js'
export const matchesRouter = Router()
matchesRouter.get('/', async (req, res) => {
  const parsed = listMatchesQuerySchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() })
  }

  try {
    const events = await db
      .select()
      .from(matches)
      .orderBy(des(matches.createdAt))
      .limit(parsed.data.limit ?? 100)
    res.status(200).json({ data: events })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})
matchesRouter.post('/', async (req, res) => {
  const parsed = createMatchSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.format() })
  }
  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(parsed.data.startTime),
        endTime: new Date(parsed.data.endTime),
        homeScore: parsed.data.homeScore ?? 0,
        awayScore: parsed.data.awayScore ?? 0,
        status: getMatchStatus(parsed.data.startTime, parsed.data.endTime),
      })
      .returning()
    res.status(201).json({ message: 'Match created successfully', data: event })
  } catch (err) {
    return res.status(500).json({ error: err.message })
  }
})
