/**
 * TO-DO-LIST
 * -------------------
 *
 * 1. Add event handler ---> Controller
 * 2. Get input values ---> View
 * 3. Add the new item to the data structure ---> Model
 * 4. Add the new item to the UI ---> View
 * 5. Calculate budget ---> Model
 * 6. Update the UI ---> View
 *  */

var budgetModel = (() => {
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var data = {
        items: {
            exp: [],
            inc: [],
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    };
    var calculateTotal = (type) => {
        var sum = 0;
        data.items[type].forEach(item => {
            sum += item.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: (type, des, val) => {
            var newItem, ID;

            if (data.items[type] > 0) {
                ID = data.items[type][data.items[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.items[type].push(newItem);
            return newItem;
        },

        getData: () => {
            return data;
        },

        calculateBudget: () => {
            // Calculate total income and expense
            calculateTotal('inc');
            calculateTotal('exp');
            // Calculate the budget: income - expense
            data.budget = data.totals.inc - data.totals.exp;
            // Calculate the percentage we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        getBudget: () => {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        }
    }
})();

var budgetView = (() => {
    var DOMStrings = {
        btnAdd: '.add__btn',
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetValue: '.budget__value',
        incomeValue: '.budget__income--value',
        expenseValue: '.budget__expenses--value',
        percentageValue: '.budget__expenses--percentage',
    };

    return {
        getDOMStrings: () => {
            return DOMStrings;
        },

        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // ==> 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        addListItem: (obj, type) => {
            var html, newHTML, element;

            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%">\n' +
                    '                            <div class="item__description">%description%</div>\n' +
                    '                            <div class="right clearfix">\n' +
                    '                                <div class="item__value">%value%</div>\n' +
                    '                                <div class="item__delete">\n' +
                    '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>';
            } else {
                element = DOMStrings.expenseContainer;
                html = '<div class="item clearfix" id="expense-%id%">\n' +
                    '                            <div class="item__description">%description%</div>\n' +
                    '                            <div class="right clearfix">\n' +
                    '                                <div class="item__value">%value%</div>\n' +
                    '                                <div class="item__percentage">21%</div>\n' +
                    '                                <div class="item__delete">\n' +
                    '                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\n' +
                    '                                </div>\n' +
                    '                            </div>\n' +
                    '                        </div>';
            }

            newHTML = html.replace('%id%', obj.id);
            newHTML = newHTML.replace('%description%', obj.description);
            newHTML = newHTML.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
        },

        clearFields: () => {
            var fields, fieldsArray;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ', '
                + DOMStrings.inputValue); // Return a NodeList

            fieldsArray = Array.prototype.slice.call(fields);
            fieldsArray.forEach((cur) => {
                cur.value = '';
            });
            fieldsArray[0].focus();
        },

        displayBudget: (obj) => {
            document.querySelector(DOMStrings.budgetValue).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeValue).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseValue).textContent = obj.totalExp;
            document.querySelector(DOMStrings.percentageValue).textContent = obj.percentage;

            if(obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageValue).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageValue).textContent = '---';
            }
        }
    };
})();

var budgetController = ((model, view) => {

    var ctrUpdateItem = () => {
        // 1. Calculate budget
        model.calculateBudget();
        // 2. Return the budget
        var budget = model.getBudget();
        // 3. Display budget
        view.displayBudget(budget);

    };

    var ctrAddItem = () => {
        var input, item;
        // 1. Get input data
        input = view.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
            // 2. Add the item to budget model
            item = model.addItem(input.type, input.description, input.value);
            // 3. Add the item to view
            view.addListItem(item, input.type);
            // 4. Clear fields
            view.clearFields();
            // 5. Calculate and update
            ctrUpdateItem();
        }
    };

    var setUpEventListeners = () => {
        var DOM = view.getDOMStrings();

        document.querySelector(DOM.btnAdd).addEventListener('click', ctrAddItem);

        document.addEventListener('keypress', event => {
            if (event.keyCode === 13) {
                ctrAddItem();
            }
        });
    };

    return {
        init: () => {
            console.log('Application is started! \n --------------------');
            view.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setUpEventListeners();
        }
    };
})(budgetModel, budgetView);

budgetController.init();
