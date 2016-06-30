/**
 * External dependencies
 */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import get from 'lodash/get';

/**
 * Internal dependencies
 */
import PopoverMenuItem from 'components/popover/menu-item';
import QueryPostTypes from 'components/data/query-post-types';
import { getPost } from 'state/posts/selectors';
import { getPostType } from 'state/post-types/selectors';

function PostTypeListPostActionsView( { translate, siteId, label, status } ) {
	if ( 'trash' === status ) {
		return null;
	}

	function viewPost() {
		alert( 'Not Yet Implemented' );
	}

	return (
		<PopoverMenuItem onClick={ viewPost } icon="external">
			{ siteId && <QueryPostTypes siteId={ siteId } /> }
			{ label || translate( 'View', { context: 'verb' } ) }
		</PopoverMenuItem>
	);
}

PostTypeListPostActionsView.propTypes = {
	globalId: PropTypes.string,
	translate: PropTypes.func.isRequired,
	siteId: PropTypes.number,
	label: PropTypes.string,
	status: PropTypes.string
};

export default connect( ( state, ownProps ) => {
	const post = getPost( state, ownProps.globalId );
	if ( ! post ) {
		return {};
	}

	return {
		siteId: post.site_ID,
		label: get( getPostType( state, post.site_ID, post.type ), 'labels.view_item' ),
		status: post.status
	};
} )( localize( PostTypeListPostActionsView ) );
