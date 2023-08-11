import { zip } from 'zip-a-folder';

const process = async (src: string, dist: string) => {
  await zip(src, dist);
};

process('./dist', 'extension.zip');
