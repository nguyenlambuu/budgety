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
        }
    };
})();

var budgetView = (() => {
    var DOMStrings = {
        btnAdd: '.add__btn',
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list'
    };

    return {
        getDOMStrings: () => {
            return DOMStrings;
        },

        getInput: () => {
            return {
                type: document.querySelector(DOMStrings.inputType).value, // ==> 'inc' or 'exp'
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value,
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
        }
    };
})();

var budgetController = ((model, view) => {
    var ctrAddItem = () => {
        // 1. Get input data
        var input = view.getInput();
        // 2. Add the item to budget model
        var item = model.addItem(input.type, input.description, input.value);
        console.log(model.getData());
        // 3. Add the item to view
        view.addListItem(item, input.type);
        // 4. Calculate data
        // 5. Display
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
            setUpEventListeners();
        },
        test: () => {
            ctrAddItem();
        }
    };
})(budgetModel, budgetView);

budgetController.init();
