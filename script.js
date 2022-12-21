"use strict";

/////////////////////////////////////////////////

const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

/////////////////////////////////////////////////

const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

/////////////////////////////////////////////////

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";

    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
      <div class="movements__value">${mov}€</div>
    </div>
    `;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/////////////////////////////////////////////////

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter((mov) => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = acc.movements
    .filter((mov) => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = acc.movements
    .filter((mov) => mov > 0)
    .map((deposit) => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      console.log(arr);
      return int >= 1;
    })
    .reduce((acc, mov) => acc + mov, 0);
  labelSumInterest.textContent = `${interest}€  `;
};

/////////////////////////////////////////////////

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLocaleLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};
createUsernames(accounts);

/////////////////////////////////////////////////

const updateUI = function (acc) {
  displayMovements(acc.movements);

  calcDisplayBalance(acc);

  calcDisplaySummary(acc);
};

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    (acc) => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();

    updateUI(currentAccount);
  }
});

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some((mov) => mov >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);

    updateUI(currentAccount);
  }
  inputLoanAmount.value = "";
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = "";
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    (acc) => acc.username === inputTransferTo.value
  );

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    updateUI(currentAccount);
  }
});

let sorted = false;
btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const eurTousd = 1.1;
const movementsUSD = movements.map((mov) => {
  mov * eurTousd;
});

const movementUSDfor = [];
for (const mov of movements) movementUSDfor.push(mov * eurTousd);

const movementsDescriptions = movements.map((mov, i) => {
  `Movement ${i + 1}: You ${mov > 0 ? "deposited" : "withdrew"}
   ${Math.abs(mov)}
  `;
});

// const deposits = movements.filter(function (mov, i, arr) {
//   return mov > 0;
// });

const depositsFor = [];
for (const mov of movements) if (mov > 0) depositsFor.push(mov);

// const withdrawals = movements.filter((mov) => mov < 0);

/////////////////////////////////////////////////

const balance = movements.reduce((acc, cur) => acc + cur, 0);

let balance2 = 0;
for (const mov of movements) balance2 += mov;

/////////////////////////////////////////////////

const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);

/////////////////////////////////////////////////

const totalDepositsUSD = movements
  .filter((mov) => mov > 0)
  .map((mov, i, arr) => {
    return mov * eurTousd;
  })
  .reduce((acc, mov) => acc + mov, 0);

/////////////////////////////////////////////////

const firstWithDrawal = movements.find((mov) => mov < 0);
const account = accounts.find((acc) => acc.owner === "Jessica Davis");

/////////////////////////////////////////////////

const anyDeposits = movements.some((mov) => mov > 0);
const deposit = (mov) => mov > 0;

/////////////////////////////////////////////////

const overalBalance = accounts
  .map((acc) => acc.movements)
  .flat()
  .reduce((acc, mov) => acc + mov, 0);

const overalBalance2 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((acc, mov) => acc + mov, 0);

/////////////////////////////////////////////////

const owners = ["Jonas", "Zach", "Adam", "Martha"];

movements.sort((a, b) => a - b);
movements.sort((a, b) => b - a);

/////////////////////////////////////////////////

const arr = [1, 2, 3, 4, 5, 6, 7];
const x = new Array(7);

x.fill(1, 3, 5);
x.fill(1);

arr.fill(23, 4, 6);

const y = Array.from({ length: 7 }, () => 1);
const z = Array.from({ length: 7 }, (_, i) => i + 1);

labelBalance.addEventListener("click", function () {
  const movementsUI = Array.from(
    document.querySelectorAll("movements__value"),
    (el) => Number(el.textContent.replace("€", ""))
  );

  const movementsUI2 = [...document.querySelectorAll(".movements__value")];
});

/////////////////////////////////////////////////

const bankDepositSum = accounts
  .flatMap((acc) => acc.movements)
  .filter((mov) => mov > 0)
  .reduce((sum, cur) => sum + cur, 0);
console.log(bankDepositSum);

/////////////////////////////////////////////////

const numDeposits1000 = accounts
  .flatMap((acc) => acc.movements)
  .reduce((count, cur) => (cur >= 1000 ? count++ : count), 0);
console.log(numDeposits1000);

/////////////////////////////////////////////////

const { deposits, withdrawals } = accounts
  .flatMap((acc) => acc.movements)
  .reduce(
    (sums, cur) => {
      sums[cur > 0 ? "deposits" : "withdrawals"] += cur;
      return sums;
    },
    { deposits: 0, withdrawals: 0 }
  );
console.log(deposits, withdrawals);

/////////////////////////////////////////////////

const convertTitleCase = function (title) {
  const capitzalize = (str) => str[0].toUpperCase() + str.slice(1);

  const exceptions = ["a", "an", "and", "the", "but", "or", "in", "with"];

  const titleCase = title
    .toLowerCase()
    .split(" ")
    .map((word) => (exceptions.includes(word) ? word : capitzalize(word)))
    .join(" ");
  return capitzalize(titleCase);
};
console.log(convertTitleCase("this is a nice title"));
console.log(convertTitleCase("this is a LONG title but n ot too long"));
console.log(convertTitleCase("and here is another title with an EXAMPLE"));
