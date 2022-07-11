import axios from 'axios'
import A11yDialog from 'a11y-dialog'
import './css/index.css'

const loginDialogElement = document.querySelector('#login-dialog')
const loginDialog = new A11yDialog(loginDialogElement)
const noticeDialogElement = document.querySelector('#notice-dialog')
const noticeDialog = new A11yDialog(noticeDialogElement)
const voteButtons = document.querySelectorAll('#vote')
const loginButton = document.querySelector('#login-button')
const logoutButton = document.querySelector('#logout-button')
const loginForm = document.querySelector('#login-form')
const loginAlert = document.querySelector('#login-alert')
const loginAlertClose = loginAlert.querySelector('button')
const voteAlert = document.querySelector('#vote-alert')
const voteAlertClose = voteAlert.querySelector('button')
const voteSuccess = document.querySelector('#vote-sucess')
const voteSuccessClose = voteSuccess.querySelector('button')
const noticeSeen = sessionStorage.getItem('noticeSeen')
const setNotice = /** @param {Boolean} status */ (status) => { sessionStorage.setItem('noticeSeen', JSON.stringify(status)) }

if (noticeSeen === null || noticeSeen === false) {
    noticeDialog.show()
    setNotice(true)
}

axios
    .get('http://localhost:5000/isloggedin').then((res) => {
        if (res.data === false) {
            voteButtons.forEach(el => {
                // Disable Vote Button
                el.classList.value = 'mb-5 px-10 py-2.5 text-white text-center font-medium rounded-lg bg-gray-300 cursor-not-allowed'
                el.setAttribute('disabled', '')
            })
            logoutButton.classList.add('hidden')
        } else {
            loginButton.classList.add('hidden')
        }
    })

loginForm.addEventListener('submit', (e) => {
    const username = loginForm.querySelector('[name="username"]').value
    const password = loginForm.querySelector('[name="password"]').value

    axios
        .post('http://localhost:5000/login', {
            username: username,
            password: password
        })
        .then(res => {
            // Close any alert shown
            loginAlert.classList.remove('flex')
            loginAlert.classList.add('hidden')
            loginButton.classList.remove('hidden')
            // Enable Vote Button
            voteButtons.forEach(el => {
                // Disable Vote Button
                el.classList.value = 'mb-5 px-10 py-2.5 text-white text-center font-medium rounded-lg bg-gradient-to-r from-green-400 via-green-500 to-green-600 transition-colors hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-green-300 motion-reduce:transition-none'
                el.removeAttribute('disabled')
            })
            // Close dialog
            loginDialog.hide()
            window.location.href = self.location.href
        })
        .catch(err => {
            // Show alert
            loginAlert.classList.remove('hidden')
            loginAlert.classList.add('flex')
            loginAlert.querySelector('[data-alert-text]').innerHTML = err.response.data.msg
        })
    e.preventDefault()
})

loginAlertClose.addEventListener('click', () => {
    loginAlert.classList.remove('flex')
    loginAlert.classList.add('hidden')
})

voteButtons.forEach(el => {
    const candidate_id = el.getAttribute('data-candidate')

    el.addEventListener('click', () => {
        axios
            .post(`http://localhost:5000/vote?id=${candidate_id}`)
            .then((res) => {
                voteSuccess.classList.remove('hidden')
                voteSuccess.classList.add('flex')
                voteSuccess.querySelector('[data-alert-text]').innerHTML = res.data.msg
            })
            .catch(err => {
                voteAlert.classList.remove('hidden')
                voteAlert.classList.add('flex')
                voteAlert.querySelector('[data-alert-text]').innerHTML = err.response.data.msg
            })
    })
})

voteAlertClose.addEventListener('click', () => {
    voteAlert.classList.remove('flex')
    voteAlert.classList.add('hidden')
})

voteSuccessClose.addEventListener('click', () => {
    voteSuccess.classList.remove('flex')
    voteSuccess.classList.add('hidden')
})

logoutButton.addEventListener('click', () => {
    axios
        .post('http://localhost:5000/logout')
        .then(res => {
            voteSuccess.classList.remove('hidden')
            voteSuccess.classList.add('flex')
            voteSuccess.querySelector('[data-alert-text]').innerHTML = res.data.msg
            window.location.href = self.location.href
        })
        .catch(err => {
            voteAlert.classList.remove('hidden')
            voteAlert.classList.add('flex')
            voteAlert.querySelector('[data-alert-text]').innerHTML = err.response.data.msg
        })
})