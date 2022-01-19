export type Money = {
  amount: number;
  currency: string;
};

export type Address = {
  line1: string;
  line2: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone_number: string;
};

export enum CardType {
  VIRTUAL = "VIRTUAL",
  PHYSICAL = "PHYSICAL",
}

export enum LimitType {
  CARD = "CARD",
  USER = "USER",
}

export enum SpendDuration {
  MONTHLY = "MONTHLY",
  QUARTERLY = "QUARTERLY",
  YEARLY = "YEARLY",
  ONE_TIME = "ONE_TIME",
}

export interface Card {
  id: string;
  owner: {
    type: string;
    user_id: string;
  };
  status?: "ACTIVE" | "SHIPPED" | "EXPIRED" | "LOCKED" | "TERMINATED";
  last_four: string;
  card_name: string;
  card_type?: CardType;
  limit_type: LimitType;
  spend_controls?: {
    spend_limit: Money;
    spend_available: Money;
    spend_duration?: SpendDuration;
    reason: string;
    lock_after_date: string;
  };
  billing_address: Address;
  mailing_address?: Address;
}

export interface PaginatedResponse<Data> {
  next_cursor?: string;
  items: Data[];
}

export interface CardPan {
  id: string;
  number: string;
  cvv: string;
  expiration_date: {
    month: number;
    year: number;
  };
}

export interface Departments {
  id: string;
  name: string;
  description: string;
}
[];

export interface Locations {
  id: string;
  name: string;
  description: string;
}
[];

export enum CardTerminationReason {
  CARD_DAMAGED = "CARD_DAMAGED",
  CARD_LOST = "CARD_LOST",
  CARD_NOT_RECEIVED = "CARD_NOT_RECEIVED",
  DO_NOT_NEED_PHYSICAL_CARD = "DO_NOT_NEED_PHYSICAL_CARD",
  DO_NOT_NEED_VIRTUAL_CARD = "DO_NOT_NEED_VIRTUAL_CARD",
  FRAUD = "FRAUD",
  OTHER = "OTHER",
}

export type UserStatus =
  | "INVITED"
  | "ACTIVE"
  | "CLOSED"
  | "DISABLED"
  | "DELETED"
  | "PENDING_ACTIVATION";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  status: UserStatus;
  manager_id: string;
  department_id: string;
  location_id: string;
}
