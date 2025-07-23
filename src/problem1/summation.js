var sum_to_n_a = function(n) {
    // your code here
    let val = Number(n);

    if (val < 0) {
        return 0;
    }

    let result = 0;
    do {
        result += val;
        val -= 1;
    } while (val > 0);

    return result;
};

var sum_to_n_b = function(n) {
    // your code here
    let result = 0;
    for (let i = 1; i <= n; i++) {
        result += i;
    }

    return result;
};

var sum_to_n_c = function(n) {
    // your code here
    let result = Number(n);

    if (n > 0) {
        result += sum_to_n_c(n-1);
        return result;
    }

    return 0;
};

const sum_1_handler = () => {
    const val = document.getElementById('i1').value;
    console.log(val)
    const result = sum_to_n_a(val);
    document.getElementById('f1').innerHTML = result;
};
const sum_2_handler = () => {
    const val = document.getElementById('i2').value;
    const result = sum_to_n_b(val);
    document.getElementById('f2').innerHTML = result;
};
const sum_3_handler = () => {
    const val = document.getElementById('i3').value;
    const result = sum_to_n_c(val);
    document.getElementById('f3').innerHTML = result;
};