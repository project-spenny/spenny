export type Gender = 'male' | 'female';

export type FormErrors = Partial<{
  nickname: string;
  birth_date: string;
  gender: string;
}>;
