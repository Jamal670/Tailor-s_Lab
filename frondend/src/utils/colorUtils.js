const COLOR_NAME_MAP = {
  '#000000': 'Black',
  '#000': 'Black',
  '#ffffff': 'White',
  '#fff': 'White',
  '#ff0000': 'Red',
  '#ca0707': 'Red',
  '#00ff00': 'Green',
  '#008000': 'Green',
  '#2c3fce': 'Royal Blue',
  '#0000ff': 'Blue',
  '#0000cd': 'Blue',
  '#000080': 'Navy',
  '#1e90ff': 'Blue',
  '#ffff00': 'Yellow',
  '#fff700': 'Yellow',
  '#ffa500': 'Orange',
  '#ffc0cb': 'Pink',
  '#ff1493': 'Pink',
  '#00ffff': 'Cyan',
  '#008080': 'Teal',
  '#808080': 'Gray',
  '#a9a9a9': 'Gray',
  '#654321': 'Brown',
  '#b5651d': 'Brown',
  '#2f4f4f': 'Charcoal',
  '#4b0082': 'Indigo'
};

export const formatColorLabel = (value = '') => {
  if (!value) return 'N/A';
  const normalized = value.trim().toLowerCase();

  if (COLOR_NAME_MAP[normalized]) {
    return COLOR_NAME_MAP[normalized];
  }

  if (normalized.startsWith('#')) {
    return normalized.toUpperCase();
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
};

