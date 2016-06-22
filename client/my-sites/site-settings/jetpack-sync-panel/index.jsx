/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import get from 'lodash/get';
import throttle from 'lodash/throttle';
import reduce from 'lodash/reduce';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Button from 'components/button';
import Notice from 'components/notice';
import ProgressBar from 'components/progress-bar';
import pollers from 'lib/data-poller';
import { getSyncStatus, scheduleJetpackFullysync } from 'state/jetpack-sync/actions';
import { getSelectedSiteId } from 'state/ui/selectors';
import { selectSyncStatus, selectFullSyncRequest } from 'state/jetpack-sync/selectors';

/*
 * Module variables
 */

const JetpackSyncPanel = React.createClass( {
	displayName: 'JetpackSyncPanel',

	componentWillMount() {
		this.throttledPoller = throttle( this.fetchSyncStatus, 2000 );
	},

	componentWillReceiveProps( nextProps ) {
		const isNewlyScheduled = get( nextProps, 'fullSyncRequest.scheduled' ) && ! get( this.props, 'fullSyncRequest.scheduled' );
		const isFinished = get( nextProps, 'syncStatus.finished' );
		const isStarted = get( nextProps, 'syncStatus.started' );

		console.log( {
			nextProps,
			isNewlyScheduled,
			isFinished,
			isStarted
		} );

		if ( isNewlyScheduled ) {
			console.log( 'fetch newly scheduled' );
			this.throttledPoller();
		} else if ( isStarted && ! isFinished ) {
			console.log( 'fetch started and not finished' );
			this.throttledPoller();
		}
	},

	fetchSyncStatus() {
		this.props.getSyncStatus( this.props.siteId );
	},

	onSyncRequestButtonClick( event ) {
		event.preventDefault();
		this.props.scheduleJetpackFullysync( this.props.siteId );
	},

	renderStatusNotice() {
		const classes = classNames( 'jetpack-sync-panel__notice' );
		return (
			<Notice isCompact className={ classes }>
				Placeholder text
			</Notice>
		);
	},

	renderProgressBar() {
		const isFinished = get( this.props, 'syncStatus.finished' );
		const isStarted = get( this.props, 'syncStatus.started' );

		console.log( {
			isFinished,
			isStarted
		} );

		if ( ! isStarted || isFinished ) {
			return null;
		}

		const queued = get( this.props, 'syncStatus.queue' );
		const sent = get( this.props, 'syncStatus.sent' );

		console.log( {
			queued,
			sent
		} )

		if ( ! queued || ! sent ) {
			return (
				<ProgressBar value={ 0 } />
			);
		}

		const countQueued = reduce( queued, ( sum, value ) => {
			return sum += value;
		}, 0 );

		const countSent = reduce( sent, ( sum, value ) => {
			return sum += value;
		}, 0 );

		console.log( {
			countQueued,
			countSent
		} )

		return (
			<ProgressBar
				value={ countSent }
				total={ countQueued }
			/>
		);
	},

	render() {
		return (
			<Card className="jetpack-sync-panel">
				<div className="jetpack-sync-panel__action-group">
					<div className="jetpack-sync-panel__description">
						{ this.translate(
							'{{strong}}Jetpack Sync keeps your WordPress.com dashboard up to date.{{/strong}} ' +
							'Data is sent from your site to the WordPress.com dashboard regularly to provide a faster experience. ' +
							'If you suspect some data is missing, you can initiate a sync manually.',
							{
								components: {
									strong: <strong />
								}
							}
						) }
					</div>

					<div className="jetpack-sync-panel__action">
						<Button onClick={ this.onSyncRequestButtonClick }>
							{ this.translate( 'Perform full sync', { context: 'Button' } ) }
						</Button>
					</div>
				</div>

				{ this.renderStatusNotice() }
				{ this.renderProgressBar() }
			</Card>
		);
	}
} );

export default connect(
	state => {
		const siteId = getSelectedSiteId( state );

		return {
			siteId,
			syncStatus: selectSyncStatus( state ),
			fullSyncRequest: selectFullSyncRequest( state )
		};
	},
	dispatch => bindActionCreators( { getSyncStatus, scheduleJetpackFullysync }, dispatch )
)( JetpackSyncPanel );
