  const dayInput = document.getElementById('day-input');
  const monthInput = document.getElementById('month-input');
  const dateInfo = document.getElementById('date-info');
  const searchButton = document.getElementById('search-button');

  let result = "";
  let isLoading = false;
  
window.addEventListener('load', displaySavedFacts);

  // fetch Data
  async function fetchData(day, month) {

    const url = `https://numbersapi.p.rapidapi.com/${day}/${month}/date?fragment=true&json=true`;
    console.log("fetchData:", url);
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '5716441854msh420403d54a0ef24p1e4bcdjsn4d01a8c6b8cd',
        'X-RapidAPI-Host': 'numbersapi.p.rapidapi.com'
      }
    };

    try {
      isLoading = true;
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Network response was not ok"); 
      } else {
        result = await response.json();
      }
    } catch (error) {
      console.error(error);
    }
      finally {
      isLoading = false;
      renderData(result);
      // console.log("finally:", result);
    }
  }
  
  // render Data

  function renderData(data) {
  let content = "";
  console.log("renderData:", data);
  if (data) {
    const year = data.year >= 0 ? data.year : `${Math.abs(data.year)} BC`;
    const textContent = data.text;
    content = `<div class="facts"><h3 class="day">On this day, ${monthInput.value}/${dayInput.value}/${year}</h3>
    <p id="typed-text"></p><p><button class="save-button"><img src="save.svg" alt="">  Save</button></p></div>`;
    

    dateInfo.innerHTML = isLoading ? `<p class="error">Loading Data...</p>` : content;

    const typedText = document.getElementById("typed-text");
    if (typedText) {
      typeWriterEffect(typedText, textContent, 50);
    }

  const saveButton = dateInfo.querySelector('.save-button');
    if (saveButton) {
     
      saveButton.addEventListener('click', () => {
        
        saveFact({
          date: `${monthInput.value}/${dayInput.value}/${year}`,
          fact: textContent,
        });
        
        displaySavedFacts();
      });
    }
  } else {
    content = `<p class="error">Data unavailable...</p>`;
    dateInfo.innerHTML = isLoading ? `<p class="error">Loading Data...</p>` : content;
  }
}

  // onclick search Button

  function searchData() {
    const dayInputValue = parseInt(dayInput.value.trim(), 10);
    const monthInputValue = parseInt(monthInput.value.trim(), 10);
    
    if ((dayInputValue >= 1 && dayInputValue <= 31) && (monthInputValue >= 1 && monthInputValue <= 12)) {
      fetchData(dayInputValue, monthInputValue);
      console.log("Day:", dayInputValue);
      console.log("Month:", monthInputValue);
    } else {
      dateInfo.innerHTML = `<p class="error">Please enter valid date</p>`;
    }
    
  }    

searchButton.addEventListener('click', searchData);

// Typing effect

function typeWriterEffect(element, text, speed) {
  let i = 0;
  function type() {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }
  type();
}

// save fact

function saveFact(fact) {
  const savedFacts = getSavedFacts();
  const isDuplicate = savedFacts.some((savedFact) => {
    return savedFact.date === fact.date && savedFact.fact === fact.fact;
  });
  
  if (isDuplicate) {
    dateInfo.innerHTML = `<p class="error">This fact is already saved.</p>`;
    return;
  }
  savedFacts.push(fact);
  localStorage.setItem('savedFacts', JSON.stringify(savedFacts));
}

// delete Saved fact

function deleteFact(index) {
  const savedFacts = getSavedFacts();
  savedFacts.splice(index, 1);
  localStorage.setItem('savedFacts', JSON.stringify(savedFacts));
}

// get Saved Facts

function getSavedFacts() {
  const savedFacts = localStorage.getItem('savedFacts');
  return savedFacts ? JSON.parse(savedFacts) : [];
}

// show Saved Facts

function displaySavedFacts() {
  const savedFacts = getSavedFacts();
  const savedFactsList = document.getElementById('saved-facts-list');
  
  savedFactsList.innerHTML = '';
  
  savedFacts.forEach((fact, index) => {
    const listItem = document.createElement('li');
    listItem.innerHTML = `
      <div class="flex"><p>On this day,${fact.date}, ${fact.fact}.</p>
      <button class="delete-button" data-index="${index}">❌</button></div>
    `;
    
    const deleteButton = listItem.querySelector('.delete-button');
    deleteButton.addEventListener('click', () => {
      const indexToDelete = parseInt(deleteButton.getAttribute('data-index'));

      deleteFact(indexToDelete);

      displaySavedFacts();
    });
    
    savedFactsList.appendChild(listItem);
  });

  const savedFactsContainer = document.querySelector('.saved-facts');
  if (savedFacts.length > 0) {
    savedFactsContainer.style.display = 'block';
  } else {
    savedFactsContainer.style.display = 'none';
  }
}

// clear all

const clearButton = document.getElementById('clear-button');
clearButton.addEventListener('click', () => {
  clearAllFacts();
  displaySavedFacts();
});

function clearAllFacts() {
  localStorage.removeItem('savedFacts');
}