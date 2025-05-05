import { POI } from '@/types';
import { getNearbyPOIs } from './poiService';

interface VoiceCommandResponse {
  response: string;
  poi?: POI;
}

// Mock voice command processing service
export async function processVoiceCommand(command: string): Promise<VoiceCommandResponse> {
  // In a real app, this would connect to a natural language processing service
  // like Dialogflow, Lex, or a custom NLP backend
  
  // For demo, we'll just use simple keyword matching
  const commandLower = command.toLowerCase();
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Handle different types of commands
  if (commandLower.includes('nearby') || commandLower.includes('near me')) {
    // Handle nearby POI requests
    if (commandLower.includes('museum')) {
      const pois = await getNearbyPOIs(40.7794, -73.9632); // Example coordinates
      const museums = pois.filter(poi => poi.name.includes('Museum') || poi.description.includes('museum'));
      
      if (museums.length > 0) {
        return {
          response: `I found ${museums.length} museums nearby. The closest one is ${museums[0].name}, which is ${museums[0].shortDescription}.`,
          poi: museums[0]
        };
      } else {
        return {
          response: "I couldn't find any museums near your current location."
        };
      }
    } else if (commandLower.includes('restaurant') || commandLower.includes('food')) {
      return {
        response: "I found several restaurants nearby. The closest ones are Joe's Pizza, Cafe Luna, and Green Garden Restaurant."
      };
    } else {
      const pois = await getNearbyPOIs(40.7580, -73.9855); // Example coordinates
      
      return {
        response: `I found ${pois.length} points of interest nearby. The closest one is ${pois[0].name}, which is ${pois[0].shortDescription}.`,
        poi: pois[0]
      };
    }
  } else if (commandLower.includes('history') || commandLower.includes('about')) {
    // Handle requests for historical information
    if (commandLower.includes('empire state') || commandLower.includes('empire')) {
      return {
        response: "The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan. It was completed in 1931 and was the world's tallest building until 1970. It's named after New York's nickname, the Empire State.",
        poi: {
          id: '1',
          name: 'Empire State Building',
          location: 'New York City, USA',
          latitude: 40.7484,
          longitude: -73.9857,
          shortDescription: 'Iconic 102-story skyscraper in Midtown Manhattan',
          description: "The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan, New York City. The building was designed by Shreve, Lamb & Harmon and built from 1930 to 1931.",
          imageUrl: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg',
        }
      };
    } else if (commandLower.includes('liberty') || commandLower.includes('statue')) {
      return {
        response: "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor. It was a gift from the people of France, dedicated in 1886. The statue represents Libertas, the Roman goddess of freedom.",
        poi: {
          id: '2',
          name: 'Statue of Liberty',
          location: 'New York Harbor, USA',
          latitude: 40.6892,
          longitude: -74.0445,
          shortDescription: 'Colossal neoclassical sculpture on Liberty Island',
          description: "The Statue of Liberty is a colossal neoclassical sculpture on Liberty Island in New York Harbor in New York City. The copper statue, a gift from the people of France, was designed by French sculptor Frédéric Auguste Bartholdi.",
          imageUrl: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg',
        }
      };
    } else {
      return {
        response: "This area has a rich history. It was first settled by Native Americans, and later became an important center for trade and commerce. Many historical events have taken place here over the centuries."
      };
    }
  } else if (commandLower.includes('where am i') || commandLower.includes('my location')) {
    // Handle location requests
    return {
      response: "You are currently in Midtown Manhattan, New York City. There are several points of interest nearby, including Times Square, the Empire State Building, and Central Park."
    };
  } else if (commandLower.includes('take me to') || commandLower.includes('directions to')) {
    // Handle navigation requests
    let destination = '';
    
    if (commandLower.includes('empire state')) {
      destination = 'Empire State Building';
      return {
        response: `I'll help you navigate to the ${destination}. It's about 0.8 miles northeast from your current location.`,
        poi: {
          id: '1',
          name: 'Empire State Building',
          location: 'New York City, USA',
          latitude: 40.7484,
          longitude: -73.9857,
          shortDescription: 'Iconic 102-story skyscraper in Midtown Manhattan',
          description: "The Empire State Building is a 102-story Art Deco skyscraper in Midtown Manhattan, New York City. The building was designed by Shreve, Lamb & Harmon and built from 1930 to 1931.",
          imageUrl: 'https://images.pexels.com/photos/2190283/pexels-photo-2190283.jpeg',
        }
      };
    } else if (commandLower.includes('central park')) {
      destination = 'Central Park';
      return {
        response: `I'll help you navigate to ${destination}. It's about 1.2 miles north from your current location.`,
        poi: {
          id: '3',
          name: 'Central Park',
          location: 'Manhattan, New York City, USA',
          latitude: 40.7829,
          longitude: -73.9654,
          shortDescription: 'Urban park in the heart of Manhattan',
          description: "Central Park is an urban park in New York City located between the Upper West and Upper East Sides of Manhattan. It is the fifth-largest park in the city, covering 843 acres.",
          imageUrl: 'https://images.pexels.com/photos/449627/pexels-photo-449627.jpeg',
        }
      };
    } else {
      // Extract destination from command
      const matches = commandLower.match(/take me to (.+)/) || commandLower.match(/directions to (.+)/);
      destination = matches ? matches[1] : 'your destination';
      
      return {
        response: `I'll help you navigate to ${destination}. Let me find the best route for you.`
      };
    }
  } else {
    // Default response for unrecognized commands
    return {
      response: "I'm not sure how to help with that. You can ask me about nearby attractions, the history of a place, or how to get to a specific location."
    };
  }
}