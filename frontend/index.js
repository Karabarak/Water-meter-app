//jshint esversion:8
const danfoss = new Danfoss();
const ui = new UI();

//Buttons
const allHouses = document.querySelector('#allHouses');
const mostConsumedHouse = document.querySelector('#mostConsumedHouse');
const leastConsumedHouse = document.querySelector('#leastConsumedHouse');
const findHouse = document.querySelector('#findHouse');
const deleteHouse = document.querySelector('#deleteHouse');
const newHouse = document.querySelector('#newHouse');
const newMeter = document.querySelector('#newMeter');
const metersHouse = document.querySelector('#metersHouse');
const editHouse = document.querySelector('#editHouse');
const meterIndication = document.querySelector('#meterIndication');
const registerMeter = document.querySelector('#registerMeter');

const form = document.querySelector('#form');

allHouses.addEventListener('click', () => {
  ui.clear();
  danfoss.get('http://localhost:3000/houses')
    .then(data => ui.showAllHouses(data))
    .catch(err => console.log(err.message));
});

mostConsumedHouse.addEventListener('click', () => {
  ui.clear();
  danfoss.get('http://localhost:3000/houses/mostConsumed')
    .then(data => ui.showMostLeast(data))
    .catch(err => console.log(err.message));
});

leastConsumedHouse.addEventListener('click', () => {
  ui.clear();
  danfoss.get('http://localhost:3000/houses/leastConsumed')
    .then(data => ui.showMostLeast(data))
    .catch(err => console.log(err.message));
});

form.addEventListener('click', (e) => {

  const input = [];
  if (e.target.classList.contains('input')) {
    const inputs = document.querySelectorAll('input');
    inputs.forEach((e) => {
      input.push(e.value);
    });
  }

  if (e.target.id === 'Find') {
    if (input[0] !== '') {
      danfoss.get(`http://localhost:3000/houses/${input[0]}`)
        .then(data => ui.showHouse(data))
        .catch(err => console.log(err));
    } else {
      ui.showHouse({msg: "Please enter ID!"});
    }
  } else if (e.target.id === 'Delete') {
    if (input[0] !== '') {
      danfoss.delete(`http://localhost:3000/houses/${input[0]}`)
        .then(data => ui.showHouse(data))
        .catch(err => console.log(err));
    } else {
      ui.showHouse({msg: "Please enter ID!"});
    }
  } else if (e.target.id === 'AddHouse') {
    if (input[0] !== '' && input[1] !== '') {
      danfoss.post('http://localhost:3000/houses', {
          "address": input[0],
          "company": input[1]
        })
        .then(data => ui.showHouse(data))
        .catch(err => ui.showHouse(err));
    } else {
      ui.showHouse({msg: "Please enter Address and Company!"});
    }
  } else if (e.target.id === 'CreateMeter') {
    if (input[1] !== '' && input[2] !== '') {
      danfoss.post('http://localhost:3000/meters', {
          "houseID": input[0],
          "factoryNumber": input[1],
          "indication": input[2]
        })
        .then(data => ui.showHouse(data))
        .catch(err => ui.showHouse(err));
    } else {
      ui.showHouse({msg: "Please enter Factory Number and Indication, House ID is optional."});
    }
  } else if (e.target.id === 'FindMeters') {
    if (input[0] !== '') {
      danfoss.link(`http://localhost:3000/houses/${input[0]}`, {
          "houseID": input[0]
        })
        .then(data => ui.showMeters(data))
        .catch(err => ui.showHouse(err));
    } else {
      ui.showHouse({msg: "Please enter House ID"});
    }
  } else if (e.target.id === 'EditHouse') {
    if(input[0] !== '' && (input[1] !== '' || input[2] !== '')){
      danfoss.patch(`http://localhost:3000/houses/${input[0]}`, danfoss.validate(input))
        .then(data => ui.showHouse(data))
        .catch(err => ui.showHouse(err));
    }else{
      ui.showHouse({msg: "Please enter House ID, that you want to edit and at least one parameter."});
    }
  } else if(e.target.id === 'EnternewIndication'){
    if(input[0] !== '' && input[1] !== ''){
      danfoss.patch(`http://localhost:3000/meters/${input[0]}`, {
        "meterID": input[0],
        "meterIndication": input[1]
      })
      .then(data => ui.showMeters(data))
      .catch(err => ui.showHouse(err));
    }else{
      ui.showHouse({msg: "Please enter Meter ID and new Indication!"});
    }
  } else if(e.target.id === 'Register'){
    if(input[0] !== '' && input[1] !== ''){
      danfoss.patch('http://localhost:3000/meters', {
        "meterID": input[0],
        "houseID": input[1]
      })
      .then(data => ui.showMeters(data))
      .catch(err => ui.showHouse(err));
    }else{
      ui.showHouse({msg: "Please enter Meter ID and House ID!"});
    }
  }
  e.preventDefault();
});

deleteHouse.addEventListener('click', () => {
  ui.showForm('Delete');
});

newHouse.addEventListener('click', () => {
  ui.showForm('Add House');
});

findHouse.addEventListener('click', () => {
  ui.showForm('Find');
});

newMeter.addEventListener('click', () => {
  ui.showForm('Create Meter');
});

metersHouse.addEventListener('click', () => {
  ui.showForm('Find Meters');
});

editHouse.addEventListener('click', () => {
  ui.showForm('Edit House');
});

meterIndication.addEventListener('click', () =>{
  ui.showForm('Enter new Indication');
});

registerMeter.addEventListener('click', () =>{
  ui.showForm('Register');
});
