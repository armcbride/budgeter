const indexDb = window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

  let db ;

const request = indexDb.open("budgeter", 1);

request.onupgradeneeded = function({target}) {
    const db = target.result;
    db.createObjectStore("pending", { autoIncrement: true });
  };

  request.onsuccess = function({target}) {
    db = target.result;
    if(navigator.onLine){
        checkDatabase()

    }};

    request.onerror = function(e) {
        console.log("There was an error");
      };

    
    function saveRecord(record) {
        const transaction = db.transaction(["pending"], "readwrite");
      const store = transaction.objectStore("pending");
      store.add(record);
    };

    function checkDatabase() {
        const transaction = db.transaction(["pending"], "readwrite");
        const store = transaction.objectStore(["pending"]);
        const getAll = store.getAll();
        getAll.onsuccess= function (){
            if (getAll.result.length > 0){
                fetch("/api/transaction/bulk", {
                    method: "POST",
                    body: JSON.stringify(getAll.result),
                    headers: {
                        Accept: "application/json, text/plain, */*",
                        "Content-Type": "application/json"
                      }
              
                }).then(response =>{
                    return response.json()
                }).then(()=>{
                    const transaction = db.transaction(["pending"], "readwrite");
                    const store = transaction.objectStore("pending");
                    store.clear();
                })
            }
        } 
    };

    window.addEventListener("online", checkDatabase);