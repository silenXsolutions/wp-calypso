/**
 * External dependencies
 */
import { connect } from 'react-redux';
import merge from 'lodash/merge';
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import { signup } from 'state/themes/actions' ;
import { getSignupUrl } from './helpers';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import ThemeShowcase, { sheetOptions } from './theme-showcase';

const mergeProps = ( stateProps, dispatchProps, ownProps ) => Object.assign(
	{},
	ownProps,
	stateProps,
	{
		options: merge(
			{},
			{
				signup: {
					label: i18n.translate( 'Pick this design', {
						comment: 'when signing up for a WordPress.com account with a selected theme'
					} ),
					action: dispatchProps.signup,
					getUrl: theme => getSignupUrl( theme ),
				},
				preview: {
					hideForTheme: theme => theme.active
				}
			},
			sheetOptions()
		),
		defaultOption: 'signup',
		getScreenshotOption: () => 'info'
	}
);

export default connect(
	state => ( {
		queryParams: getQueryParams( state ),
		themesList: getThemesList( state )
	} ),
	{ signup },
	mergeProps
)( ThemeShowcase );
