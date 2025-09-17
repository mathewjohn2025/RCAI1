import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

const SQLiteStore = connectSqlite3(session) as any;

export const sessionMiddleware = session({
  name: 'rcai.sid',                              // ← unique cookie name (no collisions)
  store: new SQLiteStore({ db: 'sessions.sqlite', dir: './.data' }),
  secret: process.env.SESSION_SECRET!,           // no hardcoding
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,                                // Replit runs over HTTPS — required by Chrome if SameSite=None
    sameSite: 'lax',                             // top-level tab → robust across browsers
    path: '/',
    maxAge: 1000 * 60 * 60 * 4,                  // 4h
  },
});