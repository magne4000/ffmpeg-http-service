import fastifyFactory from 'fastify';
import fastifyMultipart from 'fastify-multipart';
import { transcode } from './ffmpeg';
import { extractHeaders } from './headers';

const fastify = fastifyFactory({ logger: true });

fastify.register(fastifyMultipart, {
  limits: {
    fileSize: 100 * 1000 * 1000, // 100MB
    files: 1,
  }
});

function changeExt(fileName: string, newExt: string) {
  const pos = fileName.includes(".") ? fileName.lastIndexOf(".") : fileName.length;
  const fileRoot = fileName.slice(0, pos);
  return `${fileRoot}.${newExt}`;
}

fastify.post('/', (request, reply) => {
  const headers = extractHeaders(request.headers);
  request.file().then(async part => {
    if (!part) return reply.send(new Error('No file'));

    const newfilename = changeExt(part.filename, headers.outfileext);

    reply.raw.writeHead(200, {
      'Content-disposition': `attachment; filename="${newfilename.replace('"', '')}"`,
      'Content-Type': 'application/octet-stream'
    });

    await transcode(part.file, reply.raw, [...headers.options, '-loglevel', 'error',  '-f', headers.outfileext]);
    reply.raw.end();
  }).catch(console.error);
});

fastify.get('/', async () => {
  return { status: 'OK' };
});

const start = async () => {
  try {
    await fastify.listen(3000, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
