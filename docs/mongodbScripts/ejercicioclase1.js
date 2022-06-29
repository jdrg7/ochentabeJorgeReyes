{
    var IncomeDoc = {
        description: `Income Test # ${i + 1}.`,
        date: new Date().toISOString(),
        created: new Date().toISOString(),
        type: 'INCOME',
        amount: Math.floor(Math.random()*1000).toFixed(2),
        category: incomesTypes[Math.floor(Math.random()*3)]
    };
    incomes.push(IncomeDoc);
}



for (var i  =0; i < 100; i++)
{
    var expenseDoc = {
        description: `Expense Test # ${i + 1}.`,
        date: new Date().toISOString(),
        created: new Date().toISOString(),
        type: 'EXPENSE',
        amount: Math.floor(Math.random()*1000).toFixed(2),
        category: expensesTypes[Math.floor(Math.random()*5)]
    };
    expenses.push(expenseDoc);
}

db.cashFlow.insert(incomes);
db.cashFlow.insert(expenses);
