import { Context, Next } from 'hono';
import { lucia } from '@/lib/auth';
import { Logger } from '@/lib/logger';

interface AuthVariables {
  user: { id: string; email: string } | null;
  session: { id: string } | null;
}

export async function authMiddleware(
  c: Context<{ Variables: AuthVariables }>,
  next: Next,
): Promise<Response | void> {
  const sessionId = c.req.header('Authorization')?.replace('Bearer ', '');

  if (!sessionId) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  const { session, user } = await lucia.validateSession(sessionId);

  if (!session) {
    c.set('user', null);
    c.set('session', null);
    return next();
  }

  c.set('user', user);
  c.set('session', session);

  return next();
}

export async function requireAuth(
  c: Context<{ Variables: AuthVariables }>,
  next: Next,
): Promise<Response | void> {
  const user = c.get('user');

  if (!user) {
    Logger.warn('Unauthorized access attempt');
    return c.json({ error: 'Unauthorized' }, 401);
  }

  return next();
}
