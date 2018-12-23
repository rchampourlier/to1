interface Card {
  notifyChange: () => void;
}

interface Item {
  key: string;
  created: string;
  type: string;
}

export {
  Card,
  Item
};
