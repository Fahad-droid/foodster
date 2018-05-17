const app = document.getElementById('root');

const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);


var dataList = document.getElementById('json-datalist');
var input = document.getElementById('userInput');


// Create a new XMLHttpRequest.
var request = new XMLHttpRequest();

// Handle state changes for the request.
request.onload = function (response) {
    if (request.readyState === 4) {
        if (request.status === 200) {
            // Parse the JSON
            var jsonOptions = JSON.parse(this.response);

            // Loop over the JSON response.
            jsonOptions.cities.forEach(city => {
                // Create a new <option> element.
                var option = document.createElement('option');
                // Set the value using the item in the JSON array.
                option.value = city;
                // Add the <option> element to the <datalist>.
                dataList.appendChild(option);
            });

            // Update the placeholder text.
            input.placeholder = "e.g. Toronto";
        } else {
            // An error occured :(
            input.placeholder = "Couldn't load the cities :(";
        }
    }
};

// Update the placeholder text.
input.placeholder = "Loading options...";

// Set up and make the request.
request.open('GET', 'https://opentable.herokuapp.com/api/cities', true);
request.send();


var input = document.getElementById("userInput");
input.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("submit").click();
    }
});

var submitButton = document.getElementById('submit');
submitButton.addEventListener('click', fetchRestos);

function fetchRestos(e) {
    var city = document.getElementById("userInput").value;

    var restaurantHTML = document.createElement('div');

    if (city != '') {
        var request = new XMLHttpRequest();
        request.open('GET', 'https://opentable.herokuapp.com/api/restaurants?city=' + city, true);
        request.onload = function () {

            // Begin accessing JSON data here
            var data = JSON.parse(this.response);
            if (request.status >= 200 && request.status < 400 && data.restaurants.length >= 1) {
                data.restaurants.forEach(restaurant => {
                    const card = document.createElement('div');
                    card.setAttribute('class', 'card');

                    const h1 = document.createElement('h1');
                    h1.textContent = restaurant.name;

                    const img = document.createElement('img');
                    img.src = restaurant.image_url;

                    const add = document.createElement('p');
                    add.textContent = "Address: " + restaurant.address;

                    range = restaurant.price;
                
                    switch (range) {
                        case 2:
                            price = "$30 and under";
                            break;    
                        case 3:
                            price = "$31 to $50";
                            break;    
                        case 4:
                            price = "$50 and over"
                            break;
                    }

                    const prc = document.createElement('p');
                    prc.textContent = "Price: " + price;

                    restaurantHTML.appendChild(card);
                    card.appendChild(h1);
                    card.appendChild(img);
                    card.appendChild(add);
                    card.appendChild(prc);

                });
                
                container.innerHTML = restaurantHTML.innerHTML;
                container.removeAttribute('id');
            } else {
                console.log(request.status);
                const errorMessage = document.createElement('h2');
                errorMessage.textContent = `Something went wrong! Let's try a different city.`;
                container.setAttribute('id', 'info');
                container.innerHTML = errorMessage.innerHTML;
            }

        }
        request.send();
    } else {
        const errorMessage = document.createElement('h2');
        errorMessage.textContent = `We need a city to find you some nice restaurants!`;
        container.setAttribute('id', 'info');
        container.innerHTML = errorMessage.innerHTML;

    }
}
