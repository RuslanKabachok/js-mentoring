// Task #1

function isIncreasing(array) {
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

// console.log(areAnagrams("listen", "silent")); // true
// console.log(areAnagrams("hello", "world")); // false


// Task #4

function getInitials(str) {
    return str.split(' ').map(word => word.charAt(0)).join('');
}
// console.log(getInitials("Front End Development")); // "FED"

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