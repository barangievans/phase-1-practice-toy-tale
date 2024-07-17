document.addEventListener('DOMContentLoaded', () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');

  // Function to fetch and render toys
  const fetchToys = () => {
    fetch('http://localhost:3000/toys')
      .then(response => response.json())
      .then(toys => {
        toys.forEach(toy => {
          const card = createToyCard(toy);
          toyCollection.appendChild(card);
        });
      })
      .catch(error => console.error('Error fetching toys:', error));
  };

  // Function to create a card for a toy
  const createToyCard = (toy) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.setAttribute('data-id', toy.id);

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;
    card.appendChild(h2);

    const img = document.createElement('img');
    img.src = toy.image;
    img.classList.add('toy-avatar');
    card.appendChild(img);

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;
    card.appendChild(p);

    const likeButton = document.createElement('button');
    likeButton.textContent = 'Like ❤️';
    likeButton.classList.add('like-btn');
    likeButton.addEventListener('click', () => {
      likeToy(toy.id, toy.likes + 1);
    });
    card.appendChild(likeButton);

    return card;
  };

  // Function to add a new toy
  addToyForm.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(addToyForm);
    const newToy = {
      name: formData.get('name'),
      image: formData.get('image'),
      likes: 0 // Initial likes
    };

    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(newToy)
    })
      .then(response => response.json())
      .then(addedToy => {
        const card = createToyCard(addedToy);
        toyCollection.appendChild(card);
        addToyForm.reset();
      })
      .catch(error => console.error('Error adding new toy:', error));
  });

  // Function to like a toy
  const likeToy = (toyId, newLikes) => {
    fetch(`http://localhost:3000/toys/${toyId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
      .then(response => response.json())
      .then(updatedToy => {
        const cardToUpdate = document.querySelector(`.card[data-id="${updatedToy.id}"]`);
        cardToUpdate.querySelector('p').textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error('Error updating likes:', error));
  };

  // Initial fetch and render of toys
  fetchToys();
});
