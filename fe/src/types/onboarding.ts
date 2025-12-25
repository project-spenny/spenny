export type Gender = 'male' | 'female' | 'none';

export type FormErrors = Partial<{
  nickname: string;
  birth_date: string;
  gender: string;
}>;
