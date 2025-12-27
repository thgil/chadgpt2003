const fortunes = [
  { luck: 'GREAT', message: 'Best day ever! Everything goes your way!', color: '#ff00ff' },
  { luck: 'GOOD', message: 'Looking good! Your chats will be fire today', color: '#00ffff' },
  { luck: 'DECENT', message: 'Not bad. Maybe grab a coffee', color: '#00ff00' },
  { luck: 'OK', message: 'Normal day. But normal is nice too', color: '#ffff00' },
  { luck: 'MEH', message: 'Gets better later! Evening is your time', color: '#ff9900' },
  { luck: 'BAD', message: 'Watch out. Double-check those typos', color: '#ff6600' },
  { luck: 'AWFUL', message: 'Rough day ahead. But AI has your back', color: '#ff0000' },
  { luck: 'LEGENDARY', message: 'Once in a lifetime luck! Buy a lottery ticket!!', color: '#ff00ff' },
];

const luckyItems = [
  'Melon bread', 'Ramen', 'Green tea', 'Cat', 'Keyboard',
  'USB drive', 'Mouse', 'Plant', 'Coffee', 'Headphones',
  'Fan', 'Monitor', 'Glasses', 'Pen', 'Notebook',
];

const luckyDirections = ['North', 'South', 'East', 'West', 'NE', 'SW', 'NW', 'SE'];

const luckyColors = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Purple', 'Orange', 'White', 'Black'];

export interface Fortune {
  luck: string;
  message: string;
  color: string;
  luckyItem: string;
  luckyDirection: string;
  luckyColor: string;
  luckyNumber: number;
}

export function getTodaysFortune(): Fortune {
  // Use date as seed for consistent daily fortune
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const seededRandom = (max: number, offset: number = 0) => {
    const x = Math.sin(seed + offset) * 10000;
    return Math.floor((x - Math.floor(x)) * max);
  };

  const fortune = fortunes[seededRandom(fortunes.length, 1)];

  return {
    ...fortune,
    luckyItem: luckyItems[seededRandom(luckyItems.length, 2)],
    luckyDirection: luckyDirections[seededRandom(luckyDirections.length, 3)],
    luckyColor: luckyColors[seededRandom(luckyColors.length, 4)],
    luckyNumber: seededRandom(100, 5),
  };
}
