/**
 * Interfaces are the parts shared between several integration.
 *
 * Each integration should be located in its own module and file
 * and export 3 things:
 *
 *   - `Item`: a _type_ that extends the `Item` interface with
 *     the fields specific to the integration.
 *
 *   - `Fetch`: a _function_ that fetches the items and returns
 *     a promise (`() => Promise<Array<Item>>`)
 *
 *   - `BuildCard`: a _function_ that takes an item (the
 *     integration's type `Item`) and a `() => void` function
 *     that will trigger a refresh of all items - e.g. to be
 *     used when an item is modified), and returns a
 *     `JSX.Element` representing the item.
 */

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
