// Summation formula
var sum_to_n_a = function (n) {
  return (n * (n + 1)) / 2
}

// While loop
var sum_to_n_b = function (n) {
  let i = 1,
    sum = 0
  while (i <= n) {
    sum += i
    i++
  }
  return sum
}

// For loop
var sum_to_n_c = function (n) {
  let sum = 0
  for (let i = 0; i <= n; i++) {
    sum += i
  }
  return sum
}
