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
import actionLabels from './action-labels';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import config from 'config';
import ThemeShowcase, { sheetOptions } from './theme-showcase';

const ThemesMultiSite = ( props ) => (
	<ThemesSiteSelectorModal { ...props } sourcePath={ '/design' }>
		<ThemeShowcase>
			<SidebarNavigation />
		</ThemeShowcase>
	</ThemesSiteSelectorModal>
);

const mergeProps = ( stateProps, dispatchProps, ownProps ) => Object.assign(
	{},
	ownProps,
	stateProps,
	{
		options: merge(
			{},
			mapValues( dispatchProps, actionFn => ( {
				action: ( theme, site ) => actionFn( theme, site, 'showcase' )
			} ) ),
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
			},
			sheetOptions(),
			actionLabels
		),
		defaultOption: 'tryandcustomize',
		getScreenshotOption: () => 'info'
	}
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
	mergeProps
)( ThemesMultiSite );
