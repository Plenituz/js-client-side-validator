This is a script allowing to do form validating similar to express-validator but very light and on the client side.
If you use this for sensible data please make sur you also validate your data on the server side, client side validation alone can be bypassed.

Here is how it works:
The script assumes you have some kind of form element to validate, here is an example from our project Ethermediary

```html
	<form id="mForm">
		<input type="text" placeholder="Object or service associated" name="meta"/>
		<input type="text" placeholder="Amount of tokens" name="amount"/>
	</form>
```
You need to remember the id you use for the form and the names of each input. Next you need to create the "validation data".
The validation data is an array of objects with a the following attributes:
 - name, the name of the input to validate
 - checks, an array of check objects
A check object has the following attributes:
 - funcName, the name of validation function to use, for a full list see below
 - args (optional), an array (or single value) of arguments to put into the validating function
 - msg, the error message returned if this condition is not met

To continue our exemple here is what our validation data might look like:
```javascript
var validationData = [
	{
		"name":"meta",
		"checks":[
			{
				"funcName":"notEmpty",
				"msg":"Error: Please enter the transaction purpose"
			},
			{
				"funcName":"len",
				"args": 10,
				"msg":"Error: The transaction purpose must be exactly 10 character long"
			}
		]
	},
	{
		"name":"amount",
		"checks":[
			{
				"funcName":"isNumber",
				"msg":"Error: Please enter a decimal number"
			}
		]
	}
]
```
Here the content of the input "meta" must be not empty AND exactly 10 character long. "amount" must be a number (int or float alike).

To perform the validation you have several options:
```javascript
//we do it all for you
var validationResult = validator.validateForm("mForm", validationData);

//doing it manually
var form = document.getElementById("mForm");
//extractForm will read the form data and return an object representing it
var formData = validator.extractForm(form);
//you could alter the form data if needed here
var validationResult = validator.validateFormData(formData, validationData);


//even more manually you could check each input manually
//2 ways of doing that:
//first one still using the validationData approach:

//get the input data somehow
var inputData = document.getElementById("mInput").value;
//here the validation data only contains the 'checks' part
var validationData = [
	{
		"funcName":"notEmpty",
		"msg":"Error: Please enter the transaction purpose"
	}
	//any number of check
]
var validationResult = validator.validateInput(inputData, validationData);

//second one is to check using the rawest method:
var inputData = document.getElementById("mInput").value;
//we use the validation methods directly in an array
var validation = [validator.isInt("input should an int"), validator.len("length should be 5", 5)];
var validationResult = validator.validate(inputData, validation);
```
The validation result is always an object with 2 attributes:
 - passed, boolean true if the error list is empty
 - errors, a list of all the validation errors
the validation errors are as follows:
 - inputName, name of the input on which this validation failed
 - errors, a list of string containing all the error messages associated with this input

If you use `validator.validateInput()` you get an object with "passed" and "errors" (a list of string).
Finally if you use `validator.validate()` you only get a list of error strings
 
A validation result might look like this:
```javascript
{
	passed: false,
	errors:[
		{
			inputName: "meta",
			errors:[
				"Error: Please enter the transaction purpose",
				"Error: The transaction purpose must be exactly 10 character long"
			]
		},
		{
			inputName: "amount",
			errors:[
				"Error: Please enter a decimal number"
			]
		}
	]
}
```
List of the current validation functions:
- isInt: the input must be an Integer
- notEmpty: the input can't be an empty string
- len(l): the input must have a length attribute exactly equal to l 
- isAlphanumeric: the input must be only alphanumeric characters
- isEmail: the input should follow the format of an email
- isDecimal: the input must be a decimal number
- isNumber: the input must be a number, integer or not
	
Expanding the system:
As you might have realised I build this system according to my needs and a lot of useful validation could be added.
To do so it's really easy:
1) create a private function in the validator that will perform the validation, accepting at least one argument which will be the input data
2) create a public function returning a new PartialFunction object. The constructor expect a function, error message, and eventually some arguments
3) that's it ! you can use your new validation function in your validation data or manually

Let's implement a validation function that make sure the input length is lower that a certain number as an example:

Creating the private function:
```javascript
//code in validator.js..
function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

//your code can go here!
function isLower(data, l){
	//make sure data is not undefined/null
	if(data)
		return data.length <= l;
	else
		return false;
}

return {
	isInt: (msg) => new PartialFunction(isInt, msg),
//code in validator.js...
```

Now for the public function:
```javascript
//code in validator.js...
isDecimal: (msg) => new PartialFunction(isDecimal, msg),
isNumber: (msg) => new PartialFunction(isNumber, msg),
//your function:
isLower: (msg, l) => new PartialFunction(isLower, msg, l),
```
This is one example of expanding the system, you could do much more! Feel free to use this code as you what for any purpose.
