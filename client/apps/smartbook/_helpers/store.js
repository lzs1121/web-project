import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../_reducers';

const middleware = [ thunkMiddleware ];

//Close the logger in the produnction model
if (process.env.NODE_ENV !== 'production') {
	middleware.push(createLogger());
}

export const store = createStore(
	rootReducer,
	applyMiddleware(...middleware)
);