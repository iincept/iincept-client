import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const src = path.join(__dirname, 'public/applecare_official_hero.png');
const dest = path.join(__dirname, 'public/applecare_category_uploaded.png');

if (fs.existsSync(src)) {
  fs.copyFileSync(src, dest);
  console.log('Successfully created public/applecare_category_uploaded.png');
} else {
  console.log('Source file does not exist:', src);
}
