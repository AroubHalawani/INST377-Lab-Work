function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
  
}
function restoArrayMake(dataArray) {
  console.log(dataArray.length);
  console.log('fired dataHandler');
  const range = [...Array(15).keys()];
  const listItems = range.map((item) => {
    const restNum = getRandomIntInclusive(0, dataArray.length - 1);
    return dataArray[restNum];
  });
  console.log(listItems);
  const targetList = document.querySelector('#resto-list');
  targetList.innerHTML = '';
  listItems.forEach((item) => {
    const injectThisItem = `<li>${item.name}</li>`;
    targetList.innerHTML += injectThisItem;
  });
}

async function mainEvent() {
  const form = document.querySelector('.main_form');
  const submit = document.querySelector('.submitButton');
  const results = await fetch('/api/foodServicesPG'); 
  const arrayFromJson = await results.json();
  
  
  console.log(form)
  
  submit.style.display = 'none';
  if (arrayFromJson.data.length > 0) {
    console.log(arrayFromJson);
    submit.style.display = 'block';
    form.addEventListener('submit', async (submitEvent) => {
      submitEvent.preventDefault();
      console.log('form submission');      
      currArray = restoArrayMake(arrayFromJson.data);
      console.log(currArray);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests