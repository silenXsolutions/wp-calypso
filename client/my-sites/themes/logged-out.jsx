/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import pickBy from 'lodash/pickBy';
import merge from 'lodash/merge';

/**
 * Internal dependencies
 */
import Main from 'components/main';
import { signup } from 'state/themes/actions' ;
import ThemePreview from './theme-preview';
import ThemesSelection from './themes-selection';
import { getSignupUrl, getDetailsUrl, getSupportUrl, getHelpUrl, isPremium, addTracking } from './helpers';
import actionLabels from './action-labels';
import { getQueryParams, getThemesList } from 'state/themes/themes-list/selectors';
import PageViewTracker from 'lib/analytics/page-view-tracker';

export const ThemeShowcase = React.createClass( {
	propTypes: {
		// Connected props
		options: PropTypes.objectOf( PropTypes.shape( {
			label: PropTypes.string.isRequired,
			header: PropTypes.string,
			getUrl: PropTypes.func,
			action: PropTypes.func
		} ) ),
		defaultOption: PropTypes.string
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
		const defaultOption = this.props.options[ this.props.defaultOption ];
		this.setState( { showPreview: false }, () => {
			defaultOption.action( theme );
		} );
	},

	render() {
		const buttonOptions = merge(
			{},
			this.props.options,
			{ preview: {
				label: actionLabels.preview.label,
				action: theme => this.togglePreview( theme )
			} }
		),
			defaultOption = this.props.options[ this.props.defaultOption ];

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
		{ options: merge(
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
		), defaultOption: 'signup' }
	)
)( ThemeShowcase );
