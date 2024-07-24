let btnsNext = document.querySelectorAll("[data-nav='next']");
let btnsPrev = document.querySelectorAll("[data-nav='prev']");
let answers = {};
const totalCountCard = document.querySelectorAll("[data-card-number]").length;

btnsNext.forEach(function (button)
{
	button.addEventListener("click", function (e)
	{
		let currentCard = button.closest("[data-card-number]");
		let currentCardNumber = parseInt(currentCard.dataset.cardNumber);
		if (currentCard.dataset.validate == 'novalidate')
		{
			navigate("next", currentCard);
			updateProgressBar("next",currentCardNumber);
		}
		else
		{
			saveAnswer(currentCardNumber, gatherData(currentCardNumber));
			if (isFilled(currentCardNumber) && checkRequiredFild(currentCardNumber))
			{
				navigate("next", currentCard);
				updateProgressBar("next",currentCardNumber);
			}
			else
			{
				alert("Сначала ответьте");
			}

		}
	})
})

btnsPrev.forEach(function (button)
{
	button.addEventListener("click", function (e)
	{
		let currentCard = button.closest("[data-card-number]");
		let currentCardNumber = parseInt(currentCard.dataset.cardNumber);
		navigate("prev", currentCard);
		updateProgressBar("prev",currentCardNumber);
	})
})

document.querySelectorAll(".radio-group").forEach(function (item)
{
	item.addEventListener("click", function (e){
		let label = e.target.closest("label")
		if(label){
			label.closest(".radio-group").querySelectorAll("label").forEach(function(elem){
				elem.classList.remove("radio-block--active");
			})
			label.classList.add("radio-block--active");
		}

	})

})
document.querySelectorAll("label.checkbox-block input[type='checkbox']").forEach(function (item)
{
	item.addEventListener("change", function (e){
		if(item.checked){
			item.closest("label").classList.add("checkbox-block--active");
		}
		else{
			item.closest("label").classList.remove("checkbox-block--active")
		}
	})

})


function navigate(direction, currentCard)
{
	currentCard.classList.add("hidden");
	let nextCardNumber;
	if (direction == 'next')
		nextCardNumber = parseInt(currentCard.dataset.cardNumber) + 1;
	else
		nextCardNumber = parseInt(currentCard.dataset.cardNumber) - 1;
	nextCard = document.querySelector(`[data-card-number = '${nextCardNumber}' ]`);
	nextCard.classList.remove("hidden");
}

function gatherData(number)
{
	let currentCard = document.querySelector(`[data-card-number='${number}']`);
	let question = currentCard.querySelector("[data-question]").innerText;
	let data = {};
	let result = [];

	let currentRadios = currentCard.querySelectorAll("[type='radio']");
	currentRadios.forEach(function (elem)
	{
		if (elem.checked)
		{
			result.push({
				name: elem.name,
				value: elem.value
			})
		}
	});

	let currentCheckboxs = currentCard.querySelectorAll("[type='checkbox']");
	currentCheckboxs.forEach(function (elem)
	{
		if (elem.checked)
		{
			result.push({
				name: elem.name,
				value: elem.value
			})
		}
	});

	let currentInputs = currentCard.querySelectorAll("[type='text'],[type='email']");
	currentInputs.forEach(function (elem)
	{
		if (elem.value.trim() != '')
		{
			result.push({
				name: elem.name,
				value: elem.value
			})
		}
	});

	data = {
		question: question,
		answer: result
	}
	return data
}

function saveAnswer(number, data)
{
	answers[number] = data;
}
function isFilled(number)
{
	if (answers[number].answer.length > 0)
		return true;
	return false;
}

function checkRequiredFild(number)
{
	let currentCard = document.querySelector(`[data-card-number='${number}']`);
	let requireds = currentCard.querySelectorAll("[required]");
	let notValidateValue = [];
	requireds.forEach(function (elem)
	{
		if (elem.type == 'email' && !isValidateEmail(elem.value))
			return notValidateValue.push(false);
		if (elem.type == 'checkbox' && !elem.checked)
			return notValidateValue.push(false)
	})
	if (notValidateValue.indexOf(false) == -1)
		return true
	else
		return false

}
function isValidateEmail(text)
{
	const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu;
	return EMAIL_REGEXP.test(text);
}

function updateProgressBar(mode,currentCardNumber){
	if(mode=='next'){
		newCardNumber = currentCardNumber + 1
	} else if (mode == 'prev'){
		newCardNumber = currentCardNumber - 1
	}
	perCent = (newCardNumber*100/totalCountCard).toFixed();
	let currentCard = document.querySelector(`[data-card-number= '${newCardNumber}']`);
	let progressBar = currentCard.querySelector(".progress");
	console.dir(progressBar);
	if(progressBar){
		progressBar.querySelector(".progress__label strong").innerText = `${perCent}%`;
		progressBar.querySelector(".progress__line-bar").style = `width:${perCent}%`;
	}
}
// Очередная проверка
// А это не заPR