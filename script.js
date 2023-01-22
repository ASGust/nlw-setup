const form = document.querySelector("#form-habits")
const nlwSetup = new NLWSetup(form)
const button = document.querySelector("header button")
const modal = document.querySelector(".modal")
const cancelButton = document.querySelector(".outlined")

const textarea = document.querySelector('#description')
const saveButton = document.querySelector('#save')
let currentCheckbox = null;

button.addEventListener("click", add)
cancelButton.addEventListener("click", cancel)
form.addEventListener("change", openModal)
saveButton.addEventListener('click', save)

function add() {
  const today = new Date().toLocaleDateString("pt-br").slice(0, -5)
  //const today = "10/01"
  const dayExists = nlwSetup.dayExists(today)

  if (dayExists) {
    alert("Dia já incluso 🔴")
    return
  }

  alert("Adicionado com sucesso ✅")
  nlwSetup.addDay(today)
}

function cancel() {
  modal.classList.remove("active")
  currentCheckbox.checked = false
}

function openModal(element) {
  const isChecked = element.target.checked;

  if (isChecked) {
    modal.classList.add("active")
    currentCheckbox = element.target;
  } else {
    localStorage.setItem("NLWSetup@habits", JSON.stringify(nlwSetup.data))
    const allDescriptions = JSON.parse(localStorage.getItem("NLWDescriptions"))

    const data = element.target.getAttribute('value')
    const name = element.target.getAttribute('name')

    const descriptionsFiltered = allDescriptions.filter(function (desc) {
      if (desc.data === data && desc.name === name) {
        return false
      }
      return desc
    })

    localStorage.setItem('NLWDescriptions', JSON.stringify(descriptionsFiltered))
    LoadDescriptions()
  }

}

function save() {
  const description = textarea.value;

  const newDescription = {
    data: currentCheckbox.getAttribute('value'),
    description,
    name: currentCheckbox.getAttribute('name')
  }

  const allDescriptions = JSON.parse(localStorage.getItem("NLWDescriptions"));

  if (!allDescriptions) {
    localStorage.setItem('NLWDescriptions', JSON.stringify([newDescription]))
  } else {
    allDescriptions.push(newDescription)
    localStorage.setItem('NLWDescriptions', JSON.stringify(allDescriptions))
  }

  LoadDescriptions()
  textarea.value = ""
  modal.classList.remove('active')
  localStorage.setItem("NLWSetup@habits", JSON.stringify(nlwSetup.data))

}

const data = JSON.parse(localStorage.getItem("NLWSetup@habits")) || {}
nlwSetup.setData(data)
nlwSetup.load()

function LoadDescriptions() {
  const allCheckbox = document.querySelectorAll('input[type="checkbox"]')
  const allDescriptions = JSON.parse(localStorage.getItem("NLWDescriptions"));

  allCheckbox.forEach(function (input) {

    const data = input.getAttribute('value')
    const name = input.getAttribute('name')

    const findedDescription = allDescriptions.find(function filter(desc) {
      if (desc.data === data && desc.name === name) {
        return true
      }
      return false
    })

    if (findedDescription) {
      input.setAttribute('title', findedDescription.description)
    } else {
      input.removeAttribute('title')
    }
  })

}
LoadDescriptions()