import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const files=fs.readdirSync(root).filter(f=>f.endsWith('.html'));
const errors=[];
let links=0,fragments=0,relationships=0;const imageUsage={};const expectedNav=['Home','About','Services','Blog','Contact'];
for(const file of files){const html=fs.readFileSync(path.join(root,file),'utf8');
 if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(file+': expected one h1');
 if(!html.includes('<title>')||!html.includes('name="viewport"'))errors.push(file+': missing metadata');
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)errors.push(file+': duplicate id');
 for(const [,fragment]of html.matchAll(/href="#([^"]+)"/g)){fragments++;if(!ids.includes(fragment))errors.push(file+': missing fragment #'+fragment);}
 for(const [,refs]of html.matchAll(/(?:aria-controls|aria-labelledby|aria-describedby|for)="([^"]+)"/g))for(const ref of refs.split(/\s+/)){relationships++;if(!ids.includes(ref))errors.push(file+': missing labelled/controlled element '+ref);}
 for(const [tag]of html.matchAll(/<[a-z][^>]*data-aos="[^>]+>/g))if(/\bdata-split\b/.test(tag)||/class="[^"]*\bp-image-reveal\b/.test(tag))errors.push(file+': conflicting AOS and GSAP target');
 if(html.includes('${'))errors.push(file+': unevaluated template expression');
 for(const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)){if(/^(https?:|mailto:|tel:|#)/.test(url))continue;const target=url.split(/[?#]/)[0];links++;if(!fs.existsSync(path.join(root,target)))errors.push(file+': missing '+target);}
 for(const img of html.matchAll(/<img\b[^>]*>/g))if(!/\balt=/.test(img[0]))errors.push(file+': image missing alt');
 for(const [,src] of html.matchAll(/<img[^>]+src="(assets\/images\/[^\"]+)"/g)){(imageUsage[src]??=[]).push(file)}
 const nav=html.match(/<nav class="nav-links"[^>]*>([\s\S]*?)<\/nav>/);
 if(nav){
  const active=(file.startsWith('article-')?'blog.html':file);
  for(const className of ['nav-links','mobile-primary-nav','footer-links footer-primary']){
   const content=html.match(new RegExp('<nav class="'+className+'"[^>]*>([\\s\\S]*?)<\\/nav>'))?.[1]||'';
   const items=[...content.matchAll(/<a[^>]*>([^<]+)<\/a>/g)].map(m=>m[1]);
   if(JSON.stringify(items)!==JSON.stringify(expectedNav))errors.push(file+': incorrect '+className);
   const current=[...content.matchAll(/<a href="([^"]+)"[^>]*aria-current="page"/g)].map(m=>m[1]);
   if(current.length!==1||current[0]!==active)errors.push(file+': incorrect active page in '+className);
  }
 }
 if(/^(client|admin)-/.test(file)&&/Back to (?:the )?website/i.test(html))errors.push(file+': dashboard website button remains');
 if(!html.includes('src="assets/icons/stackly-logo.svg"'))errors.push(file+': missing shared Stackly logo');
}
const contactHtml=fs.readFileSync(path.join(root,'contact.html'),'utf8');
const topics=[...contactHtml.matchAll(/<option(?: value="([^"]*)")?>([^<]+)<\/option>/g)].map(m=>m[1]??m[2]);
for(const [,topic]of contactHtml.matchAll(/data-contact-topic="([^"]+)"/g))if(!topics.includes(topic))errors.push('contact.html: topic button has no matching option '+topic);
for(const [image,pages]of Object.entries(imageUsage))if(pages.length!==1)errors.push('Repeated editorial image '+image+': '+pages.join(', '));
for(const js of ['site.js','premium.js']){const code=fs.readFileSync(path.join(root,'JS',js),'utf8');if(/localStorage|sessionStorage|indexedDB|document\.cookie|window\.name/.test(code))errors.push(js+': disallowed persistence API');}
if(files.length!==26)errors.push('Expected 26 pages, found '+files.length);
let cssAssetsChecked=0;
for(const file of fs.readdirSync(path.join(root,'CSS')).filter(file=>file.endsWith('.css'))){
 const css=fs.readFileSync(path.join(root,'CSS',file),'utf8');
 for(const [,url] of css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)){
  if(/^(?:data:|https?:|#|\/\/)/.test(url))continue;
  const resolved=path.resolve(root,'CSS',url.split(/[?#]/)[0]);
  cssAssetsChecked++;
  if(!fs.existsSync(resolved))errors.push(file+': missing CSS asset '+url);
 }
}
const result={pages:files.length,localReferencesChecked:links,cssAssetsChecked,inPageTargetsChecked:fragments,labelAndControlTargetsChecked:relationships,uniqueEditorialImages:Object.keys(imageUsage).length,imageUsage,errors};
console.log(JSON.stringify(result,null,2));if(errors.length)process.exitCode=1;
