/**
 * External dependencies
 */
import { connect } from 'react-redux';
import merge from 'lodash/merge';

/**
 * Internal dependencies
 */
import { signup } from 'state/themes/actions' ;
import { getSignupUrl, getDetailsUrl, getSupportUrl, getHelpUrl, isPremium } from './helpers';
import actionLabels from './action-labels';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import ThemeShowcase from './theme-showcase';

export default connect(
	state => ( {
		queryParams: getQueryParams( state ),
		themesList: getThemesList( state )
	} ),
	{ signup },
	( stateProps, dispatchProps, ownProps ) => Object.assign(
		{},
		ownProps,
		stateProps,
		{
			options: merge(
				{},
				{
					signup: {
						action: dispatchProps.signup,
						getUrl: theme => getSignupUrl( theme ),
					},
					preview: {
						hideForTheme: theme => theme.active
					},
					separator: {
						separator: true
					},
					info: {
						getUrl: theme => getDetailsUrl( theme ),
					},
					support: {
						getUrl: theme => getSupportUrl( theme ),
						// Free themes don't have support docs.
						hideForTheme: theme => ! isPremium( theme )
					},
					help: {
						getUrl: theme => getHelpUrl( theme )
					}
				},
				actionLabels
			),
			defaultOption: 'signup',
			getScreenshotOption: () => 'info'
		}
	)
)( ThemeShowcase );
