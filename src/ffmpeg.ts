import { createFFmpeg } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });

export interface FileOption {
  binaryData: Uint8Array;
  filename: string;
}

export async function transcode(infile: FileOption, outfilename: string, options: string[] = []): Promise<Uint8Array> {
  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }
  ffmpeg.FS('writeFile', infile.filename, infile.binaryData);

  await ffmpeg.run('-i', infile.filename, ...options, outfilename);

  const buffer = ffmpeg.FS('readFile', outfilename);

  // cleanup MEMFS
  ffmpeg.FS('unlink', outfilename);
  ffmpeg.FS('unlink', infile.filename);

  return buffer;
}
