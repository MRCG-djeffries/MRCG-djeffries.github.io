if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('sw.js')
      //createDB(tf)
      .then(() => {
        console.log('Service Worker Registered');
        //createDB(tf);
      });
  }