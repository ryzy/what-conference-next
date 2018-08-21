/**
 * Basic entity model.
 * Base for more complex data structures.
 */
export interface Entity {
  id: string;
  name: string;
}

export interface AppSortInfo {
  active: string; // field to sort on
  direction?: 'asc' | 'desc' | ''; // desc, when missing
}
