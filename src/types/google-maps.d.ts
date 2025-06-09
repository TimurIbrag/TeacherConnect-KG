
declare global {
  interface Window {
    google?: {
      maps?: {
        Map: any;
        places?: {
          AutocompleteService: any;
          PlacesService: any;
          Autocomplete: any;
        };
        Geocoder: any;
        LatLng: any;
        Marker: any;
        InfoWindow: any;
      };
    };
  }
}

export {};
