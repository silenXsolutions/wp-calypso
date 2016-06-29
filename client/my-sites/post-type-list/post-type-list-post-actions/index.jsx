/**
 * External dependencies
 */
import React, { PropTypes } from 'react';

/**
 * Internal dependencies
 */
import EllipsisMenu from 'components/ellipsis-menu';
import PostTypeListPostActionsEdit from './edit';
import PostTypeListPostActionsTrash from './trash';
import PostTypeListPostActionsView from './view';
import PostTypeListPostActionsRestore from './restore';

export default function PostTypeListPostActions( { globalId } ) {
	return (
		<div className="post-type-list-post-actions">
			<EllipsisMenu position="bottom left">
				<PostTypeListPostActionsView globalId={ globalId } />
				<PostTypeListPostActionsEdit globalId={ globalId } />
				<PostTypeListPostActionsRestore globalId={ globalId } />
				<PostTypeListPostActionsTrash globalId={ globalId } />
			</EllipsisMenu>
		</div>
	);
}

PostTypeListPostActions.propTypes = {
	globalId: PropTypes.string
};
