import type { Request, Response } from 'express';

export function cookieProbe(req: Request, res: Response) {
  // Set a short-lived marker the *same way* as the session cookie context
  res.cookie('rcai_probe', '1', {
    httpOnly: true,
    sameSite: 'none',  // match your session cookie
    secure: true,
    path: '/',
    maxAge: 5 * 60 * 1000,
  });
  // Can we *see* any cookies on this request?
  res.set('Cache-Control', 'no-store');
  res.json({ sawCookieHeader: !!req.headers.cookie, cookies: req.headers.cookie || '' });
}