import pino from 'pino';

const logger = pino({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty' }
      : {
          target: 'pino-socket',
          options: { address: 'localhost', port: 5000 },
        },
});

export default logger;
