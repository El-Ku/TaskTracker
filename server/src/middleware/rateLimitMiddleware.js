import rateLimit from "express-rate-limit";

const allowlist = ["127.0.0.1", "::1", "::ffff:127.0.0.1"]; //IPs to skip

const oneSec = 1000;

// Max 3 login attempts in 10 secs.
export const loginLimiter = rateLimit({
  windowMs: 10 * oneSec,
  limit: 3,
  message: {
    result: "error",
    message:
      "Too many continuous failed login attempts. Try again in 5 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => allowlist.includes(req.ip),
});

//reset the limits once the user successfully logins.
export const resetLoginLimiter = (ip) => {
  loginLimiter.resetKey(ip);
};

// Max 10 task changes in 10 seconds
export const taskRateLimiter = rateLimit({
  windowMs: 10 * oneSec,
  limit: 10,
  message: {
    result: "error",
    message: "You are adding or deleting tasks way too fast!",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => allowlist.includes(req.ip),
});

// Max 1 user registration in 5 secs.
export const userRegLimiter = rateLimit({
  windowMs: 5 * oneSec,
  limit: 1,
  message: {
    result: "error",
    message: "You are trying to register new users way too many times",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => allowlist.includes(req.ip),
});

//reset the limits once the user successfully registers.
export const resetRegLimiter = (ip) => {
  userRegLimiter.resetKey(ip);
};

// Max 2 refresh per 1 secs.
export const refreshLimiter = rateLimit({
  windowMs: oneSec,
  limit: 2,
  message: {
    result: "error",
    message: "You are trying to refresh the page way too many times",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => allowlist.includes(req.ip),
});

// Max 5 profile update per 10 secs.
export const profileUpdateLimiter = rateLimit({
  windowMs: 10 * oneSec,
  limit: 5,
  message: {
    result: "error",
    message: "You are trying to update the profile way too many times",
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req, res) => allowlist.includes(req.ip),
});
