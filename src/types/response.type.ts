export interface IReponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
