/* Editor frontend-only, CodeMirror, examples, save manager (5 per lang), dark mode, UI behaviors */

/* ---- config & examples ---- */
const MAX_FILES = 5;
const EXAMPLES = {
  javascript: `// JavaScript example\nconsole.log("Hello, JavaScript!");`,
  python: `# Python example\nprint("Hello, Python!")`,
  c: `/* C example */\n#include <stdio.h>\nint main(){ printf("Hello C\\n"); return 0; }`,
  cpp: `// C++ example\n#include <iostream>\nint main(){ std::cout << "Hello C++\\n"; return 0; }`,
  java: `// Java example\nclass Main{ public static void main(String[] a){ System.out.println("Hello Java"); } }`,
  php: `<?php\n// PHP example\necho "Hello PHP!\\n";\n?>`,
  "html/css": `<!-- HTML example -->\n<!doctype html>\n<html><body><h1>Hello HTML</h1><script>console.log('hi')</script></body></html>`
};

const META = {
  javascript:{title:'JavaScript',desc:'Client-side web language',img:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg'},
  python:{title:'Python',desc:'Readable, versatile',img:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg'},
  c:{title:'C',desc:'Low-level & fast',img:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg'},
  cpp:{title:'C++',desc:'Performance & OOP',img:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg'},
  java:{title:'Java',desc:'Cross-platform',img:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'},
  php:{title:'PHP',desc:'Server-side scripting',img:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg'},
  "html/css":{title:'HTML/CSS',desc:'Web markup & styles',img:'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg'}
};

/* ---- DOM refs ---- */
const langSelect = document.getElementById('langSelect');
const langTitle = document.getElementById('langTitle');
const langDesc = document.getElementById('langDesc');
const langImage = document.getElementById('langImage');
const filesBtn = document.getElementById('filesBtn');
const filesPanel = document.getElementById('filesPanel');
const filesList = document.getElementById('filesList');
const savedCount = document.getElementById('savedCount');
const filesBtnToggle = filesBtn;
const saveBtn = document.getElementById('saveBtn');
const saveModal = document.getElementById('saveModal');
const saveName = document.getElementById('saveName');
const saveCancel = document.getElementById('saveCancel');
const saveConfirm = document.getElementById('saveConfirm');
const runBtn = document.getElementById('runBtn');
const outputBox = document.getElementById('outputBox');
const previewFrame = document.getElementById('previewFrame');
const outputConsole = document.getElementById('outputConsole');
const outputPreview = document.getElementById('outputPreview');
const togglePreview = document.getElementById('togglePreview');
const themeBtn = document.getElementById('themeBtn');
const clearOutput = document.getElementById('clearOutput');

/* ---- CodeMirror init ---- */
const cm = CodeMirror(document.querySelector('#editor'), {
  value: '',
  mode: 'javascript',
  theme: 'material-darker',
  lineNumbers: true,
  tabSize: 2,
  indentUnit: 2,
  autofocus: true
});

/* ---- helpers ---- */
const storageKey = (lang)=> `vl_files_${lang}`;
const loadFiles = (lang)=> JSON.parse(localStorage.getItem(storageKey(lang))||'[]');
const saveFiles = (lang,arr)=> localStorage.setItem(storageKey(lang), JSON.stringify(arr));
const setTheme = (isDark)=>{
  document.body.classList.toggle('dark', isDark);
  cm.setOption('theme', isDark ? 'material-darker' : 'default');
  localStorage.setItem('vl_theme', isDark ? 'dark':'light');
};
/* populate languages (keep order) */
const LANGS = ['javascript','python','c','cpp','java','php','html/css'];
LANGS.forEach(l=> {
  const opt = document.createElement('option');
  opt.value = l; opt.textContent = META[l].title || l;
  langSelect.appendChild(opt);
});

/* detect lang from URL param ?lang=python */
const param = new URLSearchParams(location.search).get('lang');
let currentLang = param && LANGS.includes(param.toLowerCase()) ? param.toLowerCase() : LANGS[0];
langSelect.value = currentLang;

/* set meta & example */
function applyLang(l){
  currentLang = l;
  const m = META[l]||{title:l,desc:'',img:''};
  langTitle.textContent = m.title;
  langDesc.textContent = m.desc;
  langImage.src = m.img;
  const ex = EXAMPLES[l] || '// start here';
  // set mode mapping
  const modeMap = {'javascript':'javascript','python':'python','c':'text/x-csrc','cpp':'text/x-c++src','java':'text/x-java','php':'application/x-httpd-php','html/css':'htmlmixed'};
  cm.setOption('mode', modeMap[l] || 'javascript');
  cm.setValue(ex);
  refreshFilesPanel();
}
applyLang(currentLang);

/* theme init */
const savedTheme = localStorage.getItem('vl_theme') || 'light';
setTheme(savedTheme==='dark');

/* UI: files panel toggles */
filesBtn.addEventListener('click', ()=> filesPanel.classList.toggle('hidden'));
langSelect.addEventListener('change', (e)=> applyLang(e.target.value));

/* refresh files list */
function refreshFilesPanel(){
  const arr = loadFiles(currentLang);
  savedCount.textContent = arr.length;
  filesList.innerHTML = '';
  if(!arr.length){ filesList.innerHTML = '<li style="opacity:.6">no saved files</li>'; return; }
  arr.forEach((f,i)=>{
    const li = document.createElement('li');
    li.innerHTML = `<div style="flex:1">${f.name}</div>`;
    const btns = document.createElement('div');
    const load = document.createElement('button'); load.textContent='Load'; load.className='small';
    const del = document.createElement('button'); del.textContent='Delete'; del.className='small';
    load.onclick = ()=> { if(!confirm('Load file? Unsaved changes will be lost.')) return; cm.setValue(f.code); outputBox.textContent=`(loaded ${f.name})`; };
    del.onclick = ()=> { if(!confirm('Delete?')) return; const next = loadFiles(currentLang).filter(x=>x.name!==f.name); saveFiles(currentLang,next); refreshFilesPanel(); };
    btns.appendChild(load); btns.appendChild(del); li.appendChild(btns); filesList.appendChild(li);
  });
}

/* Save modal flow */
saveBtn.addEventListener('click', ()=>{
  saveModal.classList.remove('hidden');
  saveName.value = '';
  saveName.focus();
});
saveCancel.addEventListener('click', ()=> saveModal.classList.add('hidden'));
saveConfirm.addEventListener('click', ()=>{
  const name = saveName.value.trim();
  if(!name){ alert('Enter a file name'); saveName.focus(); return; }
  let arr = loadFiles(currentLang);
  // overwrite if same name
  const idx = arr.findIndex(x=>x.name===name);
  const obj = {name, code: cm.getValue(), savedAt: Date.now()};
  if(idx>=0) arr[idx]=obj; else { arr.unshift(obj); if(arr.length>MAX_FILES) arr=arr.slice(0,MAX_FILES); }
  saveFiles(currentLang,arr);
  refreshFilesPanel();
  saveModal.classList.add('hidden');
});

/* Run (mock) */
runBtn.addEventListener('click', ()=>{
  const code = cm.getValue();
  outputBox.textContent = 'Running...\n';
  // JS: run sandboxed iframe
  if(currentLang==='javascript'){
    runJS(code);
    return;
  }
  // HTML: preview iframe
  if(currentLang==='html/css'){
    outputPreview.classList.remove('hidden'); outputConsole.classList.add('hidden');
    const doc = previewFrame.contentDocument || previewFrame.contentWindow.document;
    doc.open(); doc.write(code); doc.close();
    outputBox.textContent = '(rendered in preview)';
    return;
  }
  // Other languages: show mock compile/run output
  setTimeout(()=>{
    outputConsole.classList.remove('hidden'); outputPreview.classList.add('hidden');
    const fakeOut = `> Compiling ${META[currentLang].title || currentLang}...\nCompilation successful.\n> Running...\nHello from ${META[currentLang].title || currentLang}!\n\n-- (mock output; backend required for real execution)`;
    outputBox.textContent = fakeOut;
  },700);
});

/* toggle preview */
togglePreview.addEventListener('click', ()=> {
  outputPreview.classList.toggle('hidden'); outputConsole.classList.toggle('hidden');
});

/* clear output */
clearOutput.addEventListener('click', ()=> outputBox.textContent='(no output)');

/* theme */
themeBtn.addEventListener('click', ()=> {
  const isDark = !document.body.classList.contains('dark');
  setTheme(isDark);
});

/* JS runner - sandboxed iframe capture */
function runJS(code){
  outputPreview.classList.add('hidden'); outputConsole.classList.remove('hidden');
  outputBox.textContent = '';
  const iframe = document.createElement('iframe');
  iframe.sandbox = 'allow-scripts';
  iframe.style.display='none';
  document.body.appendChild(iframe);
  function handler(e){
    if(!e.data || !e.data.type) return;
    if(e.data.type==='stdout') outputBox.textContent += e.data.text;
    if(e.data.type==='stderr') outputBox.textContent += 'Error: '+e.data.text;
  }
  window.addEventListener('message', handler);
  const wrapped = `
    (function(){
      try{
        console.log = function(){ parent.postMessage({type:'stdout', text: Array.from(arguments).join(' ') + '\\n'}, '*'); };
        console.error = function(){ parent.postMessage({type:'stderr', text: Array.from(arguments).join(' ') + '\\n'}, '*'); };
        ${code}
      } catch(err){ parent.postMessage({type:'stderr', text: err.toString()}, '*'); }
    })();
  `;
  const d = iframe.contentWindow.document;
  d.open(); d.write('<script>'+wrapped+'<\/script>'); d.close();
  setTimeout(()=>{ try{ document.body.removeChild(iframe); }catch(e){} window.removeEventListener('message', handler); },6000);
}

/* init panel state */
refreshFilesPanel();
