// Task #1

function isIncreasing(array) {

    if (!Array.isArray(array)) {
        throw new TypeError('Аргument must be an array');
    }

    if (array.length === 0) {
        return true;
    }

    for (let i = 1; i < array.length; i++) {
        if (array[i] <= array[i - 1]) {
            return false;
        }
    }
    return true;
}

// console.log(isIncreasing([1, 2, 3, 4]));
// console.log(isIncreasing([1, 2, 3, 2]));

// Task #1.2

function isDecreasing(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[i] <= array[i + 1]) {
            return false;
        }
    }
    return true;
}

// console.log(isDecreasing([4, 3, 2, 1]));
// console.log(isDecreasing([1, 2, 3, 2]));

// Task #2

function countOccurrences(array, num) {

    let count = 0;

    for (let i = 0; i < array.length; i++) {
        if (array[i] === num) {
            count++;
        }
    }
    return count;
}

function countOccurrences2(array, num) {
    return array.filter(item => item === num).length;
}


// console.log(countOccurrences2([1, 2, 2, 3, 4, 2], 2));

// Task #3

function areAnagrams(str1, str2) {
    const normalize1 = str1.toLowerCase().split('').sort().join('');
    const normalize2 = str2.toLowerCase().split('').sort().join('');

    return normalize1 === normalize2;
}

// console.log(areAnagrams("listen", "silent"));
// console.log(areAnagrams("hello", "world")); 


// Task #4

function getInitials(str) {
    return str.split(' ').map(word => word.charAt(0)).join('');
}
// console.log(getInitials("Front End Development"));

// Task #5

function countLetters(str) {

    const letterCount = {};

    for (let i = 0; i < str.length; i++) {

        if (str[i] !== ' ') {
            if (letterCount[str[i]]) {
                letterCount[str[i]]++;
            } else {
                letterCount[str[i]] = 1;
            }
        }

    }

    return letterCount;
}

// console.log(countLetters("Hello World"));

// Task #6

function findAdult(users) {
    for (let index = 0; index < users.length; index++) {
        const person = users[index];
        if (person.age > 18) {
            return person
        }
    }
}

// function findAdult(users) {
//     return users.find(user => user.age > 18)
// }

// console.log(findAdult([{ name: "Ivan", age: 19 }, { name: "Oksana", age: 2 }
// ]));

// Task #7

// перше до чого додумався
// function countByCategory(items) {
//     const result = {};

//     for (let i = 0; i < items.length; i++) {
//         const element = items[i];
//         if (result[element.category]) {
//             result[element.category]++;
//         } else {
//             result[element.category] = 1;
//         }
//     }
//     return result;
// }

// найбільш стислий варіант, до якого сам дійшов
function countByCategory(items) {
    const result = {};

    for (const item of items) {
        result[item.category] = result[item.category] ? result[item.category] + 1 : 1;
    }

    return result;
}

//покращений варіант з допомогою ші

// function countByCategory(items) {
//     return items.reduce((accumulator, item) => {
//         accumulator[item.category] = (accumulator[item.category] || 0) + 1;
//         return accumulator;
//     }, {});
// }

// console.log(countByCategory([
//     { name: "Phone", category: "tech" },
//     { name: "Laptop", category: "tech" },
//     { name: "Shirt", category: "clothes" }
// ]));

// Task #8



function findFactors(number) {
    const factors = [];

    for (let i = 1; i <= number; i++) {
        if (number % i === 0) {
            factors.push(i)
        }
    }

    return factors;
}

// console.log(findFactors(200)); 

//Task 9

function fib(n) {
    if (n <= 1) return n;

    let a = 0, b = 1;
    for (let i = 2; i <= n; i++) {
        const next = a + b;
        a = b;
        b = next;
    }
    return b;
}

// console.log(fib(9)); 

function findPair(arr, sum) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === sum) {
                return [arr[i], arr[j]]
            }
        }
    }
    return null;
}

// console.log(findPair([1, 2, 3, 4, 5, 6, 7, 8], 8));