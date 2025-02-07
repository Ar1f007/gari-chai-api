import { Request } from 'express';
import passport from 'passport';
import { Strategy as JwtStrategy, StrategyOptions, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';

import User from '../modules/user/model';
import { envVariables } from '../utils/env';
import { AUTH_TOKEN_NAME, LOCAL_EMAIL_FIELD, LOCAL_PHONE_FIELD } from '../constants';

const cookieExtractor = (req: Request): string | null => {
  return req && req.cookies ? req.cookies[AUTH_TOKEN_NAME] : null;
};

const headerExtractor = (req: Request): string | null => {
  return req.headers['authorization']?.split(' ')[1] || null;
};

const opts: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor, headerExtractor]),
  secretOrKey: envVariables.JWT_SECRET_KEY,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findById(jwt_payload.data.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  }),
);

passport.use(
  LOCAL_EMAIL_FIELD,
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ [LOCAL_EMAIL_FIELD]: email });

        if (!user) {
          return done(null, false, { message: 'Invalid credentials.' });
        }

        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);

passport.use(
  LOCAL_PHONE_FIELD,
  new LocalStrategy(
    {
      usernameField: 'phone',
    },
    async (phone, password, done) => {
      try {
        const user = await User.findOne({ [LOCAL_PHONE_FIELD]: phone });

        if (!user) {
          return done(null, false, { message: 'Invalid credentials.' });
        }
        const isPasswordValid = await user.isValidPassword(password);

        if (!isPasswordValid) {
          return done(null, false, { message: 'Invalid credentials' });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    },
  ),
);
