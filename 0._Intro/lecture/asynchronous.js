// why asynchronous?
 // because javascript is single-threaded

 // When?
 // fetching data (over network)
 // event listeners
 // Converting data: Stream
 // File handling
 // Databases
 // Processes that take a long time, and you don't want it to block your code

 // Beware of the callback pyramid of doom -> use Promise instead


// PROMISES
 //Promise states:
    // Pending
    // Fulfilled
        // resolved, rejected

 new Promise((resolve, reject) => {
     try {
         // throw new Error('oops');
         resolve('Everything went well');
     } catch {
         reject('Everything went to hell');
     }

 })
.then(message => console.log(message))
.catch(err => console.log(err));

 /* assignment: create a function called somethingGoodSomethingBad
 it should return a promise - that is to say that we wrap the function in a promise
 BEWARE: your should not handle the promise.. just create a function that returns a promise
    make it take 4 seconds to resolve.

  */

function somethingGoodSomethingBad(){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                throw new Error('oops');
                resolve('Something Good');
            } catch {
                reject('Something Bad');
            }
        }, 4000) // 4 seconds
    })
 }

// ASYNC/AWAIT
// const goodOrBad = await somethingGoodSomethingBad(); // this is not supposed to throw an error, but it does for me :/
// console.log(goodOrBad);

// IIFE - Immediately Invoked Function Expression. Syntax to call a function immediately.
(async function getCondition() {
    try {
        const goodOrBad = await somethingGoodSomethingBad();
        console.log(goodOrBad);
    } catch (err) {
        console.log(err)
    }
})();