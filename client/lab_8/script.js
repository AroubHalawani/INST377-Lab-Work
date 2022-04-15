function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function restoArrayMake(dataArray){
  const range = [...Array(15).keys()];
  const listItems = range.map((item, index) => {
    const restNum = getRandomIntInclusive(0, dataArray.length - 1);
    return dataArray[restNum];
  });
  return listItems;
  
}
  
function createHtmlList(collection) {
  const targetList = document.querySelector('#resto-list');
  targetList.innerHTML = "";
  collection.forEach((item) => {
    const {name} = item;
    const displayName = name.toLowerCase();
    const injectThisItem = `<li>${item.name}</li>`;
    targetList.innerHTML += injectThisItem;
  });
}

function initMap (targetId) {
  const latLong = [38.7849, -76.8721];
  const map = L.map(targetId).setView(latLong, 13);
  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox/streets-v11',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
}).addTo(map);
return map;
}

function addMapMarkers (map, collection) {
  map.eachLayer((layer) => {
    if (layer instanceof L.Marker) {
      layer.remove();
    }
  });
  
  collection.forEach((item) => {
  const point = item.geocoded_column_1?.coordinates;
  console.log(item.geocoded_column_1?.coordinates);
  L.marker([point[1], point[0]]).addTo(map);
  });
}

async function mainEvent() { 
  const form = document.querySelector('.main_form');
  const submit = document.querySelector('.submitButton');
  const results = await fetch('/api/foodServicesPG'); 
  const arrayFromJson = await results.json(); 
  const resto = document.querySelector('#resto_name');
  const zipcode = document.querySelector('#zipcode');

  submit.style.display = 'none';

  const map = initMap('map');
  const retrievalVar = 'restaurants';
  
  console.log(arrayFromJson);
  localStorage.setItem(retrievalVar, JSON.stringify(arrayFromJson.data));

  const storedDataString = localStorage.getItem(retrievalVar);
  const storedDataArray = JSON.parse(storedDataString);
  console.log(storedDataArray);

  if (storedDataArray.length > 0) {
    submit.style.display = 'block';
  
    let currentArray = [];

    resto.addEventListener('input', async (event) => {
      console.log(event.target.value);
      
      if (currentArray.length < 1) {
        return;
      }
      
      const selectedResto = storedDataArray.filter((item) => {
        const lowerName = item.name.toLowerCase();
        const lowerValue = event.target.value.toLowerCase();
        return lowerName.includes(lowerValue);
      });

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
      
      createHtmlList(selectedZipcode);
    });

    form.addEventListener('submit', async (submitEvent) => { 
      submitEvent.preventDefault(); 
      currentArray = restoArrayMake(storedDataArray);
      createHtmlList(currentArray);
      addMapMarkers(map, currentArray);
      createHtmlListZip(currentArray);
    });
  }
}

  
document.addEventListener('DOMContentLoaded', async () => mainEvent()); // the async keyword means we can make API requests