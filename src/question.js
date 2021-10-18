const firebaseUrl = process.env.FIREBASE_URL
export class Question {
    static create(question) {
        return fetch(`${firebaseUrl}/questions.json`, {
            method: 'POST',
            body: JSON.stringify(question),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => response.json())
            .then(response => {
                question.id = response.name
                return question
            })
            .then(addToLocalStorage)
            .then(Question.renderList)
    }

    static renderList() {
        const questions = getQuestionsFromLocalStorage();
        const html = questions.length ? questions.map(toCard).join(' ') : `<div class="mui--text-headline">Ничего нет</div>`

        const list = document.getElementById('list');
        list.innerHTML = html;
    }
    static listToHTML(questions) {
        return questions.length ?
            `<ol>${questions.map(question => `<li><a href="mailto:${question.email}?subject=Feedback&body=Message">${question.email}</a> ${question.text}</li>`).join('')}</li></ol>`
            : '<p>Вопросов пока нет</p>'

    }
    static fetch(token) {
        if (!token) {
            return Promise.resolve('<p class="error"> У вас нет токена</p>')
        }
        return fetch(`https://podcast-app-d1c85-default-rtdb.europe-west1.firebasedatabase.app/questions.json?auth=${token}`)
            .then(response => response.json())
            .then(response => {
                console.log(response);
                if (response && response.error) {
                    return `<p class="error">${response.error}</p>`
                }
                return response ? Object.keys(response).map(key => ({
                    ...response[key],
                    id: key
                })) : []
            })
    }

}

function addToLocalStorage(question) {
    const all = getQuestionsFromLocalStorage();
    all.push(question);
    localStorage.setItem('questions', JSON.stringify(all))
}

function getQuestionsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('questions') || '[]')
}

function toCard(question) {
    return `
    <div class="mui--text-black-54">
    ${new Date(question.date).toLocaleDateString()}
    ${new Date(question.date).toLocaleTimeString()}
    </div>
    <div>${question.text}</div>
    <br>
`
}