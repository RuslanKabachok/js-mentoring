function bmi(weight, height) {

    let bmi = weight / height ** 2;

    if (bmi <= 18.5) {
        return 'Underweight'
    } else if (bmi <= 25.0) {
        return 'Normal'
    } else if (bmi <= 30.0) {
        return 'Overweight'
    } else {
        return "Obese"
    }
}

function century(year) {
    const result = year % 100;
    let century = Math.floor(year / 100);

    if (result > 0) {
        return century + 1;
    } else {
        return century;
    }
}

function smash(words) {
    return words.join(' ').trim();
};

function lovefunc(flower1, flower2) {

    const timmy = flower1 % 2;
    const sarah = flower2 % 2;

    if (timmy === 0 && sarah === 0) {
        return false
    } else if (timmy === 1 && sarah === 1) {
        return false
    } else { return true }
}