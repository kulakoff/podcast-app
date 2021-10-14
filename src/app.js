import { isValid } from './utils'
import './styles.css'



const form = document.getElementById('form');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');


form.addEventListener('submit', submitFormHandler);

function submitFormHandler(event) {
    event.preventDefault()
    if (isValid(input.value)) {
        const question = {
            test: input.value.trim(),
            date: new Date().toJSON()
        };
        submitBtn.disbled = true;
        //async request to server, save question
        console.log('Question : ', question);
        input.value = '';
        input.className = '';
        submitBtn.disabled = false;
    }

}