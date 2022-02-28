import { IncomingHttpHeaders } from 'http';

export function extractHeaders(headers: IncomingHttpHeaders) {
  const rawOptions = headers['ffmpeg-options'];
  let options: string[] = [];

  if (!rawOptions) {
    options = [];
  } else if (typeof rawOptions === 'string') {
    try {
      options = JSON.parse(rawOptions);
      if (!Array.isArray(options)) {
        throw new Error();
      }
    } catch(e) {
      throw new Error('ffmpeg-options header should be a JSON array');
    }
  } else {
    throw new Error('Only one ffmpeg-options header allowed');
  }

  const outfileext = headers['ffmpeg-outfileext'];

  if (typeof outfileext !== 'string') {
    throw new Error('Missing ffmpeg-outfileext header');
  }

  return {
    options,
    outfileext,
  }
}
