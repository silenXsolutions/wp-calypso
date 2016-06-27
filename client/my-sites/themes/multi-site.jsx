/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import pickBy from 'lodash/pickBy';
import merge from 'lodash/merge';
import mapValues from 'lodash/mapValues';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import {
	customize as tryandcustomize,
	purchase,
	activate
} from 'state/themes/actions';
import ThemePreview from './theme-preview';
import SidebarNavigation from 'my-sites/sidebar-navigation';
import ThemesSiteSelectorModal from './themes-site-selector-modal';
import ThemesSelection from './themes-selection';
import { getDetailsUrl, getSupportUrl, getHelpUrl, isPremium, addTracking } from './helpers';
import actionLabels from './action-labels';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import config from 'config';

const ThemesMultiSite = React.createClass( {
	getInitialState() {
		return {
			showPreview: null,
			previewingTheme: null,
		};
	},

	togglePreview( theme ) {
		this.setState( { showPreview: ! this.state.showPreview, previewingTheme: theme } );
	},

	onPreviewButtonClick( theme ) {
		this.setState( { showPreview: false }, () => {
			this.props.options.tryandcustomize.action( theme );
		} );
	},

	render() {
		const buttonOptions = merge(
			{},
			{ preview: {
				label: actionLabels.preview.label,
				action: theme => this.togglePreview( theme )
			} },
			this.props.options,
		);

		return (
			<Main className="themes">
				<PageViewTracker path={ this.props.analyticsPath } title={ this.props.analyticsPageTitle }/>
				<SidebarNavigation />
				{ this.state.showPreview &&
					<ThemePreview showPreview={ this.state.showPreview }
						theme={ this.state.previewingTheme }
						onClose={ this.togglePreview }
						buttonLabel={ this.translate( 'Try & Customize', {
							context: 'when previewing a theme demo, this button opens the Customizer with the previewed theme'
						} ) }
						onButtonClick={ this.onPreviewButtonClick } />
				}
				<ThemesSelection search={ this.props.search }
					selectedSite={ false }
					getScreenshotUrl={ buttonOptions.info.getUrl }
					getActionLabel={ function() {
						return buttonOptions.info.label;
					} }
					getOptions={ function( theme ) {
						return pickBy(
							addTracking( buttonOptions ),
							option => ! ( option.hideForTheme && option.hideForTheme( theme ) )
						); } }
					trackScrollPage={ this.props.trackScrollPage }
					tier={ this.props.tier }
					queryParams={ this.props.queryParams }
					themesList={ this.props.themesList } />
			</Main>
		);
	}
} );

const ThemesMultiSiteComp = ( props ) => (
	<ThemesSiteSelectorModal { ...props } sourcePath={ '/design' }>
		<ThemesMultiSite />
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
		{ options: merge(
			{},
			mapValues( dispatchProps, action => ( { action } ) ),
			{
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
		) }
	)
)( ThemesMultiSiteComp );
