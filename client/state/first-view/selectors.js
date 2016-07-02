/** @ssr-ready **/

/**
 * External dependencies
 */
import some from 'lodash/some';

/**
 * Internal dependencies
 */
import { FIRST_VIEW_SECTIONS } from './constants';

export function isSectionFirstViewable( view ) {
	return some( FIRST_VIEW_SECTIONS, section => section === view );
}

export function isViewVisible( state, view ) {
	return isSectionFirstViewable( view ) && -1 !== state.firstView.visible.indexOf( view );
}

export function isViewEnabled( state, view ) {
	return isSectionFirstViewable( view ) && -1 === state.firstView.disabled.indexOf( view );
}
