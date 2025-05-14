const React = require('react');
const { View } = require('react-native');

// Créer un vrai composant map pour le web
const WebMapView = React.forwardRef((props, ref) => {
  const { style, initialRegion, children, ...otherProps } = props;
  const mapRef = React.useRef(null);
  const [isLoaded, setIsLoaded] = React.useState(false);

  React.useEffect(() => {
    // Charger Google Maps API
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
      script.async = true;
      script.defer = true;
      
      window.initMap = () => {
        setIsLoaded(true);
      };
      
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

  React.useEffect(() => {
    if (isLoaded && mapRef.current && window.google) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: {
          lat: initialRegion?.latitude || 40.7128,
          lng: initialRegion?.longitude || -74.0060
        },
        zoom: 13,
        styles: [] // Vous pouvez ajouter des styles ici
      });
      
      // Vous pouvez ajouter des markers ici
    }
  }, [isLoaded, initialRegion]);

  return React.createElement(
    View,
    {
      ...otherProps,
      ref: ref,
      style: style
    },
    React.createElement('div', {
      ref: mapRef,
      style: {
        width: '100%',
        height: '100%',
        minHeight: 300
      }
    }),
    children
  );
});

module.exports = {
  default: WebMapView,
  MapView: WebMapView,
  Marker: View,
  Polyline: View,
  Circle: View,
  Polygon: View,
  Callout: View,
  PROVIDER_GOOGLE: 'google',
  PROVIDER_DEFAULT: 'default'
};