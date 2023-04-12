// Shinylive 0.0.12
// Copyright 2023 RStudio, PBC

// src/assets/shinylive-inject-socket.txt
var shinylive_inject_socket_default = '// src/messageportwebsocket.ts\nvar MessagePortWebSocket = class extends EventTarget {\n  constructor(port) {\n    super();\n    this.readyState = 0;\n    this.addEventListener("open", (e) => {\n      if (this.onopen) {\n        this.onopen(e);\n      }\n    });\n    this.addEventListener("message", (e) => {\n      if (this.onmessage) {\n        this.onmessage(e);\n      }\n    });\n    this.addEventListener("error", (e) => {\n      if (this.onerror) {\n        this.onerror(e);\n      }\n    });\n    this.addEventListener("close", (e) => {\n      if (this.onclose) {\n        this.onclose(e);\n      }\n    });\n    this._port = port;\n    port.addEventListener("message", this._onMessage.bind(this));\n    port.start();\n  }\n  // Call on the server side of the connection, to tell the client that\n  // the connection has been established.\n  accept() {\n    if (this.readyState !== 0) {\n      return;\n    }\n    this.readyState = 1;\n    this._port.postMessage({ type: "open" });\n  }\n  send(data) {\n    if (this.readyState === 0) {\n      throw new DOMException(\n        "Can\'t send messages while WebSocket is in CONNECTING state",\n        "InvalidStateError"\n      );\n    }\n    if (this.readyState > 1) {\n      return;\n    }\n    this._port.postMessage({ type: "message", value: { data } });\n  }\n  close(code, reason) {\n    if (this.readyState > 1) {\n      return;\n    }\n    this.readyState = 2;\n    this._port.postMessage({ type: "close", value: { code, reason } });\n    this.readyState = 3;\n    this.dispatchEvent(new CloseEvent("close", { code, reason }));\n  }\n  _onMessage(e) {\n    const event = e.data;\n    switch (event.type) {\n      case "open":\n        if (this.readyState === 0) {\n          this.readyState = 1;\n          this.dispatchEvent(new Event("open"));\n          return;\n        }\n        break;\n      case "message":\n        if (this.readyState === 1) {\n          this.dispatchEvent(new MessageEvent("message", { ...event.value }));\n          return;\n        }\n        break;\n      case "close":\n        if (this.readyState < 3) {\n          this.readyState = 3;\n          this.dispatchEvent(new CloseEvent("close", { ...event.value }));\n          return;\n        }\n        break;\n    }\n    this._reportError(\n      `Unexpected event \'${event.type}\' while in readyState ${this.readyState}`,\n      1002\n    );\n  }\n  _reportError(message, code) {\n    this.dispatchEvent(new ErrorEvent("error", { message }));\n    if (typeof code === "number") {\n      this.close(code, message);\n    }\n  }\n};\n\n// src/shinylive-inject-socket.ts\nwindow.Shiny.createSocket = function() {\n  const channel = new MessageChannel();\n  window.parent.postMessage(\n    {\n      type: "openChannel",\n      // Infer app name from path: "/foo/app_abc123/"" => "app_abc123"\n      appName: window.location.pathname.replace(\n        new RegExp(".*/([^/]+)/$"),\n        "$1"\n      ),\n      path: "/websocket/"\n    },\n    "*",\n    [channel.port2]\n  );\n  return new MessagePortWebSocket(channel.port1);\n};\n';

