/**
 * External dependencies
 */
import React, { Component } from 'react';
import { localize } from 'i18n-calypso';
import page from 'page';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import SectionHeader from 'components/section-header';
import Button from 'components/button';

class HostSelect extends Component {
	showHost( hostSlug ) {
		// Temporary page redirect with a # in it.
		page( `/settings/export/${this.props.siteSlug}/guided#${hostSlug}` );
	}

	render() {
		const { translate } = this.props;
		const hostButtons = [
			{
				onClick: () => this.showHost( 'bluehost' ),
				logo: '/calypso/images/guided-transfer/bluehost-logo.png',
				label: translate( 'Bluehost' )
			},
			{
				onClick: () => this.showHost( 'siteground' ),
				logo: '/calypso/images/guided-transfer/siteground-logo.png',
				label: translate( 'SiteGround' )
			},
		];

		return (
			<div>
				<SectionHeader label={ translate( 'Set up Guided Transfer' ) } />
				<Card>
					<p>{ translate(
`{{strong}}Please choose{{/strong}} one of our Guided Transfer compatible
{{partner_link}}partner hosts{{/partner_link}}. You must have a hosting account
with one of them to be able to move your site. Visit them {{lobby_link}}Guided
Transfer Lobby{{/lobby_link}} if you have any question before starting, or
{{learn_link}}learn more{{/learn_link}} about the process.`,
						{
							components: {
								strong: <strong />,
								partner_link: <a href="https://get.wp.com/gt-hosting/" />,
								lobby_link: <a href="https://guidedtransfer.wordpress.com/" />,
								learn_link: <a href="https://en.support.wordpress.com/guided-transfer/" />,
							}
						} ) }
					</p>
					<div>
						{ hostButtons.map( ( buttonOptions, index ) => {
							return (
								<Button
									className="guided-transfer__host-button"
									onClick={ buttonOptions.onClick }
									key={ index }
									aria-label={ buttonOptions.label } >
									<img className="guided-transfer__host-button-image" src={ buttonOptions.logo } />
								</Button>
							);
						} ) }
					</div>
				</Card>
			</div>
		);
	}
}

export default localize( HostSelect );
