import fastifyFactory from 'fastify';
import fastifyMultipart from 'fastify-multipart';
import { FileOption, transcode } from './ffmpeg';
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

fastify.post('/', async (request, reply) => {
  const headers = extractHeaders(request.headers);
  const part = await request.file();

  const infile: FileOption = {
    filename: part.filename,
    binaryData: await part.toBuffer(),
  }

  const newfilename = changeExt(part.filename, headers.outfileext);
  const result = await transcode(infile, newfilename, headers.options);

  reply.header('content-disposition', `attachment; filename="${newfilename.replace('"', '')}"`);
  return reply.send(Buffer.from(result));
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
