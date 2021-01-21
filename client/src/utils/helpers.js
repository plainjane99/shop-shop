export function pluralize(name, count) {
  if (count === 1) {
    return name
  }
  return name + 's'
}

// IndexedDB to make our data persistent
// create a IndexedDB helper function that does the following:
// open the database connection
// create the object store (if it's the first time using it on the machine) then connect to the object store that we pass in as storeName, 
// run whatever transaction we need to have run on a successful connection
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // open connection to the database `shop-shop` with the version of 1
    const request = window.indexedDB.open('shop-shop', 1);

    // create variables to hold reference to the database, transaction (tx), and object store
    let db, tx, store;

    // if version has changed (or if this is the first time using the database), run this method and create the three object stores 
    // this only runs once to create the object stores
    request.onupgradeneeded = function (e) {
      const db = request.result;
      // create object store for each type of data and set "primary" key index to be the `_id` of the data
      db.createObjectStore('products', { keyPath: '_id' });
      db.createObjectStore('categories', { keyPath: '_id' });
      db.createObjectStore('cart', { keyPath: '_id' });
    };

    // handle any errors with connecting
    request.onerror = function (e) {
      console.log('There was an error');
    };

    // when the database connection opens successfully, 
    // we immediately save a reference of the database to the db variable
    // on database open success
    request.onsuccess = function (e) {
      // save a reference of the database to the `db` variable
      db = request.result;
      // open a transaction do whatever we pass into `storeName` (must match one of the object store names)
      // open a new transaction using the .transaction() method, 
      // passing in the object store that we want to interact with and the permissions we want in this transaction
      // the storeName—one of the three stores we created for the database—will be passed in as an argument 
      // in the idbPromise() function when we call it from a component
      tx = db.transaction(storeName, 'readwrite');
      // save a reference to that object store so that we can perform a CRUD method
      store = tx.objectStore(storeName);

      // onerror event listener
      // if there's any errors, let us know
      db.onerror = function (e) {
        console.log('error', e);
      };

      // check which value we passed into the function as a method and perform that method on the object store
      switch (method) {
        // if put
        case 'put':
          // run put() method on the object store, overwriting any data with the matching _id value
          // and adding it if it can't find a match
          store.put(object);
          resolve(object);
          break;
        case 'get':
          // get all data from that store and return it
          const all = store.getAll();
          all.onsuccess = function () {
            resolve(all.result);
          };
          break;
        case 'delete':
          // delete that item from the object store
          // such as remove an item from the shopping cart while offline
          store.delete(object._id);
          break;
        default:
          console.log('No valid method');
          break;
      }

      // oncomplete event listener
      // when the transaction is complete, close the connection
      tx.oncomplete = function () {
        db.close();
      };
    };

  });
}