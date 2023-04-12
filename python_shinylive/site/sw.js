'use strict'

var cachename = 'fox-store'
var urlstocache = ['myapp/app.py',     
'index.html',
'index.js',
'sw.js',
'shinylive-sw.js',
'site/shinylive/chunk-BAQHGLJX.js',
'shinylive/load-shinylive-sw.js',
'site/shinylive/shinylive.css',
'site/shinylive/shinylive.js',
'site/shinylive/pyodide/repodata.json',
'site/shinylive/style-resets.css',
'site/shinylive/pyodide-worker.js',  
'site/icon/apple-touch-icon-180x180.png',
'site/manifest.webmanifest',
'site/shinylive/pyodide/pyodide_py.tar',                                       
'site/shinylive/pyodide/pyodide.asm.data',                                         
'site/shinylive/pyodide/pyodide.asm.js',                                           
'site/shinylive/pyodide/pyodide.asm.wasm',  
'site/shinylive/pyodide/anyio-3.6.2-py3-none-any.whl',                             
'site/shinylive/pyodide/appdirs-1.4.4-py2.py3-none-any.whl',                       
'site/shinylive/pyodide/asgiref-3.6.0-py3-none-any.whl',                           
'site/shinylive/pyodide/CLAPACK-3.2.1.zip',                                        
'site/shinylive/pyodide/click-8.1.3-py3-none-any.whl',                             
'site/shinylive/pyodide/cycler-0.11.0-py3-none-any.whl',                           
'site/shinylive/pyodide/distutils-1.0.0.zip',      
'site/shinylive/pyodide/fonttools-4.38.0-py3-none-any.whl',                        
'site/shinylive/pyodide/h11-0.14.0-py3-none-any.whl',                              
'site/shinylive/pyodide/htmltools-0.1.4.9000-py3-none-any.whl',                    
'site/shinylive/pyodide/idna-3.4-py3-none-any.whl',                               
'site/shinylive/pyodide/kiwisolver-1.4.4-cp310-cp310-emscripten_3_1_27_wasm32.whl',
'site/shinylive/pyodide/linkify_it_py-2.0.0-py3-none-any.whl',                     
'site/shinylive/pyodide/markdown_it_py-2.2.0-py3-none-any.whl',                    
'site/shinylive/pyodide/matplotlib_pyodide-0.1.1-py3-none-any.whl',                
'site/shinylive/pyodide/matplotlib-3.5.2-cp310-cp310-emscripten_3_1_27_wasm32.whl',
'site/shinylive/pyodide/mdit_py_plugins-0.3.4-py3-none-any.whl',
'site/shinylive/pyodide/mdurl-0.1.2-py3-none-any.whl',                             
'site/shinylive/pyodide/micropip-0.2.0-py3-none-any.whl',                          
'site/shinylive/pyodide/numpy-1.23.5-cp310-cp310-emscripten_3_1_27_wasm32.whl',    
'site/shinylive/pyodide/openssl-1.1.1n.zip',                                       
'site/shinylive/pyodide/packaging-21.3-py3-none-any.whl',                          
'site/shinylive/pyodide/pandas-1.5.2-cp310-cp310-emscripten_3_1_27_wasm32.whl',    
'site/shinylive/pyodide/PIL-9.1.1-cp310-cp310-emscripten_3_1_27_wasm32.whl',  
'site/shinylive/pyodide/pyparsing-3.0.9-py3-none-any.whl',                         
'site/shinylive/pyodide/python_dateutil-2.8.2-py2.py3-none-any.whl',               
'site/shinylive/pyodide/python_multipart-0.0.6-py3-none-any.whl',                  
'site/shinylive/pyodide/pytz-2022.7-py2.py3-none-any.whl',                         
'site/shinylive/pyodide/repodata.json',      
'site/shinylive/pyodide/scipy-1.9.3-cp310-cp310-emscripten_3_1_27_wasm32.whl',     
'site/shinylive/pyodide/setuptools-65.6.3-py3-none-any.whl',                       
'site/shinylive/pyodide/shiny-0.2.9.9000-py3-none-any.whl',                        
'site/shinylive/pyodide/six-1.16.0-py2.py3-none-any.whl',                          
'site/shinylive/pyodide/sniffio-1.3.0-py3-none-any.whl',                           
'site/shinylive/pyodide/ssl-1.0.0.zip',                                            
'site/shinylive/pyodide/starlette-0.25.0-py3-none-any.whl',                        
'site/shinylive/pyodide/typing_extensions-4.4.0-py3-none-any.whl',                 
'site/shinylive/pyodide/uc_micro_py-1.0.1-py3-none-any.whl',                       
'site/shinylive/pyodide/uvicorn-0.20.0-py3-none-any.whl'
];


/*
async function createDB(tf){
  const model = await tf.loadLayersModel('/NNmodel/tfjs_model/model.json');
  await model.save('indexeddb://report-exec-time-model');
}
self.addEventListener('activate', function(event) {
  event.waitUntil(
    createDB(tf)
  );
});
*/

// install/cache page assets
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(cachename)
      .then(function (cache) {
        console.log('cache opened')
        return cache.addAll(urlstocache)
      })
  )
})
/*
self.addEventListener('fetch', function(event) {
event.respondWith(async function() {
   try{
     var res = await fetch(event.request);
     var cache = await caches.open('cache');
     cache.put(event.request.url, res.clone());
     return res;
   }
   catch(error){
     return caches.match(event.request);
    }
  }());
});
*/
// intercept page requests
self.addEventListener('fetch', function (event) {
  console.log(event.request.url)
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // serve requests from cache (if found)
      return response || fetch(event.request)
    })
  )
})

