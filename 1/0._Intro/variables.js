'use strict';

// don't use var or total globals
//var someVariable = 'value';
//totalGlobal = 'NEVER do this';

{
  let asdf = true;
  {
    let asdf = false;
    console.log(asdf);
  }
  console.log(asdf);
}

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    console.log(i);
  }, 1000);
}
