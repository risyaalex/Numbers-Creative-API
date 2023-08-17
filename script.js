const dayInput = document.getElementById('day-input');
const monthInput = document.getElementById('month-input');
const weatherInfo = document.getElementById('date-info');
const searchButton = document.getElementById('search-button');

let data = null;
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
	const result = await response.text();
	console.log(result);
        if (!response.ok) {
        data = null;
        throw new Error("Network response was not ok"); 
    }
    
    data = await response.json();
    console.log("Loading data...");
    console.log("FETCHING DATA...");
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
  } finally {
    isLoading = false;
    // fetchNumberData(data);
    // console.log("fetchData:", data);
    console.log("END OF FETCHING DATA...");
  }
}

fetchData(1, 12)