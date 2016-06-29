/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';

/**
 * Internal dependencies
 */
import {
	customize as tryandcustomize,
	purchase,
	activate
} from 'state/themes/actions';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import ThemesSiteSelectorModal from './themes-site-selector-modal';
import { getDetailsUrl, getSupportUrl, getHelpUrl, isPremium } from './helpers';
import actionLabels from './action-labels';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import config from 'config';
import { ThemeShowcase } from './logged-out';

const ThemesMultiSite = ( props ) => (
	<ThemesSiteSelectorModal { ...props } sourcePath={ '/design' }>
		<ThemeShowcase>
			<SidebarNavigation />
		</ThemeShowcase>
	</ThemesSiteSelectorModal>
);

export default connect(
	state => ( {
		queryParams: getQueryParams( state ),
		themesList: getThemesList( state )
	} ),
	{
		activate,
		tryandcustomize,
		purchase
	},
	( stateProps, dispatchProps, ownProps ) => Object.assign(
		{},
		ownProps,
		stateProps,
		{
			options: merge(
				{},
				mapValues( dispatchProps, action => ( { action } ) ),
				{
					preview: {},
					purchase: config.isEnabled( 'upgrades/checkout' )
						? {
							hideForTheme: theme => ! theme.price
						}
						: {},
					activate: {
						hideForTheme: theme => theme.price
					},
					tryandcustomize: {},
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
					},
				},
				actionLabels
			),
			defaultOption: 'tryandcustomize',
			getScreenshotOption: () => 'info'
		}
	)
)( ThemesMultiSite );
