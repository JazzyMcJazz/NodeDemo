// --------------------------------------
// Exercise 1 - Add numbers from string to float

const numberOne = '1.10';
const numberTwo = '2.30';

// add those two numbers and show the result
// you cannot touch line 1 neither line 2

const sum = parseFloat(numberOne) + parseFloat(numberTwo);
console.log(sum);

// --------------------------------------

// --------------------------------------
// Exercise 2 - Add the numbers and the total with 2 decimals

const anotherNumberOne = '1.10';
const anotherNumberTwo = '2.30';

const anotherSum = parseFloat(anotherNumberOne) + parseFloat(anotherNumberTwo);
console.log(anotherSum.toFixed(2));

// --------------------------------------
// Exercise 3 - Decimals and average

const one = 10;
const two = 45;
const three = 98;

// Show in the console the avg. with 5 decimals

const numArray = [one, two, three];
let anotherAnotherSum = 0;
numArray.forEach((element) => (anotherAnotherSum += element));
const avg = anotherAnotherSum / numArray.length;

console.log(avg.toFixed(5));

// --------------------------------------
// Exercise 4 - Get the character by index

const letters = 'abc';
// Get me the character "c"

console.log(letters.charAt(2));

// --------------------------------------
// Exercise 5 - Replace

const fact = 'You are learning javascript!';

// capitalize the J in Javascript

const i = fact.indexOf('j');
const c = fact.charAt(i);
const anotherFact = fact.replace(c, c.toUpperCase());

console.log(anotherFact);

// --------------------------------------