var cachename = 'fox-store'
var urlstocache = ['myapp/app.py',     
'index.html',
'site/index.html',
'site/shinylive-sw.js',
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

// src/utils.ts
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function dirname(path) {
  if (path === "/" || path === "") {
    return "";
  }
  return path.replace(/[/]?[^/]+[/]?$/, "");
}
function uint8ArrayToString(buf) {
  let result = "";
  for (let i = 0; i < buf.length; i++) {
    result += String.fromCharCode(buf[i]);
  }
  return result;
}

// src/messageporthttp.ts
async function fetchASGI(client, resource, init, filter = (bodyChunk) => bodyChunk) {
  if (typeof resource === "string" || typeof init !== "undefined") {
    resource = new Request(resource, init);
  }
  const channel = new MessageChannel();
  const clientPort = channel.port1;
  client.postMessage(
    {
      type: "makeRequest",
      scope: reqToASGI(resource)
    },
    [channel.port2]
  );
  const blob = await resource.blob();
  if (!blob.size) {
    clientPort.postMessage({
      type: "http.request",
      more_body: false
    });
  } else {
    const reader = blob.stream().getReader();
    try {
      while (true) {
        const { value: theChunk, done } = await reader.read();
        clientPort.postMessage({
          type: "http.request",
          body: theChunk,
          more_body: !done
        });
        if (done) {
          break;
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  return new Promise((resolve) => {
    let streamController;
    const readableStream = new ReadableStream({
      start(controller) {
        streamController = controller;
      },
      cancel(reason) {
      }
    });
    let response;
    clientPort.addEventListener("message", (event) => {
      const msg = event.data;
      if (msg.type === "http.response.start") {
        response = asgiToRes(msg, readableStream);
        resolve(response);
      } else if (msg.type === "http.response.body") {
        if (msg.body) {
          streamController.enqueue(filter(msg.body, response));
        }
        if (!msg.more_body) {
          streamController.close();
          clientPort.close();
        }
      } else {
        throw new Error("Unexpected event type from clientPort: " + msg.type);
      }
    });
    clientPort.start();
  });
}
function headersToASGI(headers) {
  const result = [];
  for (const [key, value] of headers.entries()) {
    result.push([key, value]);
  }
  return result;
}
function reqToASGI(req) {
  const url = new URL(req.url);
  return {
    type: "http",
    asgi: {
      version: "3.0",
      spec_version: "2.1"
    },
    http_version: "1.1",
    method: req.method,
    scheme: url.protocol.replace(/:$/, ""),
    path: url.pathname,
    query_string: url.search.replace(/^\?/, ""),
    root_path: "",
    headers: headersToASGI(req.headers)
  };
}
function asgiToRes(res, body) {
  return new Response(body, {
    headers: res.headers,
    status: res.status
  });
}

// src/shinylive-sw.ts
var useCaching = false;
var cacheName = "::prismExperimentsServiceworker";
var version = "v6";
self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([self.skipWaiting(), caches.open(version + cacheName)])
  );
});
self.addEventListener("activate", function(event) {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      const keys = await caches.keys();
      return Promise.all(
        keys.filter(function(key) {
          return key.indexOf(version + cacheName) !== 0;
        }).map(function(key) {
          return caches.delete(key);
        })
      );
    })()
  );
});
self.addEventListener("fetch", function(event) {
  const request = event.request;
  const url = new URL(request.url);
  if (self.location.origin !== url.origin)
    return;
  if (url.pathname == "/esbuild")
    return;
  const base_path = dirname(self.location.pathname);
  if (url.pathname == `${base_path}/shinylive-inject-socket.js`) {
    event.respondWith(
      new Response(shinylive_inject_socket_default, {
        headers: { "Content-Type": "text/javascript" },
        status: 200
      })
    );
    return;
  }
  const appPathRegex = /.*\/(app_[^/]+\/)/;
  const m_appPath = appPathRegex.exec(url.pathname);
  if (m_appPath) {
    event.respondWith(
      (async () => {
        let pollCount = 5;
        while (!apps[m_appPath[1]]) {
          if (pollCount == 0) {
            return new Response(
              `Couldn't find parent page for ${url}. This may be because the Service Worker has updated. Try reloading the page.`,
              {
                status: 404
              }
            );
          }
          console.log("App URL not registered. Waiting 50ms.");
          await sleep(50);
          pollCount--;
        }
        url.pathname = url.pathname.replace(appPathRegex, "/");
        const isAppRoot = url.pathname === "/";
        const filter = isAppRoot ? injectSocketFilter : identityFilter;
        const blob = await request.blob();
        return fetchASGI(
          apps[m_appPath[1]],
          new Request(url.toString(), {
            method: request.method,
            headers: request.headers,
            body: request.method === "GET" || request.method === "HEAD" ? void 0 : blob,
            credentials: request.credentials,
            cache: request.cache,
            redirect: request.redirect,
            referrer: request.referrer
          }),
          void 0,
          filter
        );
      })()
    );
    return;
  }
  if (request.method !== "GET") {
    return;
  }
  if (useCaching) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        try {
          const networkResponse = await fetch(request);
          const baseUrl = self.location.origin + dirname(self.location.pathname);
          if (request.url.startsWith(baseUrl + "/shinylive/") || request.url === baseUrl + "/favicon.ico") {
            const cache = await caches.open(version + cacheName);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch {
          return new Response("Failed to find in cache, or fetch.", {
            status: 404
          });
        }
      })()
    );
    return;
  }
});
var apps = {};
(async () => {
  const allClients = await self.clients.matchAll();
  for (const client of allClients) {
    client.postMessage({
      type: "serviceworkerStart"
    });
  }
})();
self.addEventListener("message", (event) => {
  const msg = event.data;
  if (msg.type === "configureProxyPath") {
    const path = msg.path;
    const port = event.ports[0];
    apps[path] = port;
  }
});
function identityFilter(bodyChunk, response) {
  return bodyChunk;
}
function injectSocketFilter(bodyChunk, response) {
  const contentType = response.headers.get("content-type");
  if (contentType && /^text\/html(;|$)/.test(contentType)) {
    const bodyChunkStr = uint8ArrayToString(bodyChunk);
    const base_path = dirname(self.location.pathname);
    const newStr = bodyChunkStr.replace(
      /<\/head>/,
      `<script src="${base_path}/shinylive-inject-socket.js" type="module"><\/script>
</head>`
    );
    const newChunk = Uint8Array.from(
      newStr.split("").map((s) => s.charCodeAt(0))
    );
    return newChunk;
  }
  return bodyChunk;
}
