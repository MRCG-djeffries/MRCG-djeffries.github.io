if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      //createDB(tf)
      .then(() => {
        console.log('Service Worker Registered sw.js');
        //createDB(tf);
      });
  }
