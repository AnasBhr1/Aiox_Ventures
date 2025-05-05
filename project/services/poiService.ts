import { POI } from '@/types';

// Mock POI data
const mockPOIs: POI[] = [
  {
    id: '1',
    name: 'Empire State Building',
    location: 'New York City, USA',
    latitude: 40.7484,
    longitude: -73.9857,
    shortDescription: 'Iconic 102-story skyscraper in Midtown Manhattan',
    description: `The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan, New York City. The building was designed by Shreve, Lamb & Harmon and built from 1930 to 1931. Its name is derived from "Empire State", the nickname of the state of New York. The Empire State Building stood as the world's tallest building for nearly 40 years until the construction of the World Trade Center's North Tower in Lower Manhattan in late 1970. Following the September 11 attacks in 2001, it was again the tallest building in New York until the new One World Trade Center was completed in April 2012.

The Empire State Building has a roof height of 1,250 feet (380 m) and stands a total of 1,454 feet (443.2 m) tall, including its antenna. It is now the seventh-tallest building in New York City, and the ninth-tallest completed skyscraper in the United States. The site of the Empire State Building, in Midtown South on the west side of Fifth Avenue between West 33rd and 34th Streets, was developed in 1893 as the Waldorf–Astoria Hotel. In 1929, Empire State Inc. acquired the site with plans to build a skyscraper there, and construction started in March 1930.`,
    imageUrl: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg',
  },
  {
    id: '2',
    name: 'Statue of Liberty',
    location: 'New York Harbor, USA',
    latitude: 40.6892,
    longitude: -74.0445,
    shortDescription: 'Colossal neoclassical sculpture on Liberty Island',
    description: `The Statue of Liberty (Liberty Enlightening the World; French: La Liberté éclairant le monde) is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City, in the United States. The copper statue, a gift from the people of France, was designed by French sculptor Frédéric Auguste Bartholdi and its metal framework was built by Gustave Eiffel. The statue was dedicated on October 28, 1886.

The statue is a figure of Libertas, a robed Roman liberty goddess. She holds a torch above her head with her right hand, and in her left hand carries a tabula ansata inscribed JULY IV MDCCLXXVI (July 4, 1776 in Roman numerals), the date of the U.S. Declaration of Independence. A broken shackle and chain lie at her feet as she walks forward, commemorating the recent national abolition of slavery. After its dedication, the statue became an icon of freedom and of the United States, seen as a symbol of welcome to immigrants arriving by sea.`,
    imageUrl: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
  },
  {
    id: '3',
    name: 'Central Park',
    location: 'Manhattan, New York City, USA',
    latitude: 40.7829,
    longitude: -73.9654,
    shortDescription: 'Urban park in the heart of Manhattan',
    description: `Central Park is an urban park in New York City located between the Upper West and Upper East Sides of Manhattan. It is the fifth-largest park in the city, covering 843 acres (341 ha). It is the most visited urban park in the United States, with an estimated 42 million visitors annually as of 2016, and is the most filmed location in the world.

Central Park was first approved in 1853 as a 778-acre (315 ha) park. In 1857, landscape architects Frederick Law Olmsted and Calvert Vaux won a design competition for the park with their "Greensward Plan". Construction began the same year, and the park's first areas were opened to the public in late 1858. Additional land at the northern end of Central Park was purchased in 1859, and the park was completed in 1876. After a period of decline in the early 20th century, New York City parks commissioner Robert Moses started a program to clean up Central Park in the 1930s. The Central Park Conservancy, founded in 1980, refurbished many parts of the park during the late 20th century, and it continues to maintain the park today.`,
    imageUrl: 'https://images.pexels.com/photos/449627/pexels-photo-449627.jpeg',
  },
  {
    id: '4',
    name: 'Metropolitan Museum of Art',
    location: 'New York City, USA',
    latitude: 40.7794,
    longitude: -73.9632,
    shortDescription: 'The largest art museum in the United States',
    description: `The Metropolitan Museum of Art of New York City, colloquially "the Met", is the largest art museum in the United States. With 6.5 million visitors in 2019, it was the fourth most visited art museum in the world. Its permanent collection contains over two million works, divided among 17 curatorial departments. The main building at 1000 Fifth Avenue, along the Museum Mile on the eastern edge of Central Park on Manhattan's Upper East Side, is by area one of the world's largest art museums. A much smaller second location, The Cloisters at Fort Tryon Park in Upper Manhattan, contains an extensive collection of art, architecture, and artifacts from medieval Europe.

The permanent collection consists of works of art from classical antiquity and ancient Egypt, paintings, and sculptures from nearly all the European masters, and an extensive collection of American and modern art. The Met maintains extensive holdings of African, Asian, Oceanian, Byzantine, and Islamic art. The museum is home to encyclopedic collections of musical instruments, costumes, and accessories, as well as antique weapons and armor from around the world. Several notable interiors, ranging from 1st-century Rome through modern American design, are installed in its galleries.`,
    imageUrl: 'https://images.pexels.com/photos/3019019/pexels-photo-3019019.jpeg',
  },
  {
    id: '5',
    name: 'Times Square',
    location: 'Manhattan, New York City, USA',
    latitude: 40.7580,
    longitude: -73.9855,
    shortDescription: 'Major commercial intersection and tourist destination',
    description: `Times Square is a major commercial intersection, tourist destination, entertainment center, and neighborhood in the Midtown Manhattan section of New York City, at the junction of Broadway and Seventh Avenue. Brightly lit by numerous billboards and advertisements, it stretches from West 42nd to West 47th Streets, and is sometimes referred to as "the Crossroads of the World", "the Center of the Universe", "the heart of the Great White Way", and "the heart of the world". One of the world's busiest pedestrian areas, it is also the hub of the Broadway Theater District and a major center of the world's entertainment industry. Times Square is one of the world's most visited tourist attractions, drawing an estimated 50 million visitors annually. Approximately 330,000 people pass through Times Square daily, many of them tourists, while over 460,000 pedestrians walk through Times Square on its busiest days.

Formerly known as Longacre Square, Times Square was renamed in 1904 after The New York Times moved its headquarters to the then newly erected Times Building, now One Times Square. It is the site of the annual New Year's Eve ball drop, which began on December 31, 1907, and continues to attract over a million visitors to Times Square every year.`,
    imageUrl: 'https://images.pexels.com/photos/5155784/pexels-photo-5155784.jpeg',
  },
];

// Get nearby POIs based on latitude and longitude
export async function getNearbyPOIs(latitude: number, longitude: number, radius = 5): Promise<POI[]> {
  // In a real app, this would be a call to a backend API
  // that would query a database for POIs within the radius
  
  // For demo, we'll return all mock POIs with slightly modified coordinates
  // to make them appear around the user's location
  return new Promise((resolve) => {
    // Add random offset to make POIs appear nearby
    const pois = mockPOIs.map(poi => ({
      ...poi,
      latitude: latitude + (Math.random() - 0.5) * 0.01,
      longitude: longitude + (Math.random() - 0.5) * 0.01,
    }));
    
    // Simulate API delay
    setTimeout(() => resolve(pois), 1000);
  });
}

// Get POI by ID
export async function getPOIById(id: string): Promise<POI> {
  // In a real app, this would be a call to a backend API
  // that would query a database for the specific POI
  
  return new Promise((resolve, reject) => {
    const poi = mockPOIs.find(p => p.id === id);
    
    if (poi) {
      // Simulate API delay
      setTimeout(() => resolve(poi), 500);
    } else {
      setTimeout(() => reject(new Error('POI not found')), 500);
    }
  });
}