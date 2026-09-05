import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.dirname(fileURLToPath(import.meta.url));
// An optional dependency directory supports isolated build environments.
const require = createRequire(process.env.BUILD_DEPS ? path.resolve(process.env.BUILD_DEPS, 'package.json') : import.meta.url);
const yaml = require('js-yaml');
const esbuild = require('esbuild');
const js = process.env.PREBUILT_JS ? fs.readFileSync(process.env.PREBUILT_JS,'utf8') : esbuild.buildSync({
  entryPoints:[path.join(root,'src/popup.js')],bundle:true,write:false,format:'iife',
  target:'chrome120',minify:true,legalComments:'eof',
  nodePaths:process.env.BUILD_DEPS ? [path.resolve(process.env.BUILD_DEPS,'node_modules')] : [],
}).outputFiles[0].text;
fs.writeFileSync(path.join(root,'resource/index.js'),js);
fs.copyFileSync(path.join(root,'src/popup.css'),path.join(root,'resource/index.css'));
// Resolve the two official Seelen YAML tags relative to the declaring file.
function load(file) {
  const base=path.dirname(file);
  const schema=yaml.DEFAULT_SCHEMA.extend([
    new yaml.Type('!include',{kind:'scalar',construct:p=>fs.readFileSync(path.resolve(base,p),'utf8')}),
    new yaml.Type('!extend',{kind:'scalar',construct:p=>load(path.resolve(base,p))}),
  ]);
  return yaml.load(fs.readFileSync(file,'utf8'),{schema});
}
const widget=load(path.join(root,'resource/metadata.yml'));
fs.mkdirSync(path.join(root,'bundles'),{recursive:true});
fs.writeFileSync(path.join(root,'bundles/iso-week.yml'),yaml.dump(widget,{lineWidth:-1,noRefs:true}));
console.log('Built bundles/iso-week.yml');
