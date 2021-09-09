let db;
//establish a connection to IndexedDB DB called "budget_tracker"
const request = indexedDB.open('budget_tracker', 1);

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
        //uploadTransaction();
    }
};


request.onerror = function(event){
    console.log(event.target.errorCode);
};

//if we attempt to submit a transaction and there's no internet connection
function saveRecord(record) {
    //open a new transaction with database with read and write permission
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    //access the object store for "new_transaction"
    const budgetObjectStore = transaction.objectStore('new_transaction');

    //add record to store with add method
    budgetObjectStore.add(record);

}

function uploadTransaction(){
    const transaction = db.transaction(['new_transaction'], 'readwrite');

    const budgetObjectStore = transaction.objectionStore('new_transaction');

    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {

        if (getAll.result.length > 0){
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*','Content-Type':'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_transaction'], 'readwrite');
                const budgetObjectStore = transaction.onjectStore('new_transaction');
                budgetObjectStore.clear();

                alert('All saved transactions has been submitted!');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
};

window.addEventListener('online', uploadTransaction);