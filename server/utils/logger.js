import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: format.combine(format.timestamp(), format.errors({ stack: true }), format.splat(), format.json()),
  defaultMeta: { service: 'commission-calculator' },
  transports: [new transports.Console()]
});

export default logger;
