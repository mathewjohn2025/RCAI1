import session from 'express-session';
import connectSqlite3 from 'connect-sqlite3';

const SQLiteStore = connectSqlite3(session) as any;

export const sessionMiddleware = session({
  name: "sid",
  store: new SQLiteStore({
    db: 'sessions.sqlite',          // persisted file
    dir: './.data',                 // persists on Replit
  }),
  secret: process.env.SESSION_SECRET!, // DO NOT hardcode
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    sameSite: process.env.NODE_ENV === 'production' ? 'lax' : 'none', // Allow cross-origin in dev
    path: '/',
    maxAge: 1000 * 60 * 60 * 4,     // 4 hours
  },
});