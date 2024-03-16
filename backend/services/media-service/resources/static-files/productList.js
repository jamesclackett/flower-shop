const port = 8000;
const IMAGE_URL = 'http://localhost:' + port + '/image/';

const productList = [{   id: '1',
    name:  'Bright Yellow Dahlia',
    price: 29.99,
    desc: 'Dahlia is a genus of bushy, tuberous, herbaceous perennial plants native to Mexico and Central America.',
    quantity: 23,
    imageUrl: IMAGE_URL + "yellow.jpg"
    }, 
    {   id: '2',
    name:  'Easter Lilly',
    price: 11,
    desc: 'Lilium longiflorum, often called the Easter lily, is a species of plant endemic to both Taiwan and Ryukyu Islands. Lilium formosanum, a closely related species from Taiwan, has been treated as a variety of Easter lily in the past.',
    quantity: 1,
    imageUrl: IMAGE_URL + "lily.jpg"
    }, 
    {   id: '3',
    name:  'Eden Rose 85',
    price: 30,
    desc: 'Rosa "Eden" is a light pink and white climbing rose. The cultivar was created by Marie-Louise Meilland and introduced in France by Meilland International in 1985.',
    quantity: 63,
    imageUrl: IMAGE_URL + "red-rose.jpg"
    },
    {   id: '4',
    name:  'Begonia',
    price: 99,
    desc: 'Begonia is a genus of perennial flowering plants in the family Begoniaceae. The genus contains more than 2,000 different plant species',
    quantity: 15,
    imageUrl: IMAGE_URL + "pink-flowers.jpg"
    },
    {   id: '5',
    name:  'Dancing-lady Orchid',
    price: 9,
    desc: 'Orchids are plants that belong to the family Orchidaceae, a diverse and widespread group of flowering plants with blooms that are often colourful and fragrant.',
    quantity: 11,
    imageUrl: IMAGE_URL + "white-flowers.jpg"
    },
    {   id: '6',
    name:  'Easter Lilly',
    price: 11,
    desc: 'Lilium longiflorum, often called the Easter lily, is a species of plant endemic to both Taiwan and Ryukyu Islands. Lilium formosanum, a closely related species from Taiwan.',
    quantity: 1,
    imageUrl: IMAGE_URL + "lily.jpg"
    }, 
    {   id: '7',
    name:  'Begonia',
    price: 99,
    desc: 'Begonia is a genus of perennial flowering plants in the family Begoniaceae. The genus contains more than 2,000 different plant species',
    quantity: 15,
    imageUrl: IMAGE_URL + "pink-flowers.jpg"
    },
    {   id: '8',
    name:  'Easter Lilly',
    price: 11,
    desc: 'Lilium longiflorum, often called the Easter lily, is a species of plant endemic to both Taiwan and Ryukyu Islands. Lilium formosanum, a closely related species from Taiwan, has been treated as a variety of Easter lily in the past.',
    quantity: 1,
    imageUrl: IMAGE_URL + "lily.jpg"
    },
    {   id: '9',
    name:  'Bright Yellow Dahlia',
    price: 29.99,
    desc: 'Dahlia is a genus of bushy, tuberous, herbaceous perennial plants native to Mexico and Central America.',
    quantity: 23,
    imageUrl: IMAGE_URL + "yellow.jpg"
    }, 
    {   id: '10',
    name:  'Easter Lilly',
    price: 11,
    desc: 'Lilium longiflorum, often called the Easter lily, is a species of plant endemic to both Taiwan and Ryukyu Islands. Lilium formosanum, a closely related species from Taiwan, has been treated as a variety of Easter lily in the past.',
    quantity: 1,
    imageUrl: IMAGE_URL + "lily.jpg"
    }, 
    {   id: '11',
    name:  'Eden Rose 85',
    price: 30,
    desc: 'Rosa "Eden" is a light pink and white climbing rose. The cultivar was created by Marie-Louise Meilland and introduced in France by Meilland International in 1985.',
    quantity: 63,
    imageUrl: IMAGE_URL + "red-rose.jpg"
    },
    {   id: '12',
    name:  'Begonia',
    price: 99,
    desc: 'Begonia is a genus of perennial flowering plants in the family Begoniaceae. The genus contains more than 2,000 different plant species',
    quantity: 15,
    imageUrl: IMAGE_URL + "pink-flowers.jpg"
    },
    {   id: '13',
    name:  'Dancing-lady Orchid',
    price: 9,
    desc: 'Orchids are plants that belong to the family Orchidaceae, a diverse and widespread group of flowering plants with blooms that are often colourful and fragrant.',
    quantity: 11,
    imageUrl: IMAGE_URL + "white-flowers.jpg"
    },
    {   id: '14',
    name:  'Easter Lilly',
    price: 11,
    desc: 'Lilium longiflorum, often called the Easter lily, is a species of plant endemic to both Taiwan and Ryukyu Islands. Lilium formosanum, a closely related species from Taiwan, has been treated as a variety of Easter lily in the past.',
    quantity: 1,
    imageUrl: IMAGE_URL + "lily.jpg"
    }, 
    {   id: '15',
    name:  'Begonia',
    price: 99,
    desc: 'Begonia is a genus of perennial flowering plants in the family Begoniaceae. The genus contains more than 2,000 different plant species',
    quantity: 15,
    imageUrl: IMAGE_URL + "pink-flowers.jpg"
    },
    {   id: '16',
    name:  'Easter Lilly',
    price: 11,
    desc: 'Lilium longiflorum, often called the Easter lily, is a species of plant endemic to both Taiwan and Ryukyu Islands. Lilium formosanum, a closely related species from Taiwan, has been treated as a variety of Easter lily in the past.',
    quantity: 1,
    imageUrl: IMAGE_URL + "lily.jpg"
    }
]

module.exports = productList;