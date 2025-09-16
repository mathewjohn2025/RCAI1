import type { Request, Response } from 'express';

export function nocache(res: Response) {
  res.set('Cache-Control','no-store, no-cache, must-revalidate, private');
  res.set('Pragma','no-cache');
  res.set('Vary','Cookie');
}

export function devDiag(req: Request, res: Response) {
  nocache(res);
  res.json({
    build: process.env.BUILD_ID || process.env.VERCEL_GIT_COMMIT_SHA || process.env.REPLIT_DEPLOYMENT || 'dev',
    trustProxy: req.app.get('trust proxy'),
    sessionStore: req.sessionStore?.constructor?.name ?? 'unknown',
    hasSessionObj: !!req.session,
    hasUser: !!req.session?.user,
    sessionID: (req as any).sessionID || null,
    cookieSeenOnReq: !!req.headers.cookie,
    cookieSample: (req.headers.cookie || '').split(';').slice(0,1)[0],
    now: new Date().toISOString(),
  });
}

export function cookieProbe(req: Request, res: Response) {
  nocache(res);
  res.cookie('rcai_probe', '1', {
    httpOnly: true,
    secure: true,
    sameSite: 'lax', // top-level new tab -> LAX is fine and more robust
    path: '/',
    maxAge: 5 * 60 * 1000,
  });
  res.json({ sawCookieHeader: !!req.headers.cookie });
}