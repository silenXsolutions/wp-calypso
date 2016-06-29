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
import { getPost } from 'state/posts/selectors';
import { getPostType } from 'state/post-types/selectors';
import { getCurrentUserId, canCurrentUser } from 'state/current-user/selectors';
import { getEditorPath } from 'state/ui/editor/selectors';

function PostTypeListPostActionsEdit( { translate, label, canEdit, status, editUrl } ) {
	if ( 'trash' === status || ! canEdit ) {
		return null;
	}

	return (
		<PopoverMenuItem href={ editUrl } icon="pencil">
			{ label || translate( 'Edit', { context: 'verb' } ) }
		</PopoverMenuItem>
	);
}

PostTypeListPostActionsEdit.propTypes = {
	globalId: PropTypes.string,
	translate: PropTypes.func.isRequired,
	label: PropTypes.string,
	canEdit: PropTypes.bool,
	status: PropTypes.string,
	editUrl: PropTypes.string
};

export default connect( ( state, ownProps ) => {
	const post = getPost( state, ownProps.globalId );
	if ( ! post ) {
		return {};
	}

	const type = getPostType( state, post.site_ID, post.type );
	const userId = getCurrentUserId( state );

	let capability;
	if ( get( post.author, 'ID' ) === userId ) {
		capability = get( type, 'capabilities.edit_posts' );
	} else {
		capability = get( type, 'capabilities.edit_others_posts' );
	}

	return {
		label: get( type, 'labels.edit_item' ),
		canEdit: capability && canCurrentUser( state, post.site_ID, capability ),
		status: post.status,
		editUrl: getEditorPath( state, post.site_ID, post.ID )
	};
} )( localize( PostTypeListPostActionsEdit ) );
