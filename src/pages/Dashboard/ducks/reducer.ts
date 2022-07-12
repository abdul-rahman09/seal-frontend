import { ALL_FILES } from 'pages/Dashboard/ducks/action-types';
import { LOADING } from 'pages/Dashboard/ducks/action-types';

const initialState = {
  isLoading: false,
  files: [],
};

function reducer(state = initialState, action: any) {
  switch (action.type) {
    case LOADING:
      state = { ...state, isLoading: action.payload };
      break;
    case ALL_FILES:
      state = { ...state, files: action.payload };
      break;
    default:
  }
  return state;
}

export default reducer;
