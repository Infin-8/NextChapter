export const compose = (...fns) => initial => fns
    .reduce((result, next) => next(result), initial)

export const getSum = arr => arr.reduce((a, b) => a + b, 0)

export const mapAmounts = arr => arr.map(({ amount }) => amount)