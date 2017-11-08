var testData = {
    intData:         5,
    intStrData:      "192",
    len5Data:        "abcde",
    emptyData:       "",
    emailData:       "email@website.com",
    alphanumStrData: "abcdef12345",
    nonAlphanumStr:  "abcdef12345#&%^",
    decimalData:     5.454,
    decimalStrData:  "1.5123",
    nullData:        null
}

function assert(cond, msg){
    if(!cond)
        throw msg
}

function validateTest(func, validFields, ...args){
    for(field in testData){
        if(!(field in validFields)){
            console.log("no field " + field + " here");
            continue;
        }
        let validation;
        if(args)
            validation = [func(field, ...args)];
        else
            validation = [func(field)]; 
        let result = validator.validate(testData[field], validation);
        assert((result.length == 0) == validFields[field], "field " + field + " didn't pass");
    }
}

var tests = {
    validateMsg: function(){
        let msg = "error msg displayed";
        let validation = [validator.isInt(msg)];
        let result = validator.validate("abc", validation);
        assert(result[0] == msg);
    },

    validate_IsInt: function(){
        var validFields = {
            intData:         true,
            intStrData:      true,
            len5Data:        false,
            emptyData:       false,
            emailData:       false,
            alphanumStrData: false,
            nonAlphanumStr:  false,
            decimalData:     false,
            decimalStrData:  false,
            nullData:        false
        };
        validateTest(validator.isInt, validFields);
    },

    validate_NotEmpty: function(){
        var validFields = {
            intData:         true,
            intStrData:      true,
            len5Data:        true,
            emptyData:       false,
            emailData:       true,
            alphanumStrData: true,
            nonAlphanumStr:  true,
            decimalData:     true,
            decimalStrData:  true,
            nullData:        false
        }
        validateTest(validator.notEmpty, validFields);
    },

    validate_Len5: function(){
        var validFields = {
            intData:         false,
            intStrData:      false,
            len5Data:        true,
            emptyData:       false,
            emailData:       false,
            alphanumStrData: false,
            nonAlphanumStr:  false,
            decimalData:     true,
            decimalStrData:  false,
            nullData:        false
        }
        validateTest(validator.len, validFields, 5);
    },

    validate_IsAlphanumeric: function(){
        var validFields = {
            intData:         true,
            intStrData:      true,
            len5Data:        true,
            emptyData:       true,
            emailData:       false,
            alphanumStrData: true,
            nonAlphanumStr:  false,
            decimalData:     false,
            decimalStrData:  false,
            nullData:        true
        };
        validateTest(validator.isAlphanumeric, validFields);
    },

    validate_IsEmail: function(){
        var validFields = {
            intData:         false,
            intStrData:      false,
            len5Data:        false,
            emptyData:       false,
            emailData:       true,
            alphanumStrData: false,
            nonAlphanumStr:  false,
            decimalData:     false,
            decimalStrData:  false,
            nullData:        false
        };
        validateTest(validator.isEmail, validFields);
    },

    validate_IsDecimal: function(){
        var validFields = {
            intData:         false,
            intStrData:      false,
            len5Data:        false,
            emptyData:       false,
            emailData:       false,
            alphanumStrData: false,
            nonAlphanumStr:  false,
            decimalData:     true,
            decimalStrData:  true,
            nullData:        false
        };
        validateTest(validator.isDecimal, validFields);
    },

    validate_IsNumber: function(){
        var validFields = {
            intData:         true,
            intStrData:      true,
            len5Data:        false,
            emptyData:       false,
            emailData:       false,
            alphanumStrData: false,
            nonAlphanumStr:  false,
            decimalData:     true,
            decimalStrData:  true,
            nullData:        false
        };
        validateTest(validator.isNumber, validFields);
    },

    extractForm: function(){
        let expectedData = {
            meta: "meta",
            amount:"amount"
        };
        let form = document.getElementById("mForm");
        let data = validator.extractForm(form);
        for(prop in data){
            assert(data[prop] == expectedData[prop], "member " + prop + " is different");
        }
    }
}


window.addEventListener("load", function(){
    for(testName in tests){
        try{
            console.log("running " + testName);
            tests[testName]();
            console.log(testName + " passed");
        }catch(err){
            console.log("test '" + testName + "' failed:\n", err);            
        }
    }
    console.log("test run done");
});


