import { randomUUID } from 'node:crypto';

export function sessionMiddleware(request, response, next) {
  request.sessionId = request.cookies.besoia_session || null;
  next();
}

export function ensureSession(response, sessionId = randomUUID()) {
  response.cookie('besoia_session', sessionId, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24
  });
  return sessionId;
}
