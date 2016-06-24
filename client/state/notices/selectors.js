/**
 * External dependencies
 */
import values from 'lodash/values';

/**
 * Internal dependencies
 */
import createSelector from 'lib/create-selector';

export const getNotices = createSelector(
	( state ) => values( state.notices.items ),
	( state ) => state.notices.items
);
