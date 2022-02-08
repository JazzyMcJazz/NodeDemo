// --------------------------------------
// Arrays, for loops
// --------------------------------------
// Exercise 1 - Array Positioning

const letters = ['a', 'b', 'c'];
// show b in the console
console.log(letters[1]);

// --------------------------------------
// Exercise 2 - Array Positioning

const friends = [];

// What a lonely array. Add at least 3 friend objects to it.
const friendOne = { name: 'Bob' },
  friendTwo = { name: 'Mike' },
  friendThree = { name: 'Luna' };
friends.push(friendOne, friendTwo, friendThree);
console.log('friends array:', friends);

// --------------------------------------
// Exercise 3 - Get the index of first occurrence of that value.

const significantMathNumbers = [0, 2.718, 3.14159, 1729];

// You want to programmatically find where the number 1729 is in the array.
// programmatically means that no finger counting allowed. There is a method for this (finding index based of value).

const i = significantMathNumbers.indexOf(1729);
console.log('index of 1729:', i);

// --------------------------------------
// Exercise 4 - Inserting elements

const diet = ['tomato', 'cucumber', 'rocket'];

// You are a programmer. In one line (one statement) insert hamburger, soda and pizza between the elements cucumber and rocket
const rocketIndex = diet.indexOf('rocket');
diet.splice(rocketIndex, 0, 'hamburger', 'soda', 'pizza');
console.log('diet after splice:', diet);

// --------------------------------------
// Exercise 5 - Remove element

// Remove the LAST element of the array.
// Don't remove by index. You know in advance that it's the last in the array because you are too full already.

diet.pop();
console.log('diet after pop:', diet);

// --------------------------------------
// Exercise 6 - Copy array

// You really like your daily diet from last exercise. Copy it to a new array called dinnerTray so you can give it to a friend.

const dinnerTray = [...diet];
console.log('dinnerTray:', dinnerTray);

// --------------------------------------
// Exercise 7 - For loop

const lettersExpanded = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

// log every second char in the array starting from b

const indexB = lettersExpanded.indexOf('b');
const r = indexB % 2;

for (let j = indexB; j < lettersExpanded.length; j++) {
  if (j % 2 == r) console.log(lettersExpanded[j]);
}

// --------------------------------------
// Exercise 8 - For loop and if statement

const numbers = [5, 3, 2, 7, 11, 12, 0, -20, 6];

const discardedNumbers = [];

// log the element if the number is above 6 or below 0
// else push them to the array discardedNumbers

numbers.forEach((n) => {
  if (n < 0 || 6 < n) console.log(n);
  else discardedNumbers.push(n);
});

console.log(`Discarded Numbers: `, discardedNumbers);

// --------------------------------------
