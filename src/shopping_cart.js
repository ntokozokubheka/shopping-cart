const shoppingBaskets = require("./data.json");

const itemStatus = { paid: "PAID", delivered: "DELIVERED", open: "OPEN" };

function getCustomerBaskets({ email, shoppingBaskets }) {
  return shoppingBaskets.filter((item) => item.email === email);
}

function getAllCustomers({ shoppingBaskets }) {
  const uniqueEmails = [...new Set(shoppingBaskets.map((cart) => cart.email))];

  return uniqueEmails.sort();
}

function getRequiredStock({ shoppingBaskets }) {
  const stockList = [];

  shoppingBaskets.forEach((cart) => {
    if (cart.status === itemStatus.paid) {
      cart.items.forEach((cartItem) => {
        const existingItemIndex = stockList.findIndex(
          (stockItem) => stockItem.name === cartItem.name
        );
        if (existingItemIndex !== -1) {
          stockList[existingItemIndex].quantity += cartItem.quantity;
        } else {
          stockList.push({
            name: cartItem.name,
            quantity: cartItem.quantity,
          });
        }
      });
    }
  });

  return stockList;
}

function getTotalSpent({ email, shoppingBaskets }) {
  return shoppingBaskets.reduce((total, cart) => {
    if (
      (cart.status === itemStatus.paid ||
        cart.status === itemStatus.delivered) &&
      cart.email === email
    ) {
      total += cart.items.reduce(
        (itemTotal, cartItem) => itemTotal + cartItem.quantity * cartItem.price,
        0
      );
    }
    return total;
  }, 0);
}

function getTopCustomers({ shoppingBaskets }) {
  const topCustomersArrayWithDuplicates = shoppingBaskets.map((cart) => ({
    email: cart.email,
    total: getTotalSpent({ email: cart.email, shoppingBaskets }),
  }));

  const topCustomersArrayUnique = topCustomersArrayWithDuplicates.filter(
    (person, index, self) =>
      self.findIndex((p) => p.email === person.email) === index
  );

  return topCustomersArrayUnique.sort((a, b) => b.total - a.total);
}

function getCustomersWithOpenBaskets({ shoppingBaskets }) {
  const uniqueOpenEmails = [
    ...new Set(
      shoppingBaskets
        .filter((cart) => cart.status === itemStatus.open)
        .map((cart) => cart.email)
    ),
  ];

  return uniqueOpenEmails.sort();
}

module.exports = {
  getCustomerBaskets,
  getAllCustomers,
  getRequiredStock,
  getTotalSpent,
  getTopCustomers,
  getCustomersWithOpenBaskets,
};
