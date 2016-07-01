/** @ssr-ready **/

/**
 * External dependencies
 */
import i18n from 'i18n-calypso';

/**
 * Internal dependencies
 */
import config from 'config';
import {
	getSignupUrl,
	getDetailsUrl,
	getSupportUrl,
	getHelpUrl,
	isPremium
} from './helpers';

export const purchase = config.isEnabled( 'upgrades/checkout' )
	? {
		label: i18n.translate( 'Purchase', {
			context: 'verb'
		} ),
		header: i18n.translate( 'Purchase on:', {
			context: 'verb',
			comment: 'label for selecting a site for which to purchase a theme'
		} ),
		hideForTheme: theme => ! theme.price || theme.active || theme.purchased
	}
	: {};

export const activate = {
	label: i18n.translate( 'Activate' ),
	header: i18n.translate( 'Activate on:', { comment: 'label for selecting a site on which to activate a theme' } ),
	hideForTheme: theme => theme.active || ( theme.price && ! theme.purchased )
};

export const customize = {
	label: i18n.translate( 'Customize' ),
	header: i18n.translate( 'Customize on:', { comment: 'label in the dialog for selecting a site for which to customize a theme' } ),
	hideForTheme: theme => ! theme.active
};

export const tryandcustomize = {
	label: i18n.translate( 'Try & Customize' ),
	header: i18n.translate( 'Try & Customize on:', {
		comment: 'label in the dialog for opening the Customizer with the theme in preview'
	} ),
	hideForTheme: theme => theme.active
};

export const preview = {
	label: i18n.translate( 'Live demo', {
		comment: 'label for previewing the theme demo website'
	} ),
	hideForTheme: theme => theme.active
};

export const signup = {
	label: i18n.translate( 'Pick this design', {
		comment: 'when signing up for a WordPress.com account with a selected theme'
	} ),
	getUrl: theme => getSignupUrl( theme )
};

export const getSheetOptions = ( site = false, isJetpack = false ) => ( {
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
