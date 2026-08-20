import { z } from 'zod'

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
})

export const MATCH_STATUS = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
}

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
})

const isoDateString = z
  .string()
  .refine(
    (value) => !Number.isNaN(Date.parse(value)),
    'Must be a valid ISO date string',
  )

export const createMatchSchema = z
  .object({
    sport: z.string().trim().min(1),
    homeTeam: z.string().trim().min(1),
    awayTeam: z.string().trim().min(1),
    startTime: isoDateString,
    endTime: isoDateString,
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine(({ startTime, endTime }, context) => {
    if (Date.parse(endTime) <= Date.parse(startTime)) {
      context.addIssue({
        code: 'custom',
        path: ['endTime'],
        message: 'Must be after startTime',
      })
    }
  })

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
})
