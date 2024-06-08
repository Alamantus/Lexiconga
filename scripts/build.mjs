import path from 'path';
import fs from 'fs';
import * as esbuild from 'esbuild'
import * as sass from 'sass';
import { minifyHTMLLiterals, defaultShouldMinify } from 'minify-html-literals';
import indexPage from '../src/pages/index.js';
import genericPage from '../src/pages/generic.js';

const minifyOptions = {
  collapseWhitespace: true,
  conservativeCollapse: true,
  collapseInlineTagWhitespace: true,
  decodeEntities: true,
  removeAttributeQuotes: true,
  continueOnParseError: true,
  removeComments: true,
  removeEmptyAttributes: true,
  removeRedundantAttributes: true,
};

const minifyHTMLLiteralsPlugin = {
  name: 'minifyHTMLLiteralsPlugin',
  setup(build) {
    build.onLoad({ filter: /\.js$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, 'utf8');
      const fileName = path.relative(process.cwd(), args.path);

      try {
        const result = minifyHTMLLiterals(source, {
          fileName,
          minifyOptions,
          shouldMinify(template) {
            return (
              defaultShouldMinify(template) ||
              template.parts.some(part => {
                return part.text.includes('<!DOCTYPE html>');
              })
            );
          }
        });

        if (result) {
          return { contents: result.code };
        }
        return { contents: source };
      } catch (e) {
        return { errors: [e] }
      }
    })
  }
};

const letsVarConstsPlugin = {
  name: 'letsVarConstsPlugin',
  setup(build) {
    build.onLoad({ filter: /\.js$/ }, async (args) => {
      const source = await fs.promises.readFile(args.path, 'utf8');

      return { contents: source.replace(/(let|const)\s/g, 'var ') };
    })
  }
};

const srcPath = path.relative(process.cwd(), 'src');
const buildPath = path.relative(process.cwd(), 'public');

fs.rmSync(buildPath, {
  recursive: true,
  force: true,
});

await esbuild.build({
  entryPoints: [srcPath + '/lexiconga.js'],
  sourcemap: false,
  write: true,
  bundle: true,
  minify: true,
  treeShaking: true,
  plugins: [
    minifyHTMLLiteralsPlugin,
    letsVarConstsPlugin,
  ],
  platform: 'browser',
  format: 'iife',
  target: 'es2015',
  outdir: buildPath,
});

const compiledSass = sass.compile(srcPath + '/styles.scss', { style: 'compressed' });
fs.writeFileSync(buildPath + '/styles.css', compiledSass.css);

const page = indexPage();
fs.writeFileSync(`${buildPath}/index.html`, page);

const pageContentDir = srcPath + '/pages/pageContent';
fs.readdirSync(pageContentDir).forEach(item => {
  try {
    const pageContent = fs.readFileSync(path.resolve(pageContentDir, item), 'utf-8');
    const page = genericPage(pageContent);
    fs.writeFileSync(`${buildPath}/${item.split('.')[0]}.html`, page);
  } catch (e) {
    console.error(e);
  }
});
