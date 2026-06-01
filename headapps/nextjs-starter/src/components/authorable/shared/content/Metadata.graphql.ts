const GetParentItemQuery = /** GQL */ `
  query GetParentItemQuery($itemID: String!, $language: String!) {
    item: item(path: $itemID, language: $language) {
      parent {
        id
        categoryName: field(name: "categoryName"){
            ... on TextField {
                value
            }
        }
      }
    }
  }
`;

export default GetParentItemQuery;

export type GetParentItemQueryResult = {
  item: {
    parent?: {
      id: string;
      categoryName: { value: string };
    };
  };
};

export const GetPageUpdatedQuery = /** GQL */ `
  query GetPageUpdatedQuery($itemID: String!, $language: String!) {
    item(path: $itemID, language: $language) {
      updated: field(name: "__Updated") {
        ... on DateField {
          value
        }
      }
    }
  }
`;

export type GetPageUpdatedQueryResult = {
  item?: {
    updated?: {
      value?: string;
    };
  };
};
