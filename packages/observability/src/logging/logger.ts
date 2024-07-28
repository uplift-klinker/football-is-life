import type {Logger} from 'roarr';
import {Roarr} from 'roarr';

export const logger: Pick<Logger, 'error' | 'debug' | 'child' | 'info' | 'fatal' | 'trace' | 'warn'> = Roarr;

