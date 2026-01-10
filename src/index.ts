import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { UserAlreadyExistsError } from './exceptions'
import authRouter from './routers/auth'

const app = new Hono()

app.use(logger())
app.route("/auth", authRouter)

app.get('/', (c) => {
	return c.text('Hello Hono!')
})

app.onError((err, c) => {
	if (err instanceof UserAlreadyExistsError) {
		return c.json(err.toJSON(), err.statusCode)
	}

	return c.json({ message: 'Internal Server Error' }, 500)
})
export default app
