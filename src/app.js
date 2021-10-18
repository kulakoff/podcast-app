import { Question } from './question';
import { createModal, isValid } from './utils'
import { getAuthFtom, authWhithEmailAndPassword } from './auth';
import './styles.css'

const form = document.getElementById('form');
const modalBtn = document.getElementById('modal-btn');
const userEmail = form.querySelector('#email-input');
const input = form.querySelector('#question-input');
const submitBtn = form.querySelector('#submit');

window.addEventListener('load', Question.renderList)
form.addEventListener('submit', submitFormHandler);
modalBtn.addEventListener('click', openModal)
input.addEventListener('input', () => {
    submitBtn.disabled = !isValid(input.value);
})

function submitFormHandler(event) {
    event.preventDefault()
    console.log(`email: ${userEmail.value}`)
    if (isValid(input.value) && isValid(input.value)) {
        const question = {
            email: userEmail.value,
            text: input.value.trim(),
            date: new Date().toJSON()
        };
        submitBtn.disbled = true;
        //async request to server, save question
        Question.create(question).then(() => {
            input.value = '';
            input.className = '';
            submitBtn.disabled = false;
        })
        console.log('Question : ', question);
    }
}



function openModal() {
    createModal('Авторизация', getAuthFtom());
    document
        .getElementById('auth-form')
        .addEventListener('submit', authFormHandler,
        // { once: true }
    );
}

function authFormHandler(event) {
    event.preventDefault();

    const btn = event.target.querySelector('button')
    const email = event.target.querySelector('#email').value;
    const password = event.target.querySelector('#password').value;


    console.log(email, password);
    btn.disabled = true
    authWhithEmailAndPassword(email, password)
        // .then(token => { return Question.fetch(token) })
        .then(Question.fetch)
        .then(renderModalAfterAuth)
        .then(() => btn.disabled = false)
}

function renderModalAfterAuth(content) {
    if (typeof content === 'string') {
        createModal('Ошибка', content)
    } else {
        console.log('|DEBUG|renderModalAfterAuth| content: ', content);
        createModal('Список вопросов', Question.listToHTML(content))

    }
    console.log('Content : ', content);
}
