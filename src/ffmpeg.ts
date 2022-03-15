import ffmpegPath from 'ffmpeg-static';
import { spawn } from "child_process";
import { pipeline, Readable, Writable } from "stream";

export function transcode(infile: Readable, tunnel: Writable, options: string[] = []) {
  const opts = ['-i', '-', ...options, '-'];
  console.log('running', ffmpegPath, ...opts);
  const ffmpeg = spawn(ffmpegPath, opts, { stdio: ['pipe', 'pipe', process.stderr] });

  pipeline(infile, ffmpeg.stdin, (err) => {
    if (err) {
      console.error(err);
    }
  });

  pipeline(ffmpeg.stdout, tunnel, (err) => {
    if (err) {
      console.error(err);
    }
  });

  return new Promise<number | null>((resolve, reject) => {
    ffmpeg.on('error', reject);
    ffmpeg.on('close', resolve);
  });
}
