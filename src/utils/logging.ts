import cliProgress from 'cli-progress';
import { format, createLogger, transports } from 'winston';

const { printf, combine, splat, simple } = format;

const flatFormat = printf(({ level, message }) => {
  return `${level}: ${message}`;
});
export const logger = createLogger({
  level: 'info',
  format: combine(splat(), simple()),
  transports: [new transports.Console()],
});

export function getProgressBar() {
  return new cliProgress.SingleBar({
    format: `{bar} | {percentage}% | {value}/{total} Files | {rom}`,
  });
}
