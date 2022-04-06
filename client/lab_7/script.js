function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function restoArrayMake(dataArray) {
  const range = [...Array(15).keys()];
  const listItems = range.map((item, index) => {
    const restNum = getRandomIntInclusive(0, dataArray.length);
    return dataArray[restNum];
  });

  return listItems;
}

function createHtmlList(collection) {
  const targetList = document.querySelector('#resto-list');
  targetList.innerHTML = '';
  collection.forEach((item) => {
    const {name} = item;
    const displayName = name.toLowerCase();
    const injectThisItem = `<li>${displayName}</li>`;
    targetList.innerHTML += injectThisItem;
  });
}

async function mainEvent() { 
  console.log('script loaded'); 
  const form = document.querySelector('.main_form');
  const submit = document.querySelector('.submitButton');
  const results = await fetch('https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'); 
  const arrayFromJson = await results.json(); 
  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');
  submit.style.display = 'none';

  if (arrayFromJson.length > 0) {
    submit.style.display = 'block';

    let currentArray = [];

    resto.addEventListener('input', async (event) => {
      console.log(event.target.value);

      if (currentArray.length < 1) {
        return;
      }

      const selectedResto = currentArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });
      console.log(selectedResto);
      createHtmlList(selectedResto);
    });

    
    zipcode.addEventListener('input', async (event) => {
      console.log(event.target.value);

      if (currentArray.length < 1) {
        return;
      }
      const selectedZipcode = currentArray.filter((item) => {
        const zipcodeNumber = item.zip;
        const zipcodeValue = event.target.value;
        return zipcodeNumber.includes(zipcodeValue);
      });
      console.log(selectedZipcode);
      createHtmlList(selectedZipcode);
    });

    form.addEventListener('submit', async (submitEvent) => { 
      submitEvent.preventDefault(); 
      currentArray = restoArrayMake(arrayFromJson);
      console.log(currentArray);
      createHtmlList(currentArray);
    });
  }
}

document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests
