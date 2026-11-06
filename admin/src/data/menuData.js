const defaultMenu = [
  { id: 1, name: 'Garden Burrata', description: 'Heirloom tomatoes, basil oil, sourdough', price: 16, category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 2, name: 'Beef Carpaccio', description: 'Parmesan, capers, rocket, truffle dressing', price: 19, category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 3, name: 'Wild Mushroom Soup', description: 'Cream, thyme, roasted chestnuts, brioche', price: 13, category: 'Starters', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 4, name: 'Crispy Calamari', description: 'Chili aioli, lemon, pickled herbs', price: 15, category: 'Starters', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 5, name: 'Truffle Tagliatelle', description: 'Fresh pasta, wild mushrooms, aged parmesan', price: 18, category: 'Mains', image: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 6, name: 'Grilled Sea Bass', description: 'Charred lemon, herbs, seasonal vegetables', price: 24, category: 'Mains', image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 7, name: 'Slow-Cooked Lamb', description: 'Smoked aubergine, jus, pomegranate', price: 27, category: 'Mains', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 8, name: 'Charred Steak', description: 'Pepper sauce, hand-cut fries, watercress', price: 32, category: 'Mains', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 9, name: 'Burnt Honey Tart', description: 'Vanilla cream, sea salt, toasted hazelnut', price: 12, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 10, name: 'Dark Chocolate Fondant', description: 'Chocolate sauce, crème fraîche, cocoa nibs', price: 13, category: 'Desserts', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 11, name: 'Classic Tiramisu', description: 'Espresso, mascarpone, cocoa, ladyfingers', price: 11, category: 'Desserts', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 12, name: 'Fresh Citrus Spritz', description: 'Orange, lemon, rosemary, sparkling water', price: 8, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 13, name: 'Berry Lemonade', description: 'Seasonal berries, lemon, basil', price: 8, category: 'Drinks', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 14, name: 'Cold Brew Coffee', description: 'Single-origin coffee, vanilla cream', price: 7, category: 'Drinks', image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 15, name: 'Whipped Feta', description: 'Honey, pistachio, oregano, warm flatbread', price: 12, category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 16, name: 'Seasonal Tartlet', description: 'Roasted vegetables, goats cheese, herbs', price: 14, category: 'Starters', image: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 17, name: 'Herb-Roasted Chicken', description: 'Potato puree, glazed carrots, chicken jus', price: 22, category: 'Mains', image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 18, name: 'Wild Salmon', description: 'Fennel, citrus beurre blanc, dill', price: 26, category: 'Mains', image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 19, name: 'Mushroom Risotto', description: 'Arborio rice, porcini, mascarpone, truffle', price: 20, category: 'Mains', image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 20, name: 'Ricotta Ravioli', description: 'Spinach, brown butter, sage, hazelnut', price: 21, category: 'Mains', image: 'https://images.unsplash.com/photo-1556761223-4c4282c73f77?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 21, name: 'Eggplant Milanese', description: 'Tomato fondue, basil, parmesan, olive oil', price: 19, category: 'Mains', image: 'https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 22, name: 'Lemon Meringue', description: 'Lemon curd, torched meringue, shortbread', price: 12, category: 'Desserts', image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 23, name: 'Seasonal Pavlova', description: 'Fresh berries, vanilla cream, mint', price: 13, category: 'Desserts', image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 24, name: 'Affogato', description: 'Vanilla gelato, espresso, almond biscotti', price: 8, category: 'Desserts', image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 25, name: 'Cucumber Cooler', description: 'Cucumber, lime, mint, soda', price: 7, category: 'Drinks', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 26, name: 'House Iced Tea', description: 'Black tea, peach, lemon, vanilla', price: 7, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 27, name: 'Ginger Mule', description: 'Ginger, lime, bitters, soda', price: 8, category: 'Drinks', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 28, name: 'Tropical Smoothie', description: 'Mango, pineapple, coconut, lime', price: 9, category: 'Drinks', image: 'https://images.unsplash.com/photo-1502741224143-90386d7f8cdd?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 29, name: 'Watermelon Refresher', description: 'Watermelon, mint, lime, sparkling water', price: 8, category: 'Drinks', image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=700&q=85', available: true },
  { id: 30, name: 'Fresh Citrus Spritz', description: 'Orange, lemon, rosemary, sparkling water', price: 8, category: 'Drinks', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=700&q=85', available: true },
]

export function loadMenu() {
  try {
    const stored = JSON.parse(localStorage.getItem('savory-menu') || 'null')
    return Array.isArray(stored) && stored.length ? stored : defaultMenu
  } catch {
    return defaultMenu
  }
}

export function saveMenu(menu) {
  localStorage.setItem('savory-menu', JSON.stringify(menu))
}
