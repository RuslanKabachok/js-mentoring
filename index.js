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