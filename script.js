
$(document).ready(function () {


    var users = [];


    function getUsersFromServer() {

        return $.ajax({
            method: "get",
            dataType: "json",
            url: 'https://jsonplaceholder.typicode.com/users',
            data: {}
        });

    }

    function resolveUsersPromise() {

        getUsersFromServer()
            .then(function (data) {
                users = data;
                // users = [];

                if(users.length == 0){
                    showMessageNoUsersFound();
                }
                renderTable();

            })
            .catch(function () {
            })

    }

    resolveUsersPromise();

    function showMessageNoUsersFound() {
        $('#noUserFound').css('display', 'block')
    }




    function renderTable() {

        clearTable();

        var theTemplateScript = $('#user-template').html();
        var theTemplate = Handlebars.compile(theTemplateScript);
        var context = {
            users: users
        };

        var theCompiledHtml = theTemplate(context);

        $('#bodyOfTable').append(theCompiledHtml);
    }




    $(document).on('click', ".deleteUser", function () {

        var LineId = this.name.slice(5);
        LineId = +LineId;
        var tempArr = [];


        for(var i =0; i < LineId; i++){
            tempArr[i] = users[i]
        }

        for(var j = LineId+1; j < users.length; j++ ){
            tempArr.push(users[j]);
        }

        users = tempArr;
        renderTable();

    });



    function clearTable() {
        $('#bodyOfTable').html('');

    }

    function addUser() {

        var emptyUser =  {
            name: null,
            email:null,
            phone: null,
            company: { name: null}
        };

        var nameSelector = $('#name');
        var emailSelector = $('#email');
        var phoneSelector = $('#phone');
        var workSelector = $('#work');

        emptyUser.name = nameSelector.val();
        emptyUser.email = emailSelector.val();
        emptyUser.phone = phoneSelector.val();
        emptyUser.company.name = workSelector.val();

        users.push(emptyUser);

        nameSelector.val('');
        emailSelector.val('');
        phoneSelector.val('');
        workSelector.val('');

        renderTable();

    }

    $('#AddUser').click(addUser);

    function getExchangeRatesFromServer(currency) {
        return $.ajax({
            method: "get",
            dataType: "json",
            url: 'http://api.fixer.io/latest?base='+currency,
            data: {}
        });
    }


    var tempRates;

    function resolveExchangeRates(currency) {

        getExchangeRatesFromServer(currency)
            .then(function (data) {
                tempRates = data.rates;
                convertCurrency();

            })
            .catch(function () {
            })

    }
    
    function deleteUser() {

    }

    deleteUser();



    function convertCurrency() {

        hideMessageErrorCalcul();

        var selectorShowResult =  $('#showCalculatorResult');

        selectorShowResult.text('Result: ');

        var currencyFrom = $('#currencyFrom').val();
        var currencyTo = $('#currencyTo').val();
        var moneyForExchange = $('#MoneyForExchange').val();
        moneyForExchange = +moneyForExchange;
        var exchangeRates = 1;
        var result;


        for (var key in tempRates) {
            if (key == currencyTo) {

                exchangeRates = tempRates[key];
            }
        }

        if (moneyForExchange) {
            result = moneyForExchange*exchangeRates;
            selectorShowResult.text('Result: '+result);
        }else{
            showMessageErrorCalcul();
        }

    }

    $( "#MoneyForExchange" ).blur(clearResultByBlurOnInputCalcul);


    function clearResultByBlurOnInputCalcul() {

        var moneyForExchange = $('#MoneyForExchange').val();

        if(moneyForExchange === ''){

            $('#showCalculatorResult').text('Result: ');
        }

    }

    function showMessageErrorCalcul() {
        $('#showCalculatorResult')
            .html('<span id="errorValueForCalcul"> Result: the value for counting is not valid</span>')
    }

    function hideMessageErrorCalcul() {
        $('#errorCalcul').html();
    }


    
    function calculateCourse() {

       var currencyFrom =  $('#currencyFrom').val();
        currencyFrom = currencyFrom.toLowerCase();
        resolveExchangeRates(currencyFrom);

    }

    $('#calculate').click(calculateCourse);









});
