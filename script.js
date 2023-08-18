  const dayInput = document.getElementById('day-input');
  const monthInput = document.getElementById('month-input');
  const dateInfo = document.getElementById('date-info');
  const searchButton = document.getElementById('search-button');

  let result = "";
  let isLoading = false;

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
    <p id="typed-text"></p></div>`;
    
    dateInfo.innerHTML = isLoading ? `<p class="error">Loading Data...</p>` : content;

    const typedText = document.getElementById("typed-text");
    if (typedText) {
      typeWriterEffect(typedText, textContent, 50);
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