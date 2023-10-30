import MockAdapter from 'axios-mock-adapter';
import mocks from './mock.json';
import { AxiosInstance } from 'axios';

const Mock = (axios: AxiosInstance) => {
  const mock = new MockAdapter(axios);

  mock.onPost(/login/).reply(200, mocks.login);
  mock.onGet(/cnpj/).reply(200, mocks.cnpj);
  mock.onGet(/evento/).reply(200, mocks.eventos);
  mock.onPost(/evento/).reply(200, mocks.eventos);
};

export default Mock;