import * as v from "valibot";

export const MandatoryItemsSchema = (mandatoryTypes: string[]) =>
  v.object(
    Object.fromEntries(
      mandatoryTypes.map((type) => [
        type,
        v.pipe(v.array(v.any()), v.minLength(1, `Expected grouped items to have at least 1 item of type '${type}'`)),
      ])
    )
  );

export type TItemsByType<Item extends { type: string }, Type extends string> = Record<Type, Item[]>;

export const groupByType = <Item extends { type: Type }, Type extends string>(
  items: Item[],
  knownTypes: readonly Type[],
  mandatoryTypes: Type[]
): TItemsByType<Item, Type> => {
  // Always have a key/array pair for known types regardless of which items are present
  // Not seeing a type in the return object? Add it to knownTypes
  const groupedItems = {} as TItemsByType<Item, Type>;
  knownTypes.forEach((type) => (groupedItems[type] = []));

  items.forEach((item) => {
    if (item.type in groupedItems) groupedItems[item.type].push(item);
  });

  // Validate that there is at least one item per mandatory item type
  const MandatoryTypesSchema = MandatoryItemsSchema(mandatoryTypes);
  v.parse(MandatoryTypesSchema, groupedItems);

  return groupedItems;
};
