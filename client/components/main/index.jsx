/** @ssr-ready **/

/**
 * External dependencies
 */
import React from 'react';
import { connect }	from 'react-redux';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { getSectionName } from 'state/ui/selectors';
import { isViewVisible } from 'state/first-view/selectors';

const Main = React.createClass( {
	displayName: 'Main',

	render: function() {
		const classes = classnames( this.props.className, 'main', {
			'is-first-view-visible': this.props.isFirstViewVisible
		} );

		return (
			<main className={ classes } role="main">
				{ this.props.children }
			</main>
		);
	}
} );

export default connect(
	( state ) => {
		const sectionName = getSectionName( state );

		return {
			isFirstViewVisible: isViewVisible( state, sectionName ),
		};
	},
	null
)( Main );
