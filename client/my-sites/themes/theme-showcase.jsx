/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import i18n, { localize } from 'i18n-calypso';
import pickBy from 'lodash/pickBy';
import merge from 'lodash/merge';
import get from 'lodash/get';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import ThemePreview from './theme-preview';
import ThemesSelection from './themes-selection';
import PageViewTracker from 'lib/analytics/page-view-tracker';
import {
	getDetailsUrl,
	getSupportUrl,
	getHelpUrl,
	isPremium,
	addTracking
} from './helpers';

export const sheetOptions = ( site = false, isJetpack = false ) => ( {
	separator: {
		separator: true
	},
	info: {
		label: i18n.translate( 'Info', {
			comment: 'label for displaying the theme info sheet'
		} ),
		getUrl: theme => getDetailsUrl( theme, site ), // TODO: Make this a selector
	},
	support: ! isJetpack // We don't know where support docs for a given theme on a self-hosted WP install are.
		? {
			label: i18n.translate( 'Setup' ),
			getUrl: theme => getSupportUrl( theme, site ),
			hideForTheme: theme => ! isPremium( theme )
		}
		: {},
	help: ! isJetpack // We don't know where support forums for a given theme on a self-hosted WP install are.
		? {
			label: i18n.translate( 'Support' ),
			getUrl: theme => getHelpUrl( theme, site )
		}
		: {}
} );

const optionShape = PropTypes.shape( {
	label: PropTypes.string.isRequired,
	header: PropTypes.string,
	getUrl: PropTypes.func,
	action: PropTypes.func
} );

const ThemeShowcase = React.createClass( {
	propTypes: {
		// Connected props
		options: PropTypes.objectOf( optionShape ),
		defaultOption: optionShape,
		getScreenshotOption: PropTypes.func
	},

	getDefaultProps() {
		return {
			selectedSite: false
		};
	},

	getInitialState() {
		return {
			showPreview: false,
			previewingTheme: null,
		};
	},

	togglePreview( theme ) {
		this.setState( { showPreview: ! this.state.showPreview, previewingTheme: theme } );
	},

	onPreviewButtonClick( theme ) {
		const { defaultOption } = this.props;
		this.setState( { showPreview: false }, () => {
			defaultOption.action( theme );
		} );
	},

	render() {
		// If a preview action is passed, use that. Otherwise, use our own.
		const previewAction = get(
			this.props.options,
			[ 'preview', 'action' ],
			theme => this.togglePreview( theme )
		);
		const buttonOptions = merge(
			{},
			this.props.options,
			{ preview: {
				label: this.props.translate( 'Live demo', {
					comment: 'label for previewing the theme demo website'
				} ),
				action: previewAction
			} }
		);
		const { defaultOption } = this.props;
		const getScreenshotOption = theme => this.props.getScreenshotOption( theme );

		return (
			<Main className="themes">
				<PageViewTracker path={ this.props.analyticsPath } title={ this.props.analyticsPageTitle }/>
				{ this.props.children }
				{ this.state.showPreview &&
					<ThemePreview showPreview={ this.state.showPreview }
						theme={ this.state.previewingTheme }
						onClose={ this.togglePreview }
						buttonLabel={ defaultOption.label }
						onButtonClick={ this.onPreviewButtonClick } />
				}
				<ThemesSelection search={ this.props.search }
					siteId={ this.props.siteId }
					selectedSite={ this.props.selectedSite }
					getScreenshotUrl={ function( theme ) {
						if ( ! getScreenshotOption( theme ).getUrl ) {
							return null;
						}
						return getScreenshotOption( theme ).getUrl( theme );
					} }
					onScreenshotClick={ function( theme ) {
						if ( ! getScreenshotOption( theme ).action ) {
							return;
						}
						getScreenshotOption( theme ).action( theme );
					} }
					getActionLabel={ function( theme ) {
						return getScreenshotOption( theme ).label;
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

export default localize( ThemeShowcase );
