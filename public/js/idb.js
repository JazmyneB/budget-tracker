let db;

const request = indexedDB.open('transactions', 1);

//if data version changes
request.onupgradeneeded = function(event){
    //save a reference to database
    const db = event.target.result;

    //create an object store (table) called `new_transaction`
    db.createObjectStore('new_transaction', { autoIncrement: true });
};

//upon a successful
request.onsuccess = function(event){
    db = event.target.result;

    //if app is online
    if (navigator.onLine) {

    }
};


request.onerror = function(event){
    console.log(event.target.errorCode);
};