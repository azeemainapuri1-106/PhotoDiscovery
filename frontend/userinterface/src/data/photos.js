// MOCK DATA ONLY.
// Used by src/services/photoService.js while VITE_USE_MOCK=true.
// Once the backend is live you can delete this file.
//
// Shape of one photo (this is the shape the UI expects):
// {
//   id:           string | number  - unique id
//   title:        string
//   photographer: string
//   category:     string           - must match a category name
//   image:        string           - full image URL
//   ratio:        'portrait' | 'landscape'
// }

export const mockPhotos = [
  {
    id: 'photo-1',
    title: 'Morning light in the mountains',
    photographer: 'Luca Bravo',
    category: 'Nature',
    image:
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-2',
    title: 'Still life, afternoon edition',
    photographer: 'Annie Spratt',
    category: 'Still life',
    image:
      'https://images.unsplash.com/photo-1490312278390-ab64016e0aa9?auto=format&fit=crop&w=900&q=85',
    ratio: 'landscape',
  },
  {
    id: 'photo-3',
    title: 'A quiet corner of the city',
    photographer: 'Toa Heftiba',
    category: 'Architecture',
    image:
      'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-4',
    title: 'Coastal air',
    photographer: 'Tyler Lastovich',
    category: 'Travel',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=900&q=85',
    ratio: 'landscape',
  },
  {
    id: 'photo-5',
    title: 'Soft forms, hard light',
    photographer: 'Pawel Czerwinski',
    category: 'Art & design',
    image:
      'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-6',
    title: 'Somewhere in the Dolomites',
    photographer: 'Jaanus Jagomägi',
    category: 'Nature',
    image:
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-7',
    title: 'A room to come home to',
    photographer: 'Spacejoy',
    category: 'Interiors',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
    ratio: 'landscape',
  },
  {
    id: 'photo-8',
    title: 'The long way home',
    photographer: 'Eberhard Grossgasteiger',
    category: 'Travel',
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-9',
    title: 'Warmth in the everyday',
    photographer: 'Kari Shea',
    category: 'Interiors',
    image:
      'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-10',
    title: 'Lines of the old town',
    photographer: 'Léonard Cotte',
    category: 'Architecture',
    image:
      'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=900&q=85',
    ratio: 'landscape',
  },
  {
    id: 'photo-11',
    title: 'Wild, at the water’s edge',
    photographer: 'Luca Bravo',
    category: 'Nature',
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-12',
    title: 'Sunday in the sun',
    photographer: 'Anna Sullivan',
    category: 'Travel',
    image:
      'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85',
    ratio: 'landscape',
  },
  {
    id: 'photo-13',
    title: 'A little more color',
    photographer: 'Deanna J',
    category: 'Still life',
    image:
      'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
  {
    id: 'photo-14',
    title: 'A house among the trees',
    photographer: 'Daniel Chen',
    category: 'Architecture',
    image:
      'https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=900&q=85',
    ratio: 'landscape',
  },
  {
    id: 'photo-15',
    title: 'Blue hour, still water',
    photographer: 'Simon Berger',
    category: 'Nature',
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=85',
    ratio: 'portrait',
  },
]
